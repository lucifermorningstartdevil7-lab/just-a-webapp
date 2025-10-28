'use client'

import { ChartAreaInteractive } from "@/app/components/chart-area-interactive"
import { motion } from "framer-motion"
import { Loader2, Link2, PlusCircle, Sparkles, BarChart3, MousePointerClick, Eye, Layers3, Zap, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { ABTestingPerformance } from "@/app/components/ab-test-performance"


interface PageStats {
  totalViews: number
  totalClicks: number
  engagementRate: string
  activeLinks: number
  totalLinks: number
  pageSlug: string
  uniqueVisitors: number
  previousViews: number
  previousClicks: number
}

interface LinkPerformance {
  id: string
  title: string
  url: string
  clicks: number
  is_active: boolean
  position: number
  performance: "high" | "medium" | "low"
  clickRate: number
  views: number
}

interface AnalyticsData {
  date: string
  views: number
  clicks: number
  engagement: number
}

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.1 },
})

export default function Page() {
  const [pageId, setPageId] = useState<string | null>(null)
  const [hasPage, setHasPage] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("Creator")
  const [stats, setStats] = useState<PageStats>({
    totalViews: 0,
    totalClicks: 0,
    engagementRate: "0%",
    activeLinks: 0,
    totalLinks: 0,
    pageSlug: "",
    uniqueVisitors: 0,
    previousViews: 0,
    previousClicks: 0,
  })
  const [allLinks, setAllLinks] = useState<LinkPerformance[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const router = useRouter()

  useEffect(() => {
    checkUserPage()
  }, [timeRange])

  const checkUserPage = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push("/auth/login")

      setUsername(user.email?.split("@")[0] ?? "User")

      const { data: pageData } = await supabase
        .from("pages")
        .select("id, slug, is_published")
        .eq("user_id", user.id)
        .single()

      if (!pageData) {
        setHasPage(false)
        return
      }

      setPageId(pageData.id)
      setHasPage(true)

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("page_id", pageData.id)
        .order("position", { ascending: true })

      const startDate = getDateRange(timeRange)
      const { data: viewsData } = await supabase
        .from("page_views")
        .select("viewed_at")
        .eq("page_id", pageData.id)
        .gte("viewed_at", startDate)

      const { data: clicksData } = await supabase
        .from("link_clicks")
        .select("link_id, clicked_at")
        .eq("page_id", pageData.id)
        .gte("clicked_at", startDate)

      const views = viewsData?.length ?? 0
      const clicks = clicksData?.length ?? 0
      const activeLinks = linksData?.filter(l => l.is_active).length ?? 0
      const totalLinks = linksData?.length ?? 0
      const engagementRate = views > 0 ? ((clicks / views) * 100).toFixed(1) + "%" : "0%"

      setStats({
        totalViews: views,
        totalClicks: clicks,
        engagementRate,
        activeLinks,
        totalLinks,
        pageSlug: pageData.slug ?? "",
        uniqueVisitors: views,
        previousViews: 0,
        previousClicks: 0,
      })

      const analytics = generateAnalyticsData(viewsData ?? [], clicksData ?? [], timeRange)
      setAnalyticsData(analytics)

      const linkPerformance: LinkPerformance[] =
        linksData?.map(link => {
          const linkClicks = clicksData?.filter(c => c.link_id === link.id).length ?? 0
          const clickRate = views > 0 ? (linkClicks / views) * 100 : 0
          return {
            id: link.id,
            title: link.title,
            url: link.url,
            clicks: linkClicks,
            is_active: link.is_active,
            position: link.position,
            performance: clickRate > 15 ? "high" : clickRate > 5 ? "medium" : "low",
            clickRate,
            views,
          }
        }) ?? []
      setAllLinks(linkPerformance)
    } catch (err) {
      console.error(err)
      setHasPage(false)
    } finally {
      setLoading(false)
    }
  }, [router, timeRange])

  function getDateRange(range: "7d" | "30d" | "90d") {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  function generateAnalyticsData(views: any[], clicks: any[], range: "7d" | "30d" | "90d"): AnalyticsData[] {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const data: AnalyticsData[] = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const dateStr = date.toISOString().split("T")[0]
      const dayViews = views.filter(v => v.viewed_at?.startsWith(dateStr)).length
      const dayClicks = clicks.filter(c => c.clicked_at?.startsWith(dateStr)).length
      data.push({
        date: dateStr,
        views: dayViews,
        clicks: dayClicks,
        engagement: dayViews > 0 ? Math.min((dayClicks / dayViews) * 100, 100) : 0,
      })
    }
    return data
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!hasPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
          <motion.div {...fadeIn(0)} className="text-center space-y-8 max-w-2xl">
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md"
              >
                <Link2 className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <motion.h2 {...fadeIn(1)} className="text-3xl font-bold text-slate-800">
                Welcome, {username}!
              </motion.h2>
              <motion.p {...fadeIn(2)} className="text-lg text-slate-600 max-w-md mx-auto">
                Create your personalized link hub to start tracking engagement and grow your audience.
              </motion.p>
            </div>

            <motion.div {...fadeIn(3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => router.push("/protected/builder")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md shadow-green-500/20 flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Your Page</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Badge className="bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-md text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-1" /> 
                Free forever
              </Badge>
            </motion.div>

            {/* Stats Preview */}
            <motion.div {...fadeIn(4)} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto pt-8">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800 mb-1">3.2x</div>
                <div className="text-sm text-slate-500">Higher CTR</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800 mb-1">89%</div>
                <div className="text-sm text-slate-500">Time Saved</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-slate-800 mb-1">24/7</div>
                <div className="text-sm text-slate-500">Auto-Optimization</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      subtitle: "All-time page visits",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      label: "Total Clicks",
      value: stats.totalClicks.toLocaleString(),
      subtitle: "Link interactions",
      icon: MousePointerClick,
      color: "text-green-600",
    },
    {
      label: "Engagement Rate",
      value: stats.engagementRate,
      subtitle: "Click-through rate",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      label: "Active Links",
      value: `${stats.activeLinks}/${stats.totalLinks}`,
      subtitle: "Currently visible links",
      icon: Layers3,
      color: "text-orange-600",
    },
  ]

  const chartData = analyticsData.map(i => ({
    date: i.date,
    views: i.views,
    clicks: i.clicks,
    engagement: i.engagement
  }))

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Welcome back, {username}! 👋</h1>
              <p className="text-slate-600 mt-1">Here's your latest performance analytics</p>
            </div>
            <Button 
              onClick={() => router.push("/protected/builder")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Edit Page
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart and A/B Testing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Page Performance</h2>
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <ChartAreaInteractive data={chartData} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Active Links</span>
                  <span className="font-medium text-slate-800">{stats.activeLinks}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (stats.activeLinks / Math.max(stats.totalLinks, 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Engagement Rate</span>
                  <span className="font-medium text-slate-800">{stats.engagementRate}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, parseFloat(stats.engagementRate))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-600">Page Status</span>
                  <Badge className="bg-green-100 text-green-700 border border-green-200">
                    {stats.pageSlug ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                {stats.pageSlug && (
                  <a 
                    href={`/${stats.pageSlug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline mt-1 block"
                  >
                    View Page →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* A/B Testing Performance */}
        {pageId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ABTestingPerformance pageId={pageId} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
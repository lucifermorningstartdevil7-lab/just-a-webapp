'use client'


import { ChartAreaInteractive } from "@/app/components/chart-area-interactive"
import { DataTable } from "@/app/components/data-table"
import { SectionCards } from "@/app/components/section-cards"

import { motion } from "framer-motion"
import { Loader2, Link2, PlusCircle, Sparkles, BarChart3, MousePointerClick, Eye, Layers3, Zap, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"

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

  async function checkUserPage() {
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
  }

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-green-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!hasPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
        {/* Animated Background Blurs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
          <motion.div {...fadeIn(0)} className="text-center space-y-8 max-w-2xl">
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25"
              >
                <Link2 className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <motion.h2 {...fadeIn(1)} className="text-4xl font-bold text-gray-900">
                Welcome, {username}!
              </motion.h2>
              <motion.p {...fadeIn(2)} className="text-xl text-gray-600 max-w-md mx-auto">
                Create your personalized link hub to start tracking engagement and grow your audience.
              </motion.p>
            </div>

            <motion.div {...fadeIn(3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                onClick={() => router.push("/protected/builder")}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Your Page</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Badge className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" /> 
                Free forever
              </Badge>
            </motion.div>

            {/* Stats Preview */}
            <motion.div {...fadeIn(4)} className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">3.2x</div>
                <div className="text-sm text-gray-600">Higher CTR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">89%</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Auto-Optimization</div>
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
    value: i.views,
  }))

  const tableData = allLinks.map(link => ({
    id: link.id,
    header: link.title,
    sectionType: "Link",
    status: link.is_active ? "Active" : "Hidden",
    target: link.clicks,
    limit: "-",
    reviewer: link.performance,
  }))

  return (
    
      <>
       
        <div className="flex flex-1 flex-col bg-gradient-to-br from-white to-green-50/30">
          <div className="@container/main flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
              {/* Welcome Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 lg:px-8"
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {username}! 👋</h1>
                  <p className="text-gray-600">Here's your latest performance analytics</p>
                </div>
              </motion.div>

              <SectionCards statsData={statsData} />
              
              <div className="px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <ChartAreaInteractive data={chartData} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-6 lg:px-8"
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <DataTable data={tableData} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
    </>
  )
}
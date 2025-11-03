'use client'

import {
  Home,
  Link as LinkIcon,
  Palette,
  Share2,
  Settings,
  LogOut,
  Zap,
  User,
  Eye,
  MousePointerClick,
  CreditCard,
  Clock,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState({ email: "", pageSlug: "" })
  const [pageStats, setPageStats] = useState({ views: 0, clicks: 0 })

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUserData(prev => ({ ...prev, email: user.email?.split('@')[0] || "User" }))
        
        const { data: pageData } = await supabase
          .from("pages")
          .select("id, slug")
          .eq("user_id", user.id)
          .single()

        if (pageData) {
          setUserData(prev => ({ ...prev, pageSlug: pageData.slug }))
          
          const { data: viewsData } = await supabase
            .from("page_views")
            .select("id")
            .eq("page_id", pageData.id)

          const { data: clicksData } = await supabase
            .from("link_clicks")
            .select("id")
            .eq("page_id", pageData.id)

          setPageStats({
            views: viewsData?.length || 0,
            clicks: clicksData?.length || 0
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/protected/overview" },
    { id: "builder", label: "Builder", icon: LinkIcon, href: "/protected/builder" },
    { id: "customize", label: "Customize", icon: Palette, href: "/protected/customize" },
    { id: "peak-time", label: "Peak Time", icon: Clock, href: "/protected/peak-time" },
    { id: "competitor-benchmark", label: "Competitor Benchmark", icon: TrendingUp, href: "/protected/competitor-benchmark" },
    { id: "content-auto-promotion", label: "Auto Promotion", icon: Zap, href: "/protected/content-auto-promotion" },
    { id: "share", label: "Share", icon: Share2, href: "/protected/share" },
    { id: "pricing", label: "Pricing", icon: CreditCard, href: "/protected/pricing" },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-background border-r border-border shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground">
              ClickSprout
            </h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 bg-muted mx-4 rounded-xl border border-border my-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate text-sm">{userData.email}</p>
            <p className="text-xs text-muted-foreground truncate">@{userData.pageSlug || "yourpage"}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-background rounded-lg p-2 border border-border">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-blue-600" />
              <p className="text-sm font-bold text-foreground">{pageStats.views}</p>
            </div>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="bg-background rounded-lg p-2 border border-border">
            <div className="flex items-center justify-center gap-1">
              <MousePointerClick className="w-3 h-3 text-indigo-600" />
              <p className="text-sm font-bold text-foreground">{pageStats.clicks}</p>
            </div>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon 
                size={20} 
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                }`} 
              />
              <span className="text-sm font-medium truncate transition-colors duration-200">
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => router.push("/protected/settings")}
          className="w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings size={20} className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          <span className="text-sm font-medium truncate transition-colors duration-200">
            Settings
          </span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut size={20} className="flex-shrink-0 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
          <span className="text-sm font-medium truncate transition-colors duration-200">
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}
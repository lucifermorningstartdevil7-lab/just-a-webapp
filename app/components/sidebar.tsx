'use client'

import {
  Home,
  Link as LinkIcon,
  Palette,
  BarChart3,
  Share2,
  Settings,
  LogOut,
  Zap,
  User,
  Eye,
  MousePointerClick,
  CreditCard
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
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/protected/analytics" },
    { id: "share", label: "Share", icon: Share2, href: "/protected/share" },
    { id: "pricing", label: "Pricing", icon: CreditCard, href: "/pages/pricing" },
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              ClickSprout
            </h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 bg-gradient-to-br from-green-50 to-blue-50 mx-4 rounded-xl border border-green-100 my-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{userData.email}</p>
            <p className="text-xs text-gray-600 truncate">@{userData.pageSlug || "yourpage"}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-green-600" />
              <p className="text-sm font-bold text-gray-900">{pageStats.views}</p>
            </div>
            <p className="text-xs text-gray-600">Views</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="flex items-center justify-center gap-1">
              <MousePointerClick className="w-3 h-3 text-blue-600" />
              <p className="text-sm font-bold text-gray-900">{pageStats.clicks}</p>
            </div>
            <p className="text-xs text-gray-600">Clicks</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group border-2 relative ${
                isActive
                  ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
              }`}
            >
              <Icon 
                size={20} 
                className={`flex-shrink-0 transition-colors ${
                  isActive ? "text-green-600" : "text-gray-500 group-hover:text-gray-700"
                }`} 
              />
              <span className="text-sm font-medium truncate">
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute right-3" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => router.push("/protected/settings")}
          className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group border-2 border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <Settings size={20} className="flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
          <span className="text-sm font-medium truncate">
            Settings
          </span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group border-2 border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} className="flex-shrink-0 text-gray-500 group-hover:text-red-600" />
          <span className="text-sm font-medium truncate">
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}
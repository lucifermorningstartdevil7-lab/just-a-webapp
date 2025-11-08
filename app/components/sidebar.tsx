'use client'


import {
  Home,
  Palette,
  Share2,
  Settings,
  LogOut,
  Zap,
  CreditCard,
  Clock,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState({ email: "", pageSlug: "" })
  

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error("Error getting user:", userError)
        return
      }
      
      if (user) {
        setUserData(prev => ({ ...prev, email: user.email?.split('@')[0] || "User" }))
        
        const { data: pageData, error: pageError } = await supabase
          .from("pages")
          .select("id, slug")
          .eq("user_id", user.id)
          .single()

        if (pageError) {
          console.error("Error fetching page data:", pageError)
          return
        }

        if (pageData) {
          setUserData(prev => ({ ...prev, pageSlug: pageData.slug }))
          
          // The views and clicks data are fetched but not used, so we can remove these lines
          // const { data: viewsData } = await supabase
          //   .from("page_views")
          //   .select("id")
          //   .eq("page_id", pageData.id)

          // const { data: clicksData } = await supabase
          //   .from("link_clicks")
          //   .select("id")
          //   .eq("page_id", pageData.id)

         
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/protected/overview" },
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
          
          <Image src="/logo.png" alt="ClickSprout Logo" width={50} height={50} className="object-contain"/>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground">
              ClickSprout
            </h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
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
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
          className="w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-muted"
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
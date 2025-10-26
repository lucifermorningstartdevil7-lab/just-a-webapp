'use client'
import { motion } from "framer-motion"
import {
  LogOut,
  Settings,
  Share2,
  BarChart3,
  Palette,
  Link as LinkIcon,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DashboardSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/protected/dashboard" },
    {
      id: "builder",
      label: "Builder",
      icon: LinkIcon,
      href: "/protected/builder",
    },
    {
      id: "customize",
      label: "Customize",
      icon: Palette,
      href: "/protected/customize",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/protected/analytics",
    },
    { id: "share", label: "Share", icon: Share2, href: "/protected/share" },
  ]

  return (
    <motion.div
      initial={false}
      animate={{ width: isHovered ? 280 : 80 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation */}
      <div className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <div key={item.id} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isHovered && (
                  <span className="text-base font-medium truncate">
                    {item.label}
                  </span>
                )}
              </Link>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-neutral-800 space-y-2">
        <button
          onClick={() => router.push("/protected/settings")}
          className={cn(
            "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
            "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
          )}
        >
          <Settings size={20} className="flex-shrink-0" />
          {isHovered && (
            <span className="text-base font-medium truncate">
              Settings
            </span>
          )}
        </button>

        <button className={cn(
          "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
          "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
        )}>
          <LogOut size={20} className="flex-shrink-0" />
          {isHovered && (
            <span className="text-base font-medium truncate">
              Logout
            </span>
          )}
        </button>
      </div>
    </motion.div>
  )
}
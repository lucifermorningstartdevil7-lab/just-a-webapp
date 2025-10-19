'use client'
import { motion } from "framer-motion"
import {
  Menu,
  X,
  LogOut,
  Settings,
  Share2,
  BarChart3,
  Palette,
  Link as LinkIcon,
  User,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/protected" },
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
      animate={{ width: sidebarOpen ? 260 : 78 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-neutral-950 border-r border-neutral-800 flex flex-col h-full">
    

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-none">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="space-y-1"
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                    isActive
                      ? "bg-neutral-900 text-neutral-50 shadow-md"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-400 rounded-r"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="flex-shrink-0 ml-0.5" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-3 py-4 border-t border-neutral-800 space-y-1"
      >
        <button
          onClick={() => router.push("/protected/settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
            "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
          )}
        >
          <Settings size={18} className="flex-shrink-0" />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-sm font-medium truncate"
            >
              Settings
            </motion.span>
          )}
        </button>

        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
          "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
        )}>
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-sm font-medium truncate"
            >
              Logout
            </motion.span>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}
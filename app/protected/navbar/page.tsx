"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, Settings, ExternalLink, Zap, Users, CreditCard, LogOut } from "lucide-react";

export function DashboardNavbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section - Logo + Quick Stats */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
              LinkTrim
            </h1>
          </motion.div>

          {/* Quick Stats - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-neutral-400">Page Live</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-neutral-400">24 clicks today</span>
            </div>
          </div>
        </div>

        {/* Center - Quick Actions */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-300 hover:text-white hover:bg-neutral-800 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Page
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-300 hover:text-white hover:bg-neutral-800 gap-2"
          >
            <Zap className="h-4 w-4" />
            Upgrade
          </Button>
        </nav>

        {/* Right section - Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell with Badge */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800 relative"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-950"></div>
            </Button>
          </div>

          {/* Upgrade Button - visible on desktop */}
          <Button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2">
            <Zap className="h-4 w-4" />
            Upgrade Plan
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 ring-blue-500/50 transition-all size-9">
                <AvatarImage src="/avatars/user.png" alt="@user" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">AR</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-neutral-900 border-neutral-700 text-neutral-200"
            >
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-semibold">Alex Rivera</span>
                <span className="text-xs text-neutral-400 font-normal">alex@linktrim.com</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-neutral-800 cursor-pointer">
                <Settings className="h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-neutral-800 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Billing & Plans
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="flex items-center gap-2 text-red-400 hover:text-red-500 hover:bg-neutral-800 cursor-pointer">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
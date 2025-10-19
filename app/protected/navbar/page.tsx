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
import { Menu, Bell, Settings } from "lucide-react";

export function DashboardNavbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full bg-neutral-950/70 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left section - Logo + Name */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <motion.h1
            whileHover={{ scale: 1.03 }}
            className="text-lg font-semibold text-neutral-100 tracking-tight"
          >
            LinkTrim
          </motion.h1>
        </div>

        {/* Center - optional links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          {["Overview", "Analytics", "Projects", "Settings"].map((item) => (
            <motion.a
              key={item}
              whileHover={{ scale: 1.05, color: "#fafafa" }}
              className="text-neutral-400 hover:text-neutral-100 text-sm transition-colors transform-gpu cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Right section - Notifications + Profile */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-300 hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 ring-neutral-700 transition-all">
                <AvatarImage src="/avatars/user.png" alt="@user" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-neutral-900 border-neutral-800 text-neutral-200">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-400 hover:text-red-500">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
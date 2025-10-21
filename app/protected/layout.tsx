'use client'
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { DashboardNavbar } from "@/components/dashboard/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen] = useState(true);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Sidebar - Fixed */}
      <div className="fixed left-0 top-0 h-full z-40">
        <DashboardSidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* Navbar - Fixed */}
      <div className="fixed top-0 right-0 left-0 z-50">
        <DashboardNavbar />
      </div>

      {/* Page Content */}
      <div className="fixed top-14 left-0 right-0 bottom-0 z-10 overflow-y-auto">
        <div className="flex h-full">
          {/* Sidebar Spacing */}
          <div 
            className={`flex-shrink-0 transition-all duration-300 ${
              sidebarOpen ? 'w-60' : 'w-20'
            }`}
          />
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
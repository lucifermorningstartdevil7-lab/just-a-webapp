import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Sidebar from "../components/sidebar"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br bg-[#f8fafc]">
      {/* Smooth Sidebar */}
      <Sidebar />
      
      {/* Main Content - Adjusted for sidebar */}
      <main className="flex-1 min-w-0 ml-80 transition-all duration-300">
        <div className="p-6 w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
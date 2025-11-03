import { redirect } from "next/navigation"
import { Inter } from "next/font/google"
import { createClient } from "@/lib/supabase/server"
import Sidebar from "../components/sidebar"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'})

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className={`flex min-h-screen bg-background ${inter.className}`}>
        {/* Smooth Sidebar */}
        <Sidebar />
      
        {/* Main Content - Adjusted for sidebar */}
        <main className="flex-1 min-w-0 ml-80">
          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
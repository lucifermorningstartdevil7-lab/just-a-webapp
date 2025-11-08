import { redirect } from "next/navigation"
import { Inter } from "next/font/google"
import { createClient } from "@/lib/supabase/server"
import Sidebar from "../components/sidebar"
import { ThemeProvider } from "../components/theme-provider"
import { hasCompletedOnboarding, hasCreatedPage } from "@/utils/onboarding"

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

  // Check if user has a page first (fallback for when user_preferences table doesn't exist)
  const hasPage = await hasCreatedPage(user.id);
  
  // If the user already has a page, they've completed onboarding
  if (hasPage) {
    // No need to check onboarding status if they have a page
  } else {
    // If no page exists, check onboarding status as additional confirmation
    const onboardingCompleted = await hasCompletedOnboarding(user.id);
    
    // If user hasn't created a page yet and hasn't completed onboarding, redirect to customize for onboarding
    if (!onboardingCompleted) {
      redirect("/protected/customize");
    }
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
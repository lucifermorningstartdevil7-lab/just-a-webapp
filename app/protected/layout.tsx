// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNavbar } from "./navbar/page";
import DashboardSidebar from "./sidebar/page";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const supabase = await createClient();
  
  // ✅ Use getUser() instead of getSession()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const userData = {
    username: user.email?.split("@")[0] || "User",
    email: user.email,
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashboardSidebar userData={userData} />

      {/* Main area */}
      <div className="flex flex-col flex-1">
        <DashboardNavbar userData={userData} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
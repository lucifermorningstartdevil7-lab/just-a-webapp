// app/dashboard/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "./layout";


export default async function ProtectedDashboard() {
  const supabase = await createClient();

  


  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    redirect("/auth/login");
  }

  const userData = {
    username: session.user?.email?.split("@")[0] || "User",
    sites: [],
  };

  return <DashboardLayout userData={userData} />;
}
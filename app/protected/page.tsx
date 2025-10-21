import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Dashboard</h1>
      <p className="text-gray-400">Welcome, {userData.username}!</p>
    </div>
  );
}

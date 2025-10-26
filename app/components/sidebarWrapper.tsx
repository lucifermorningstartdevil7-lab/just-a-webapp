"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/app/components/sidebar/page"), {
  ssr: false,
});

export default function SidebarWrapper({ userData }: { userData: any }) {
  return <Sidebar userData={userData} />;
}

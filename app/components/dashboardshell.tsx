"use client";

import Sidebar from "./sidebar/page";


export default function DashboardShell({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: { username: string; email: string };
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userData={userData} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import Topbar from "./Topbar";

/**
 * Layout-only component (no API/business logic).
 * Provides a modern SaaS dashboard shell: sidebar + topbar + content.
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = useMemo(() => <SidebarNav onNavigate={() => setSidebarOpen(false)} />, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white",
          "transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebar}
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


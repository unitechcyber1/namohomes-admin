import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GpState } from "../../context/context";

export default function Topbar({ onOpenSidebar }) {
  const { logout, userInfo } = GpState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = (userInfo?.name || userInfo?.email || "Admin")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onDocKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/60 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <span className="text-lg">☰</span>
          </button>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              Namohomes Admin
            </div>
            <div className="text-xs text-slate-500">
              Manage content, cities, projects, and SEO
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm sm:flex">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-xs font-semibold text-rose-700">
              {initials}
            </span>
            <span className="max-w-[220px] truncate">
              {userInfo?.email || userInfo?.name || "Admin"}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/60"
              aria-haspopup="menu"
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <FaUserCircle className="text-lg text-slate-600" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="text-xs font-semibold text-slate-900">
                    Signed in as
                  </div>
                  <div className="mt-1 truncate text-sm text-slate-600">
                    {userInfo?.email || userInfo?.name || "Admin"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


import React from "react";
import { NavLink } from "react-router-dom";
import { IoEarthOutline, IoLocationOutline } from "react-icons/io5";
import { BiMapPin } from "react-icons/bi";
import { GiModernCity } from "react-icons/gi";
import { HiOutlineCash } from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { MdOutlinePermMedia, MdOutlineRealEstateAgent } from "react-icons/md";

const navItems = [
  { to: "/builder-projects", icon: HiOutlineBuildingOffice, label: "Builder Projects" },
  { to: "/new-launch-projects", icon: HiOutlineBuildingOffice, label: "New Launch Projects" },
  { to: "/seo", icon: MdOutlineRealEstateAgent, label: "SEO" },
  { to: "/media", icon: MdOutlinePermMedia, label: "Media" },
  { to: "/builder", icon: MdOutlineRealEstateAgent, label: "Builder" },
  { to: "/builder-plan", icon: HiOutlineBuildingOffice, label: "Project Types" },
  { to: "/country", icon: IoEarthOutline, label: "Country" },
  { to: "/state", icon: BiMapPin, label: "State" },
  { to: "/city", icon: GiModernCity, label: "City" },
  { to: "/microlocation", icon: IoLocationOutline, label: "Location" },
  { to: "/amenities", icon: HiOutlineCash, label: "Amenities" },
];

export default function SidebarNav({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white shadow-sm">
          NH
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">Admin</div>
          <div className="text-xs text-slate-500">Dashboard</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-rose-50 text-rose-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
        v0.1 • SaaS UI refresh
      </div>
    </div>
  );
}


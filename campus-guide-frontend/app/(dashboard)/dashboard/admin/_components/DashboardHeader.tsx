"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home } from "lucide-react";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

const navItems = [
  { name: "Dashboard",   href: "/dashboard/admin" },
  { name: "Events",      href: "/dashboard/admin/events" },
  { name: "Departments", href: "/dashboard/admin/departments" },
  { name: "Users",       href: "/dashboard/admin/users" },
  { name: "Resources",   href: "/dashboard/admin/resources" },
  { name: "Alerts",      href: "/dashboard/admin/alerts" },
  { name: "Campus News", href: "/dashboard/admin/campus-news" },
];

export default function DashboardHeader({ user }: { user: AdminUser | null }) {
  const pathname    = usePathname();
  const currentPage = navItems.find((n) => n.href === pathname)?.name ?? "Admin Panel";
  const initial     = user?.name?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div>
        <h1 className="text-base font-bold text-gray-900">{currentPage}</h1>
        <p className="text-[11px] text-gray-400">Welcome back to system dashboard</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Home shortcut */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-all border border-gray-200 hover:border-orange-200"
        >
          <Home size={14} />
          Home
        </Link>

        {/* Bell */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl relative transition-colors">
          <Bell size={18} />
          <span className="w-2 h-2 bg-orange-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs select-none">
            {initial}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">
              {user?.role ?? "ADMIN"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

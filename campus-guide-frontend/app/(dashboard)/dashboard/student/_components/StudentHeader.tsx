"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home } from "lucide-react";

const navItems = [
  { name: "Overview",    href: "/dashboard/student" },
  { name: "My Bookings", href: "/dashboard/student/bookings" },
  { name: "Mentors",     href: "/dashboard/student/mentors" },
  { name: "Events",      href: "/dashboard/student/events" },
  { name: "Campus News", href: "/dashboard/student/news" },
  { name: "Alerts",      href: "/dashboard/student/alerts" },
  { name: "Resources",   href: "/dashboard/student/resources" },
];

export default function StudentHeader({ user }: { user: { name: string; email: string; role: string } | null }) {
  const pathname    = usePathname();
  const currentPage = navItems.find(n => n.href === pathname)?.name ?? "Student Dashboard";
  const initial     = user?.name?.charAt(0)?.toUpperCase() ?? "S";

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div>
        <h1 className="text-base font-bold text-gray-900">{currentPage}</h1>
        <p className="text-[11px] text-gray-400">Welcome back, {user?.name ?? "Student"}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-gray-200 hover:border-blue-200">
          <Home size={14} /> Home
        </Link>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl relative transition-colors">
          <Bell size={18} />
          <span className="w-2 h-2 bg-blue-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
            {initial}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800 leading-none">{user?.name ?? "Student"}</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">STUDENT</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Building2, Users, LogOut,
  Menu, X, Bell, ShieldCheck, BookOpen, Newspaper, Home,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/(auth)/_actions/auth";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

const navItems = [
  { name: "Dashboard",   href: "/dashboard/admin",             icon: LayoutDashboard },
  { name: "Events",      href: "/dashboard/admin/events",      icon: Calendar },
  { name: "Departments", href: "/dashboard/admin/departments", icon: Building2 },
  { name: "Users",       href: "/dashboard/admin/users",       icon: Users },
  { name: "Resources",   href: "/dashboard/admin/resources",   icon: BookOpen },
  { name: "Alerts",      href: "/dashboard/admin/alerts",      icon: Bell },
  { name: "Campus News", href: "/dashboard/admin/campus-news", icon: Newspaper },
];

export default function DashboardSidebar({ user }: { user: AdminUser | null }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage =
    navItems.find((n) => n.href === pathname)?.name ?? "Admin Panel";

  const handleLogout = async () => {
    setMobileOpen(false);
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  const close = () => setMobileOpen(false);

  const NavLinks = () => (
    <>
      <nav className="p-4 space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Main Menu
        </p>
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} className={active ? "text-orange-500" : "text-gray-400"} />
              {name}
            </Link>
          );
        })}

        {/* Back to Home */}
        <div className="pt-2 mt-1 border-t border-gray-100">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <Home size={17} className="text-gray-400" />
            Back to Home
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* ────────────────────────────── MOBILE TOP BAR ─────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            CG
          </div>
          <span className="font-bold text-gray-900 text-sm">{currentPage}</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Home"
          >
            <Home size={18} />
          </Link>
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile spacer — pushes content below the fixed top bar */}
      <div className="md:hidden h-[61px]" />

      {/* ────────────────────────────── SIDEBAR ────────────────────────────── */}
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={close}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-100
          flex flex-col justify-between transition-transform duration-300
          md:sticky md:translate-x-0 md:top-0 md:z-auto md:shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-gray-50">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shadow-orange-200">
              CG
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm leading-tight">Campus Guide</h2>
              <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Admin Control
              </span>
            </div>
          </div>

          <NavLinks />
        </div>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/70 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || <ShieldCheck size={15} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email || "admin@campusguide.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

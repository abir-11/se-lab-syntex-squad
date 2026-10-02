"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  Menu,
  X,
  LogOut,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/shared/Logo/Logo";
import { logoutAction } from "@/app/(auth)/_actions/loginAction";

export default function MentorLayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/mentor" },
    { id: "services", label: "My Services", icon: Briefcase, href: "/dashboard/mentor/my-services" },
    { id: "bookings", label: "Bookings", icon: CalendarCheck, href: "/dashboard/mentor/bookings" },
  ];

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      toast.success(res.message);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 w-64 h-full bg-gray-900 border-r border-white/10 flex flex-col p-4 shrink-0 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8 px-2 mt-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} textClass="text-xl font-extrabold text-white tracking-wide" />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard/mentor"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#F68B1F] text-white shadow-lg shadow-[#F68B1F]/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-[#F68B1F]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 pt-4 pb-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#F68B1F]/20 flex items-center justify-center text-[#F68B1F] font-bold shrink-0">
              {userName?.charAt(0)?.toUpperCase() || "M"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName || "Mentor"}
              </p>
              <p className="text-[11px] text-gray-500">MENTOR</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0 relative">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="text-[#F68B1F] w-5 h-5" /> Mentor Panel
          </h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/10 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 overflow-hidden p-2 sm:p-4 lg:p-6 bg-gray-900">
          <div className="h-full w-full bg-slate-50 rounded-2xl sm:rounded-3xl shadow-xl overflow-y-auto relative border border-gray-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

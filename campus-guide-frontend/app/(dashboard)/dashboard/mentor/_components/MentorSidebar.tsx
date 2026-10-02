"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Layers, BookOpen, User,
  LogOut, Menu, X, Home, Briefcase,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/(auth)/_actions/auth";

interface MentorUser { name: string; email: string; role: string }

const navItems = [
  { name: "Overview",    href: "/dashboard/mentor",           icon: LayoutDashboard },
  { name: "My Services", href: "/dashboard/mentor/services",  icon: Layers },
  { name: "Bookings",    href: "/dashboard/mentor/bookings",  icon: BookOpen },
  { name: "Profile",     href: "/dashboard/mentor/profile",   icon: User },
];

export default function MentorSidebar({ user }: { user: MentorUser | null }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const currentPage = navItems.find(n => n.href === pathname)?.name ?? "Mentor Dashboard";

  const handleLogout = async () => {
    setOpen(false);
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  const NavLinks = () => (
    <nav className="p-4 space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
        Mentor Menu
      </p>
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              active ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}>
            <Icon size={17} className={active ? "text-emerald-500" : "text-gray-400"} />
            {name}
          </Link>
        );
      })}
      <div className="pt-2 mt-1 border-t border-gray-100">
        <Link href="/" onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
          <Home size={17} className="text-gray-400" /> Back to Home
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
            <Briefcase size={15} />
          </div>
          <span className="font-bold text-gray-900 text-sm">{currentPage}</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Home size={18} /></Link>
          <button onClick={() => setOpen(p => !p)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div className="md:hidden h-[61px]" />

      {open && <div className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />}

      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-100
        flex flex-col justify-between transition-transform duration-300
        md:sticky md:translate-x-0 md:top-0 md:z-auto md:shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-gray-50">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm leading-tight">Campus Guide</h2>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                Mentor Portal
              </span>
            </div>
          </div>
          <NavLinks />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/70 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? "M"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">{user?.name ?? "Mentor"}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors w-full">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

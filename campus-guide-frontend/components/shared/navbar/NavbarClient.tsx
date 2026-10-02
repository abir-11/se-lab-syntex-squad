"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, Bell, ChevronDown, LogOut, Settings,
  User, LayoutDashboard,
} from "lucide-react";
import { Avatar } from "@/components/ui/ui";
import { logoutAction } from "@/app/(auth)/_actions/auth";

// ── Nav link sets ─────────────────────────────────────────────────────────────
const publicLinks = [
  { href: "/",          label: "Home" },
  { href: "/services",  label: "Services" },
  { href: "/mentors",   label: "Mentors" },
  { href: "/stories",   label: "Stories" },
  { href: "/events",    label: "Events" },
  { href: "/news",      label: "Campus News" },
  { href: "/alerts",    label: "Alerts" },
  { href: "/resources", label: "Resources" },
];

const loggedInLinks = [
  { href: "/mentors",   label: "Mentors" },
  { href: "/services",  label: "Services" },
  { href: "/events",    label: "Events" },
  { href: "/news",      label: "Campus News" },
];

const roleBadgeLabel: Record<string, string> = {
  STUDENT: "Student", MENTOR: "Mentor",
  FACULTY: "Faculty", ADMIN:   "Admin",
};

interface NavbarClientProps {
  user: { name: string; email: string; role: string } | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const isLoggedIn = !!user;
  const role       = user?.role?.toUpperCase() ?? "GUEST";
  const userName   = user?.name ?? "";

  const dashboardPath =
    role === "ADMIN"   ? "/dashboard/admin"
    : role === "MENTOR"  ? "/dashboard/mentor"
    : role === "STUDENT" ? "/dashboard/student"
    : "/dashboard";

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await logoutAction();
    // Full page reload করে লগআউট নিশ্চিত করা
    window.location.href = "/login";
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-orange-200">
              U
            </div>
            <div>
              <span className="font-bold text-[#1F2937] text-sm leading-none block">UIU Campus</span>
              <span className="text-[10px] text-[#F97316] font-semibold leading-none block uppercase tracking-wide">Guide</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {!isLoggedIn ? (
              publicLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.href) ? "bg-orange-50 text-[#F97316]" : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"}`}>
                  {l.label}
                </Link>
              ))
            ) : (
              <>
                <Link href={dashboardPath}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/dashboard") ? "bg-orange-50 text-[#F97316]" : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"}`}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                {loggedInLinks.map((l) => (
                  <Link key={l.href} href={l.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.href) ? "bg-orange-50 text-[#F97316]" : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"}`}>
                    {l.label}
                  </Link>
                ))}
                {role === "STUDENT" && (
                  <Link href="/bookings"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/bookings") ? "bg-orange-50 text-[#F97316]" : "text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50"}`}>
                    Bookings
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-semibold text-[#6B7280] hover:text-[#1F2937] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                  Login
                </Link>
                <Link href="/register" className="bg-[#F97316] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#EA580C] transition-colors shadow-sm shadow-orange-200">
                  Register
                </Link>
              </>
            ) : (
              <>
                <button className="relative p-2 rounded-xl hover:bg-gray-100 text-[#6B7280] transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full ring-2 ring-white" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors">
                    <Avatar name={userName} size="sm" />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-[#1F2937] leading-none">{userName}</p>
                      <p className="text-xs text-[#6B7280] leading-none mt-0.5">{roleBadgeLabel[role] ?? role}</p>
                    </div>
                    <ChevronDown size={14} className={`text-[#9CA3AF] transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl py-2 z-50">
                        <div className="px-4 py-2.5 border-b border-[#F3F4F6] mb-1">
                          <p className="text-xs font-bold text-[#1F2937]">{userName}</p>
                          <p className="text-[10px] text-[#6B7280]">{user?.email}</p>
                          <span className="text-xs text-[#F97316] font-semibold">{roleBadgeLabel[role] ?? role}</span>
                        </div>
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 transition-colors">
                          <User size={14} className="text-gray-400" /> My Profile
                        </Link>
                        <Link href="/settings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 transition-colors">
                          <Settings size={14} className="text-gray-400" /> Settings
                        </Link>
                        <hr className="my-1 border-[#F3F4F6]" />
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <button onClick={() => setMenuOpen((m) => !m)} aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-[#6B7280] transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {!isLoggedIn ? (
              <>
                {publicLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMenu}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(l.href) ? "bg-orange-50 text-[#F97316]" : "text-[#374151] hover:bg-gray-50"}`}>
                    {l.label}
                  </Link>
                ))}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link href="/login" onClick={closeMenu}
                    className="flex-1 text-center border border-[#E5E7EB] rounded-xl py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" onClick={closeMenu}
                    className="flex-1 text-center bg-[#F97316] rounded-xl py-2.5 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors">
                    Register
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href={dashboardPath} onClick={closeMenu}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname.startsWith("/dashboard") ? "bg-orange-50 text-[#F97316]" : "text-[#374151] hover:bg-gray-50"}`}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                {loggedInLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMenu}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(l.href) ? "bg-orange-50 text-[#F97316]" : "text-[#374151] hover:bg-gray-50"}`}>
                    {l.label}
                  </Link>
                ))}
                {role === "STUDENT" && (
                  <Link href="/bookings" onClick={closeMenu}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/bookings") ? "bg-orange-50 text-[#F97316]" : "text-[#374151] hover:bg-gray-50"}`}>
                    Bookings
                  </Link>
                )}
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={userName} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{userName}</p>
                      <p className="text-xs text-[#F97316] font-semibold">{roleBadgeLabel[role] ?? role}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={closeMenu}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#374151] hover:bg-gray-50 transition-colors">
                    <User size={14} className="text-gray-400" /> My Profile
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
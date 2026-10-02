"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Newspaper,
  CalendarDays,
  Building2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/shared/Logo/Logo";
import { logoutAction } from "@/app/(auth)/_actions/loginAction";

const navItems = [
  { label: "Mentors", href: "/mentors", icon: GraduationCap },
  { label: "Services", href: "/services", icon: BookOpen },
  { label: "Stories", href: "/stories", icon: Sparkles },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Departments", href: "/departments", icon: Building2 },
];

const getDashboardPath = (role?: string) => {
  switch (role?.toUpperCase()) {
    case "ADMIN":
    case "FACULTY":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    case "STUDENT":
      return "/dashboard/student";
    default:
      return "/dashboard";
  }
};

export function Navbar({ user }: { user: any }) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = user?.success && !!user?.data?.result;
  const currentUser = user?.data?.result;

  const userName = currentUser?.name || "User";
  const userEmail = currentUser?.email || "user@email.com";
  const userRole = currentUser?.role;
  const userPhoto =
    currentUser?.profiles?.[0]?.profilePhoto || currentUser?.image;

  const dashboardBasePath = getDashboardPath(userRole);

  const handleLogout = async () => {
    const res = await logoutAction();

    if (res.success) {
      toast.success(res.message);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Logo
                size={28}
                textClass="text-2xl font-extrabold text-white tracking-wide"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-[#F68B1F] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href={dashboardBasePath}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#F68B1F] hover:bg-[#d97414] px-4 py-2 rounded-xl transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-400/40 px-4 py-2 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <div
                  title={`${userName} (${userRole})`}
                  className="w-10 h-10 rounded-full bg-[#F68B1F]/20 border border-[#F68B1F]/40 flex items-center justify-center text-[#F68B1F] font-bold overflow-hidden"
                >
                  {userPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userName?.charAt(0)?.toUpperCase()
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-200 hover:text-[#F68B1F] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold text-white bg-[#F68B1F] hover:bg-[#d97414] px-5 py-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(246,139,31,0.25)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-300 hover:text-[#F68B1F] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-white/10" />
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardBasePath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#F68B1F] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#F68B1F] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-white bg-[#F68B1F] hover:bg-[#d97414] px-5 py-3 rounded-xl transition-colors font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size={30} textClass="text-2xl font-extrabold text-white" />
            <p className="mt-4 text-gray-400 text-sm max-w-sm">
              Your campus companion. Find approved mentors, book one-on-one
              sessions, follow campus events, and explore departments and
              stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Mentors", href: "/mentors" },
                { label: "Services", href: "/services" },
                { label: "Stories", href: "/stories" },
                { label: "Events", href: "/events" },
                { label: "Departments", href: "/departments" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#F68B1F] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-[#F68B1F] transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-[#F68B1F] transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-[#F68B1F] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Campus Guide. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            United International University
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

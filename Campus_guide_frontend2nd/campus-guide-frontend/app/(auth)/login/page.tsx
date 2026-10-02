"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Users, CalendarCheck } from "lucide-react";
import Logo from "@/components/shared/Logo/Logo";
import LoginForm from "../_components/loginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#F68B1F]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#d97414]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10"
      >
        {/* Left Side: Illustration & Welcome Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex flex-col items-center justify-center order-1 text-center"
        >
          <div className="w-full max-w-md drop-shadow-2xl rounded-2xl bg-gradient-to-br from-[#F68B1F]/20 via-[#d97414]/10 to-transparent border border-[#F68B1F]/20 p-10">
            <GraduationCap className="w-24 h-24 mx-auto text-[#F68B1F]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8">
            Welcome back to <span className="text-brand">Campus Guide</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm">
            Book mentor sessions, follow campus events, and explore
            departments, all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { icon: Users, label: "Find Mentors" },
              { icon: CalendarCheck, label: "Book Sessions" },
              { icon: Sparkles, label: "Campus Stories" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-gray-400 text-sm"
              >
                <Icon className="w-4 h-4 text-[#F68B1F]" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Login Form with Logo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col items-center justify-center order-2 bg-black/40 p-8 md:p-10 rounded-2xl border border-white/5 shadow-inner"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 group">
            <Logo size={36} textClass="text-3xl font-extrabold text-white tracking-wide" />
          </Link>

          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Logo from "@/components/shared/Logo/Logo";
import RegisterForm from "../../_components/RegisterForm";

const RegisterClient = ({ departments }: { departments: any[] }) => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#F68B1F]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#d97414]/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10"
      >
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex w-full flex-col items-center justify-center order-1 text-center"
        >
          <div className="w-full max-w-md drop-shadow-2xl rounded-2xl bg-gradient-to-br from-[#F68B1F]/20 via-[#d97414]/10 to-transparent border border-[#F68B1F]/20 p-12">
            <GraduationCap className="w-28 h-28 mx-auto text-[#F68B1F]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8">
            Join <span className="text-brand">Campus Guide</span>
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-sm">
            Students book real sessions with approved mentors. Mentors publish
            services and manage bookings.
          </p>
        </motion.div>

        {/* Right Side: Register Form with Logo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col items-center justify-center order-2 bg-black/40 p-6 md:p-10 rounded-2xl border border-white/5 shadow-inner"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 group">
            <Logo size={36} textClass="text-3xl font-extrabold text-white tracking-wide" />
          </Link>

          <div className="w-full max-w-md">
            <RegisterForm departments={departments || []} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterClient;

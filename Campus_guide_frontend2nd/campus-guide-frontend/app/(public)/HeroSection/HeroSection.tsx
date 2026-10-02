"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, GraduationCap } from "lucide-react";

type HeroContent = {
  heroImage: string | null;
  heroEyebrow: string | null;
  heroTitle: string;
  heroSub: string | null;
  stats: any[] | null;
};

const defaultStats = [
  { label: "Departments", value: "12+" },
  { label: "Approved Mentors", value: "50+" },
  { label: "Sessions Booked", value: "500+" },
];

const HeroSection = ({ content }: { content: HeroContent | null }) => {
  const stats =
    content?.stats && Array.isArray(content.stats) && content.stats.length > 0
      ? content.stats
      : defaultStats;

  return (
    <section className="relative overflow-hidden bg-gray-950">
      {/* Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#F68B1F]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-[#d97414]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {content?.heroEyebrow && (
            <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-[#F68B1F] bg-[#F68B1F]/10 border border-[#F68B1F]/30 rounded-full px-4 py-1.5">
              {content.heroEyebrow}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            {content?.heroTitle || (
              <>
                Your Campus, <span className="text-brand">Guided.</span>
              </>
            )}
          </h1>
          <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-xl">
            {content?.heroSub ||
              "Find approved mentors, book one-on-one sessions, follow campus events and explore departments, all in one place."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm shadow-[0_0_20px_rgba(246,139,31,0.3)] transition-all"
            >
              Book a Session
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-gray-200 hover:border-[#F68B1F]/60 hover:text-[#F68B1F] font-semibold text-sm transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              Meet Mentors
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {stats.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              >
                <p className="text-3xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {content?.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.heroImage}
                alt="Campus"
                className="w-full h-[480px] object-cover"
              />
            ) : (
              <div className="w-full h-[480px] bg-gradient-to-br from-[#F68B1F]/30 via-[#d97414]/20 to-gray-900 flex items-center justify-center">
                <GraduationCap className="w-40 h-40 text-[#F68B1F]/70" />
              </div>
            )}
          </div>

          {/* Floating card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-gray-900/90 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-xl"
          >
            <div className="w-10 h-10 rounded-full bg-[#F68B1F]/20 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-[#F68B1F]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Mentor Sessions</p>
              <p className="text-gray-400 text-xs">Book in seconds</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

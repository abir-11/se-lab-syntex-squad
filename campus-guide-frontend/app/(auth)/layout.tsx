import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1F2937] flex-col justify-between p-12 relative overflow-hidden">
        <img
          src="https://admission.uiu.ac.bd/Images/Img/carosol_img/Carosol_1.jpg"
          alt="UIU Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center text-white font-bold">U</div>
            <div>
              <span className="font-bold text-white font-display block leading-none">UIU Campus</span>
              <span className="text-[10px] text-[#F97316] font-bold tracking-widest uppercase">Guide</span>
            </div>
          </Link>
        </div>
        <div className="relative">
          <blockquote className="text-white">
            <p className="text-2xl font-bold font-display leading-relaxed mb-4">
              "The right mentor can change your entire trajectory."
            </p>
            <footer className="text-gray-400 text-sm">— UIU Career Development Center</footer>
          </blockquote>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[["4,200+", "Students"], ["48", "Expert Mentors"], ["134", "Services"], ["892", "Bookings"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-display">{v}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center text-white font-bold text-sm">U</div>
            <span className="font-bold text-[#1F2937] font-display">UIU Campus Guide</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
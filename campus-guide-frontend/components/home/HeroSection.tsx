import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { label: "Active Students", value: "4,200+", icon: "🎓" },
  { label: "Expert Mentors", value: "48", icon: "👨‍🏫" },
  { label: "Campus Services", value: "134", icon: "🏛️" },
  { label: "Events This Month", value: "12", icon: "📅" },
];

export default function HeroSection() {
  return (
    <section className="relative bg-[#1F2937] overflow-hidden">
      <img
        src="https://admission.uiu.ac.bd/Images/Img/carosol_img/Carosol_1.jpg"
        alt="UIU Campus"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-[#F97316]" />
            <span className="text-[#F97316] text-xs font-bold tracking-[0.2em] uppercase">
              United International University
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-display leading-tight mb-6">
            Your Complete Guide<br />to{" "}
            <span className="text-[#F97316]">Campus Life</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10">
            UIU Campus Guide connects students with experienced mentors, academic resources, campus services, events, and opportunities — all in one trusted platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-[#F97316] text-white font-bold px-7 py-4 rounded-2xl hover:bg-[#EA580C] transition-colors text-sm"
            >
              Explore Services <ArrowRight size={16} />
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 font-semibold px-7 py-4 rounded-2xl hover:bg-white/20 transition-colors text-sm backdrop-blur-sm"
            >
              Find a Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Stats floating bar */}
      <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-white font-display">{s.value}</div>
                <div className="text-xs text-gray-300 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
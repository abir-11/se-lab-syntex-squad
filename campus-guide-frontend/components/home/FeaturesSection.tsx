import Link from "next/link";
import { ArrowRight, BookOpen, Users, Calendar, Briefcase, Star, Shield } from "lucide-react";
import { Card } from "../ui/ui";

const features = [
  {
    icon: <Users size={22} className="text-[#F97316]" />,
    title: "Find a Mentor",
    description: "Connect with experienced mentors from your department for career, academic, and personal guidance.",
    to: "/mentors",
  },
  {
    icon: <BookOpen size={22} className="text-[#F97316]" />,
    title: "Browse Services",
    description: "Explore professional services — from interview prep to research guidance — offered by UIU mentors.",
    to: "/services",
  },
  {
    icon: <Briefcase size={22} className="text-[#F97316]" />,
    title: "Career Pathways",
    description: "Discover your personalized career roadmap based on your skills, department, and career goals.",
    to: "/dashboard/career",
  },
  {
    icon: <Calendar size={22} className="text-[#F97316]" />,
    title: "Campus Events",
    description: "Stay updated on tech fests, career fairs, workshops, and academic events happening on campus.",
    to: "/events",
  },
  {
    icon: <Star size={22} className="text-[#F97316]" />,
    title: "Student Stories",
    description: "Get inspired by success stories from UIU alumni who achieved their dreams through mentorship.",
    to: "/stories",
  },
  {
    icon: <Shield size={22} className="text-[#F97316]" />,
    title: "Campus Alerts",
    description: "Real-time notifications for exam schedules, campus news, and important university announcements.",
    to: "/alerts",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-14">
        <span className="text-[#F97316] text-xs font-bold tracking-widest uppercase">Everything you need</span>
        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] font-display mt-3">Platform Features</h2>
        <p className="text-[#6B7280] mt-3 max-w-lg mx-auto">From academic guidance to career planning — UIU Campus Guide is your all-in-one campus companion.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link key={f.to} href={f.to}>
            <Card className="p-6 hover:shadow-md transition-shadow h-full">
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-[#1F2937] font-display mb-2">{f.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
              <div className="flex items-center gap-1 text-[#F97316] text-sm font-semibold mt-4">
                Learn more <ArrowRight size={14} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
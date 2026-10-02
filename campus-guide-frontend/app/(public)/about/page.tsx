import { Users, Star, BookOpen, Target, Heart, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Users,    title: "Expert Mentors",         desc: "Connect with verified UIU faculty and senior students who are passionate about helping others succeed." },
  { icon: Star,     title: "Quality Sessions",        desc: "Every mentor is reviewed and approved to ensure you get the best mentoring experience possible." },
  { icon: BookOpen, title: "Learning Resources",      desc: "Access a curated library of academic and career resources contributed by our mentor community." },
  { icon: Target,   title: "Career Guidance",         desc: "Get personalized career advice tailored to your goals, department, and industry interest." },
  { icon: Heart,    title: "Community Driven",        desc: "Built by UIU students for UIU students — a platform that truly understands your challenges." },
  { icon: Zap,      title: "Instant Booking",         desc: "Book sessions in minutes. No back-and-forth — choose a mentor, pick a service, and you're set." },
];

const stats = [
  { label: "Students",       value: "4,200+" },
  { label: "Expert Mentors", value: "48"     },
  { label: "Services",       value: "134"    },
  { label: "Sessions Done",  value: "892"    },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-5 mb-4">UIU Campus Guide</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
            UIU Campus Guide is a mentoring and career development platform built for students of
            United International University. We connect students with experienced mentors, provide
            access to curated resources, and keep the campus community informed.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/register" className="bg-orange-500 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all active:scale-[0.98] shadow-sm shadow-orange-200">
              Join Now — It&apos;s Free
            </Link>
            <Link href="/mentors" className="border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl hover:border-orange-300 hover:text-orange-500 transition-all">
              Browse Mentors
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-orange-500">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Campus Guide?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

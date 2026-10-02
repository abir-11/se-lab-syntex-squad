import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#F97316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white font-display mb-4">
          Ready to get started?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
          Join thousands of UIU students who use Campus Guide every day to connect, learn, and grow.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="bg-white text-[#F97316] font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors text-sm">
            Create Free Account
          </Link>
          <Link href="/mentors" className="bg-white/20 text-white border border-white/30 font-semibold px-8 py-4 rounded-2xl hover:bg-white/30 transition-colors text-sm">
            Browse Mentors
          </Link>
        </div>
      </div>
    </section>
  );
}
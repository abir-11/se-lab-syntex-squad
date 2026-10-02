import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-[#111827] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center text-white font-bold text-sm">U</div>
          <span className="font-bold text-white text-sm font-display">UIU Campus Guide</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-[#F97316] transition-colors">Services</Link></li>
              <li><Link href="/mentors" className="hover:text-[#F97316] transition-colors">Mentors</Link></li>
              <li><Link href="/events" className="hover:text-[#F97316] transition-colors">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Campus</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="hover:text-[#F97316] transition-colors">Campus News</Link></li>
              <li><Link href="/alerts" className="hover:text-[#F97316] transition-colors">Alerts</Link></li>
              <li><Link href="/resources" className="hover:text-[#F97316] transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Students</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-[#F97316] transition-colors">Register</Link></li>
              <li><Link href="/stories" className="hover:text-[#F97316] transition-colors">Success Stories</Link></li>
              <li><Link href="/dashboard/career" className="hover:text-[#F97316] transition-colors">Career Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">UIU</h4>
            <p className="text-sm leading-relaxed">United International University<br />Madani Avenue, Vatara<br />Dhaka 1212, Bangladesh</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-center">
          © {new Date().getFullYear()} UIU Campus Guide. United International University. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
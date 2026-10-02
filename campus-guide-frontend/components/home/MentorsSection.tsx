import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "../ui/ui";
import { mentors } from "@/app/data/mockData";

export default function MentorsSection() {
  return (
    <section className="bg-white border-y border-[#E5E7EB] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#F97316] text-xs font-bold tracking-widest uppercase">Verified Professionals</span>
            <h2 className="text-3xl font-bold text-[#1F2937] font-display mt-2">Featured Mentors</h2>
          </div>
          <Link href="/mentors" className="text-sm font-semibold text-[#F97316] flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.filter(m => m.status === "approved").slice(0, 3).map((mentor) => (
            <Card key={mentor.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src={mentor.image} alt={mentor.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-bold text-[#1F2937] font-display">{mentor.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{mentor.department}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-semibold text-[#1F2937]">{mentor.rating}</span>
                    <span className="text-xs text-[#9CA3AF]">· {mentor.sessions} sessions</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {mentor.expertise.slice(0, 3).map((e) => (
                  <span key={e} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">{e}</span>
                ))}
              </div>
              <Link href={`/mentors/${mentor.id}`} className="block w-full text-center border border-[#E5E7EB] rounded-xl py-2 text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors">
                View Profile
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
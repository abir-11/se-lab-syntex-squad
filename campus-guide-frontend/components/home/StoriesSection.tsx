import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { stories } from "@/app/data/mockData";

export default function StoriesSection() {
  return (
    <section className="bg-[#1F2937] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#F97316] text-xs font-bold tracking-widest uppercase">Inspiration</span>
            <h2 className="text-3xl font-bold text-white font-display mt-2">Student Success Stories</h2>
          </div>
          <Link href="/stories" className="text-sm font-semibold text-[#F97316] flex items-center gap-1">
            All stories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="rounded-2xl overflow-hidden group cursor-pointer">
              <div className="relative h-44 overflow-hidden">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-semibold">{story.author}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/10 rounded-b-2xl">
                <h3 className="font-bold text-white font-display text-sm leading-snug mb-2 line-clamp-2">{story.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{story.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
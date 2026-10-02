import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { events } from "@/app/data/mockData";
import { Card } from "../ui/ui";


export default function EventsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-[#F97316] text-xs font-bold tracking-widest uppercase">What's happening</span>
          <h2 className="text-3xl font-bold text-[#1F2937] font-display mt-2">Upcoming Events</h2>
        </div>
        <Link href="/events" className="text-sm font-semibold text-[#F97316] flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-full">Upcoming</span>
                <span className="text-xs text-[#9CA3AF]">{event.date}</span>
              </div>
              <h3 className="font-bold text-[#1F2937] font-display mb-1">{event.title}</h3>
              <p className="text-xs text-[#6B7280] mb-3">📍 {event.location}</p>
              <Link href="/events" className="text-sm font-semibold text-[#F97316] flex items-center gap-1">
                View Details <ArrowRight size={13} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
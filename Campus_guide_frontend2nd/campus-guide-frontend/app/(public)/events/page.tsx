import React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, LogIn } from "lucide-react";
import { getAllEvents } from "@/service/getPublishedStories";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-[#F68B1F]/10 text-[#F68B1F] border-[#F68B1F]/40",
  ONGOING: "bg-emerald-400/10 text-emerald-400 border-emerald-400/40",
  COMPLETED: "bg-gray-500/10 text-gray-400 border-gray-500/40",
  CANCELLED: "bg-red-400/10 text-red-400 border-red-400/40",
  PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/40",
};

const EventsPage = async () => {
  const eventsRes = await getAllEvents({ limit: 50 });
  const events = eventsRes?.data || [];
  const needsLogin = !eventsRes?.success;

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
          Campus Life
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Campus Events
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Stay up to date with what&apos;s happening on campus.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {needsLogin ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40 max-w-xl mx-auto">
            <LogIn className="w-12 h-12 text-[#F68B1F]/60 mx-auto" />
            <p className="text-gray-400 mt-4">
              Campus events are visible to logged-in users.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm transition-colors"
            >
              Log In
            </Link>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 hover:border-[#F68B1F]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white line-clamp-2">
                      {event.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#F68B1F]" />
                        {new Date(event.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F68B1F]" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-bold uppercase tracking-wider border rounded-full px-3 py-1 ${
                      statusStyles[event.status] || statusStyles.PENDING
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                    {event.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-4">
                  Posted by {event.user?.name}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40">
            <CalendarDays className="w-12 h-12 text-[#F68B1F]/50 mx-auto" />
            <p className="text-gray-400 mt-4">No events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

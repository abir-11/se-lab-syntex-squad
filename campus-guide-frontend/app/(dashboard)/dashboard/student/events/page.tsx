"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Loader2, MapPin, Calendar, Tag, X } from "lucide-react";
import { fetchPublicEvents } from "../_actions/studentActions";

interface EventItem {
  id?: string; _id?: string;
  title: string; description?: string; date?: string;
  location?: string; category?: string; image?: string; status?: string;
}

const statusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-50 text-blue-600",
  ONGOING:   "bg-emerald-50 text-emerald-600",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-50 text-red-500",
  PENDING:   "bg-amber-50 text-amber-600",
};

export default function StudentEventsPage() {
  const [events, setEvents]   = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchPublicEvents();
    if (res.success) setEvents(res.data as EventItem[]);
    else setError("Unable to load events.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const statuses = ["ALL", "UPCOMING", "ONGOING", "COMPLETED"];
  const counts: Record<string, number> = { ALL: events.length };
  statuses.slice(1).forEach(s => { counts[s] = events.filter(e => String(e.status ?? "").toUpperCase() === s).length; });

  const filtered = filter === "ALL" ? events : events.filter(e => String(e.status ?? "").toUpperCase() === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
        <p className="text-xs text-gray-500 mt-1">Stay up-to-date with campus activities</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === s ? "bg-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-[10px] font-bold ${filter === s ? "text-blue-100" : "text-gray-400"}`}>{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(evt => {
            const id  = evt.id ?? evt._id ?? "";
            const raw = String(evt.status ?? "PENDING").toUpperCase();
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {evt.image ? (
                  <img src={evt.image} alt={evt.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <CalendarDays size={36} className="text-blue-300" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag size={10} />{evt.category ?? "Event"}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                      {raw.charAt(0) + raw.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug">{evt.title}</h3>
                  {evt.description && <p className="text-xs text-gray-500 line-clamp-2">{evt.description}</p>}
                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 space-y-0.5">
                    {evt.date && <p className="flex items-center gap-1"><Calendar size={12} />
                      {new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>}
                    {evt.location && <p className="flex items-center gap-1"><MapPin size={12} />{evt.location}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <CalendarDays size={32} className="text-blue-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No events found</p>
          <p className="text-xs text-gray-400">Check back later for upcoming events.</p>
        </div>
      )}
    </div>
  );
}

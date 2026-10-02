import { CalendarDays, MapPin, Calendar, Tag } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getEvents() {
  try {
    const res = await fetch(`${BACKEND}/api/events?limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d?.data) ? d.data : [];
  } catch { return []; }
}

const statusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-50 text-blue-600",
  ONGOING:   "bg-emerald-50 text-emerald-600",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-50 text-red-500",
  PENDING:   "bg-amber-50 text-amber-600",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Events</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Campus Events</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Stay updated with the latest events happening on campus.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt: any) => {
              const id  = evt.id ?? evt._id ?? "";
              const raw = String(evt.status ?? "PENDING").toUpperCase();
              return (
                <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {evt.image ? (
                    <img src={evt.image} alt={evt.title} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                      <CalendarDays size={36} className="text-orange-300" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Tag size={10} />{evt.category ?? "Event"}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                        {raw.charAt(0) + raw.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">{evt.title}</h3>
                    {evt.description && <p className="text-xs text-gray-500 line-clamp-2">{evt.description}</p>}
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 space-y-0.5">
                      {evt.date && <p className="flex items-center gap-1"><Calendar size={11} />{new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
                      {evt.location && <p className="flex items-center gap-1"><MapPin size={11} />{evt.location}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
              <CalendarDays size={36} className="text-orange-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No events scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}

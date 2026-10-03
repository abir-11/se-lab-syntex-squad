import { CalendarDays, MapPin, Calendar, Tag } from "lucide-react";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ??
  "https://campus-guide-backend.vercel.app";

function extractDataArray(d: any): any[] {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data?.data)) return d.data.data;
  if (Array.isArray(d?.data?.result)) return d.data.result;
  if (Array.isArray(d?.data?.events)) return d.data.events;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.result)) return d.result;
  if (Array.isArray(d?.events)) return d.events;
  return [];
}

async function getEvents() {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const endpoints = [
    `${BACKEND}/api/events?limit=500`,
    `${BACKEND}/api/events/public?limit=500`,
    `${BACKEND}/api/events/published?limit=500`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (res.ok) {
        const rawJson = await res.json();
        const list = extractDataArray(rawJson);
        if (list.length > 0) return list;
      }
    } catch (e) {
      console.error(`Fetch error for ${url}:`, e);
    }
  }

  return [];
}

const statusStyle: Record<string, string> = {
  UPCOMING: "bg-blue-50 text-blue-600",
  ONGOING: "bg-emerald-50 text-emerald-600",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-50 text-red-500",
  PENDING: "bg-amber-50 text-amber-600",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
            Campus Events
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Stay updated with the latest events happening on campus.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt: any, index: number) => {
              const id = evt.id ?? evt._id ?? `evt-${index}`;
              const raw = String(evt.status ?? "PENDING").toUpperCase();

              // Safe Date Parsing
              let formattedDate = "";
              if (evt.date) {
                try {
                  formattedDate = new Date(evt.date).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  );
                } catch {
                  formattedDate = String(evt.date);
                }
              }

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {evt.image ? (
                      <img
                        src={evt.image}
                        alt={evt.title ?? "Event"}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                        <CalendarDays size={40} className="text-orange-300" />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Tag size={10} />
                          {evt.category ?? "Event"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            statusStyle[raw] ?? "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {raw.charAt(0) + raw.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-base leading-snug">
                        {evt.title ?? "Untitled Event"}
                      </h3>
                      {evt.description && (
                        <p className="text-xs text-gray-500 line-clamp-3">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                    {formattedDate && (
                      <p className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {formattedDate}
                      </p>
                    )}
                    {evt.location && (
                      <p className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {evt.location}
                      </p>
                    )}
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
            <p className="text-lg font-semibold text-gray-700">
              No events scheduled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
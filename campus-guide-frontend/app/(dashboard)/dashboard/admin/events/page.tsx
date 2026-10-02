"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, MapPin, Loader2, Trash2, CalendarDays, Tag, X } from "lucide-react";
import CreateEventForm from "../_components/CreateEventForm";
import { fetchEvents, deleteEvent } from "../_actions/adminActions";
import { swConfirmDelete, swErrorToast, swToast } from "@/lib/swal";

interface EventItem {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  image?: string;
  status?: string;
}

const statusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-50 text-blue-600",
  ONGOING:   "bg-emerald-50 text-emerald-600",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-50 text-red-500",
  PENDING:   "bg-amber-50 text-amber-600",
};

export default function AdminEventsPage() {
  const [events, setEvents]       = useState<EventItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchEvents();
    if (res.success && Array.isArray(res.data)) {
      setEvents(res.data as EventItem[]);
    } else {
      setError("Unable to load events. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this event?",
      `"${title}" will be permanently removed.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    const res = await deleteEvent(id);
    if (res.success) {
      setEvents((prev) => prev.filter((e) => (e.id || e._id) !== id));
      swToast("Event deleted successfully");
    } else {
      swErrorToast(res.message || "Failed to delete event");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all university events and workshops</p>
        </div>
        <CreateEventForm onEventCreated={loadEvents} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} /><span>{error}</span>
          <button onClick={() => { setError(null); loadEvents(); }} className="ml-auto underline font-semibold">Retry</button>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">{events.length} event{events.length !== 1 ? "s" : ""} total</span>
          {["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map((s) => {
            const count = events.filter((e) => String(e.status || "").toUpperCase() === s).length;
            if (!count) return null;
            return (
              <span key={s} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[s]}`}>
                {count} {s.charAt(0) + s.slice(1).toLowerCase()}
              </span>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt) => {
            const id = evt.id || evt._id || "";
            const rawStatus = String(evt.status || "PENDING").toUpperCase();
            const statusClass = statusStyle[rawStatus] || "bg-gray-100 text-gray-500";
            const isDeleting = deletingId === id;
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                      <Tag size={10} />{evt.category || "Event"}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusClass}`}>
                      {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug">{evt.title}</h3>
                  {evt.description && <p className="text-xs text-gray-500 line-clamp-2">{evt.description}</p>}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400 space-y-0.5">
                      {evt.date && (
                        <p className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(evt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                      {evt.location && <p className="flex items-center gap-1"><MapPin size={12} />{evt.location}</p>}
                    </div>
                    <button onClick={() => handleDelete(id, evt.title)} disabled={isDeleting}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
            <CalendarDays size={32} className="text-orange-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">No events yet</p>
            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add New Event&rdquo; to create the first campus event.</p>
          </div>
        </div>
      )}
    </div>
  );
}

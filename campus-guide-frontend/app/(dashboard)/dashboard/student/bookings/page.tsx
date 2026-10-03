"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Loader2, Trash2, Calendar, Clock, X, User } from "lucide-react";
import { fetchMyBookings, cancelBooking } from "../_actions/studentActions";
import { swConfirmDelete, swToast, swErrorToast } from "@/lib/swal";

interface Booking {
  id?: string; _id?: string;
  status?: string; date?: string; time?: string; notes?: string;
  service?: { name?: string; category?: string; fee?: number };
  mentor?: { name?: string };
}

const statusStyle: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-600",
  ACCEPTED:  "bg-blue-50 text-blue-600",
  CONFIRMED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-gray-100 text-gray-500",
  REJECTED:  "bg-red-50 text-red-500",
};

type Filter = "ALL" | "PENDING" | "ACCEPTED" | "CONFIRMED" | "CANCELLED" | "REJECTED";

export default function StudentBookingsPage() {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<Filter>("ALL");
  const [deletingId, setDeleting] = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchMyBookings();
    if (res.success) setBookings(res.data as Booking[]);
    else setError("Unable to load bookings.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id: string) => {
    const ok = await swConfirmDelete("Cancel this booking?", "This booking will be cancelled.");
    if (!ok) return;
    setDeleting(id);
    const res = await cancelBooking(id);
    if (res.success) { setBookings(p => p.filter(b => (b.id ?? b._id) !== id)); swToast("Booking cancelled"); }
    else swErrorToast(res.message ?? "Failed");
    setDeleting(null);
  };

  const counts: Record<Filter, number> = {
    ALL: bookings.length,
    PENDING:   bookings.filter(b => String(b.status).toUpperCase() === "PENDING").length,
    ACCEPTED:  bookings.filter(b => String(b.status).toUpperCase() === "ACCEPTED").length,
    CONFIRMED: bookings.filter(b => String(b.status).toUpperCase() === "CONFIRMED").length,
    CANCELLED: bookings.filter(b => String(b.status).toUpperCase() === "CANCELLED").length,
    REJECTED:  bookings.filter(b => String(b.status).toUpperCase() === "REJECTED").length,
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => String(b.status).toUpperCase() === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-xs text-gray-500 mt-1">Track your mentoring session bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["ALL","PENDING","ACCEPTED","CONFIRMED","CANCELLED","REJECTED"] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f ? "bg-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-[10px] font-bold ${filter === f ? "text-blue-100" : "text-gray-400"}`}>
              {counts[f]}
            </span>
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
        <div className="space-y-3">
          {filtered.map(b => {
            const id  = b.id ?? b._id ?? "";
            const raw = String(b.status ?? "PENDING").toUpperCase();
            const canCancel = ["PENDING"].includes(raw);
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-800">
                      {b.service?.name ?? b.service?.category ?? "Mentoring Session"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <User size={12} className="text-gray-400" /> {b.mentor?.name ?? "Mentor"}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
                      {b.date && <span className="flex items-center gap-1"><Calendar size={11} />
                        {new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>}
                      {b.time && <span className="flex items-center gap-1"><Clock size={11} />{b.time}</span>}
                      {b.service?.fee && <span className="font-semibold text-gray-600">৳{b.service.fee}</span>}
                    </div>
                    {b.notes && <p className="text-[11px] text-gray-400 italic">"{b.notes}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${statusStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                    {raw.charAt(0) + raw.slice(1).toLowerCase()}
                  </span>
                  {canCancel && (
                    <button onClick={() => handleCancel(id)} disabled={deletingId === id}
                      className="flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40">
                      {deletingId === id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <BookOpen size={32} className="text-blue-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No bookings found</p>
          <p className="text-xs text-gray-400">Book a session with a mentor to get started.</p>
        </div>
      )}
    </div>
  );
}

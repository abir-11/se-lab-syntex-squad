"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2, Clock } from "lucide-react";
import { fetchBookings } from "../_actions/adminActions";

interface Booking {
  id?: string;
  _id?: string;
  studentId?: string;
  mentorId?: string;
  date?: string;
  time?: string;
  status?: string;
  notes?: string;
  service?: { name?: string; category?: string };
  student?: { name?: string };
  mentor?: { name?: string };
}

const statusStyle: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-600",
  ACCEPTED: "bg-blue-50 text-blue-600",
  PENDING: "bg-amber-50 text-amber-600",
  CANCELLED: "bg-red-50 text-red-500",
  REJECTED: "bg-red-50 text-red-500",
};

export default function RecentBookingsCard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        // Show latest 5
        setBookings((res.data as Booking[]).slice(0, 5));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
        <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold">
          {bookings.length} shown
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((item) => {
            const id = item.id || item._id || Math.random().toString();
            const rawStatus = String(item.status || "PENDING").toUpperCase();
            const statusClass = statusStyle[rawStatus] || "bg-gray-100 text-gray-500";
            const topic =
              item.service?.name ||
              item.notes ||
              item.service?.category ||
              "Mentoring Session";
            const studentName = item.student?.name || "Student";

            return (
              <div
                key={id}
                className="bg-gray-50/70 p-3.5 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{studentName}</p>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{topic}</p>
                    {item.date && (
                      <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${statusClass}`}
                >
                  {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
          <BookOpen size={28} className="text-gray-200" />
          <p className="text-xs">No bookings found.</p>
        </div>
      )}
    </div>
  );
}

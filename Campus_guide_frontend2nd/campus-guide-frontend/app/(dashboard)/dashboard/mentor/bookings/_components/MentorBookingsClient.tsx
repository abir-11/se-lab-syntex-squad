"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, X, CalendarDays, Clock } from "lucide-react";
import {
  updateBookingAction,
} from "@/service/bookingActions";

type Booking = {
  id: string;
  date: string;
  time: string;
  notes: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED";
  createdAt: string;
  service: {
    id: string;
    name: string;
    category: string;
    fee: string;
  } | null;
  student: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600 border-yellow-300",
  ACCEPTED: "bg-blue-50 text-blue-600 border-blue-300",
  CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-300",
  REJECTED: "bg-red-50 text-red-500 border-red-300",
};

export default function MentorBookingsClient({
  bookings,
}: {
  bookings: Booking[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAction = async (booking: Booking, action: "accept" | "reject") => {
    setBusyId(booking.id);
    const result = await updateBookingAction(booking.id, action);
    setBusyId(null);

    if (result.success) {
      toast.success(result.message);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update booking");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Session Bookings</h1>
      <p className="text-gray-500 text-sm mt-1">
        Accept requests to schedule; students confirm after you accept.
      </p>

      <div className="mt-8 space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F68B1F]/15 flex items-center justify-center text-[#F68B1F] font-bold shrink-0 overflow-hidden">
                      {booking.student?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={booking.student.image}
                          alt={booking.student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        booking.student?.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {booking.student?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {booking.student?.email}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 font-bold text-gray-800">
                    {booking.service?.name || "Service"}
                    <span className="ml-2 text-xs font-semibold text-[#F68B1F] uppercase">
                      {booking.service?.category}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#F68B1F]" />
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#F68B1F]" />
                      {booking.time}
                    </span>
                  </div>

                  {booking.notes && (
                    <p className="text-sm text-gray-500 mt-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(booking, "accept")}
                        disabled={busyId === booking.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {busyId === booking.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(booking, "reject")}
                        disabled={busyId === booking.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
            No booking requests yet.
          </div>
        )}
      </div>
    </div>
  );
}

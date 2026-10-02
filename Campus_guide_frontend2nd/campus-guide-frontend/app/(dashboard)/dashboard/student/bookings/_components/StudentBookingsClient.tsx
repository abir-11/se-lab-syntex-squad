"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, X, CalendarDays, Clock } from "lucide-react";
import {
  updateBookingAction,
  cancelBookingAction,
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
  mentor: {
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

export default function StudentBookingsClient({
  bookings,
}: {
  bookings: Booking[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleConfirm = async (booking: Booking) => {
    setBusyId(booking.id);
    const result = await updateBookingAction(booking.id, "confirm");
    setBusyId(null);

    if (result.success) {
      toast.success(result.message);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to confirm booking");
    }
  };

  const handleCancel = async (booking: Booking) => {
    if (
      !window.confirm(
        `Cancel your booking for "${booking.service?.name}"?`
      )
    ) {
      return;
    }

    setBusyId(booking.id);
    const result = await cancelBookingAction(booking.id);
    setBusyId(null);

    if (result.success) {
      toast.success("Booking cancelled");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
      <p className="text-gray-500 text-sm mt-1">
        Confirm bookings your mentor has accepted. Pending bookings can be
        cancelled.
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
                  <p className="font-bold text-gray-800">
                    {booking.service?.name || "Service"}
                    <span className="ml-2 text-xs font-semibold text-[#F68B1F] uppercase">
                      {booking.service?.category}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-[#F68B1F]/15 flex items-center justify-center text-[#F68B1F] font-bold shrink-0 overflow-hidden">
                      {booking.mentor?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={booking.mentor.image}
                          alt={booking.mentor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        booking.mentor?.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      with{" "}
                      <span className="font-semibold text-gray-800">
                        {booking.mentor?.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
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
                    {booking.service?.fee && (
                      <span className="font-bold text-gray-700">
                        ৳{Number(booking.service.fee).toLocaleString()}
                      </span>
                    )}
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

                  {booking.status === "ACCEPTED" && (
                    <button
                      onClick={() => handleConfirm(booking)}
                      disabled={busyId === booking.id}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {busyId === booking.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Confirm
                    </button>
                  )}

                  {booking.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(booking)}
                      disabled={busyId === booking.id}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {busyId === booking.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
            No bookings yet. Browse mentor services and book a session!
          </div>
        )}
      </div>
    </div>
  );
}

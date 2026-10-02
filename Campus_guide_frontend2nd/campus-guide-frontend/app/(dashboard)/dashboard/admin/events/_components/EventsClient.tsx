"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, CalendarDays, MapPin } from "lucide-react";
import { deleteEventAction } from "../../_actions/adminActions";

type CampusEvent = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  location: string | null;
  createdAt: string;
  user?: { name: string };
};

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-[#F68B1F]/10 text-[#d97414] border-[#F68B1F]/40",
  ONGOING: "bg-emerald-50 text-emerald-600 border-emerald-300",
  COMPLETED: "bg-gray-50 text-gray-400 border-gray-200",
  CANCELLED: "bg-red-50 text-red-500 border-red-300",
  PENDING: "bg-yellow-50 text-yellow-600 border-yellow-300",
};

export default function EventsClient({ events }: { events: CampusEvent[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleDelete = async (event: CampusEvent) => {
    if (!window.confirm(`Delete event "${event.title}"?`)) return;

    setBusyId(event.id);
    const result = await deleteEventAction(event.id);
    setBusyId(null);

    if (result.success) {
      toast.success("Event deleted");
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to delete event");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Campus Events</h1>
      <p className="text-gray-500 text-sm mt-1">
        Events are created by faculty. You can remove events here.
      </p>

      <div className="mt-8 space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">
                    {event.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#F68B1F]" />
                      {new Date(event.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F68B1F]" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Posted by {event.user?.name || "Unknown"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0 items-end">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border ${
                      statusStyles[event.status] || statusStyles.PENDING
                    }`}
                  >
                    {event.status}
                  </span>
                  <button
                    onClick={() => handleDelete(event)}
                    disabled={busyId === event.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
            No events yet.
          </div>
        )}
      </div>
    </div>
  );
}

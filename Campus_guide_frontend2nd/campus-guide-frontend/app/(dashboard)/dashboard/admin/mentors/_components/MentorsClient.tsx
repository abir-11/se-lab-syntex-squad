"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Loader2, Info } from "lucide-react";
import { updateMentorStatusAction } from "../../_actions/adminActions";

type Mentor = {
  id: string;
  status: string;
  department: string | null;
  rating: number;
  sessions: number;
  mobile: string | null;
  bio: string | null;
  image: string | null;
  user: { id: string; name: string; email: string; image?: string | null };
};

export default function MentorsClient({ mentors }: { mentors: Mentor[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatusChange = async (mentorId: string, status: string) => {
    setBusyId(mentorId);
    const result = await updateMentorStatusAction(mentorId, status);
    setBusyId(null);

    if (result.success) {
      toast.success(`Mentor status set to ${status}`);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">Mentors</h1>
      <p className="text-gray-500 text-sm mt-1">
        {mentors.length} approved mentors on the platform.
      </p>

      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-[#F68B1F]/5 border border-[#F68B1F]/20 rounded-xl px-4 py-3 max-w-2xl">
        <Info className="w-4 h-4 text-[#F68B1F] shrink-0 mt-0.5" />
        <span>
          The mentors API only exposes approved mentors. Newly registered
          mentors appear here once their profile is created and approved.
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F68B1F]/15 border border-[#F68B1F]/30 flex items-center justify-center text-[#F68B1F] font-extrabold overflow-hidden shrink-0">
                  {mentor.image || mentor.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mentor.image || mentor.user?.image || undefined}
                      alt={mentor.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    mentor.user?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {mentor.user?.name}
                  </h2>
                  <p className="text-sm text-[#F68B1F]">
                    {mentor.department || "Mentor"}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {mentor.user?.email}
                  </p>
                </div>
              </div>

              {mentor.bio && (
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                  {mentor.bio}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#F68B1F] fill-[#F68B1F]" />
                  {Number(mentor.rating).toFixed(1)}
                </span>
                <span>{mentor.sessions} sessions</span>
              </div>

              {/* Status control */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={mentor.status}
                  disabled={busyId === mentor.id}
                  onChange={(e) => handleStatusChange(mentor.id, e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/40 focus:border-[#F68B1F] disabled:opacity-50"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                {busyId === mentor.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#F68B1F]" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400 border border-gray-200 rounded-2xl bg-white">
            No approved mentors yet.
          </div>
        )}
      </div>
    </div>
  );
}

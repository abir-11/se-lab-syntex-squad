import React from "react";
import Link from "next/link";
import { Star, GraduationCap } from "lucide-react";
import { getAllMentors } from "@/service/getAllMentors";

export const dynamic = "force-dynamic";

const MentorsPage = async () => {
  const mentorsRes = await getAllMentors();
  const mentors = mentorsRes?.data || [];

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F68B1F]">
          Mentors
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Our Approved Mentors
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Every mentor here is approved by the campus administration. Book a
          session with any of them through their services.
        </p>
      </div>

      {/* Mentor grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-[0_0_25px_rgba(246,139,31,0.12)] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-[#F68B1F]/20 border border-[#F68B1F]/40 flex items-center justify-center text-[#F68B1F] text-xl font-extrabold overflow-hidden">
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
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">
                      {mentor.user?.name}
                    </h2>
                    <p className="text-sm text-[#F68B1F]">
                      {mentor.department || "Mentor"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {mentor.user?.email}
                    </p>
                  </div>
                </div>

                {mentor.bio && (
                  <p className="text-sm text-gray-400 mt-4 line-clamp-3">
                    {mentor.bio}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#F68B1F] fill-[#F68B1F]" />
                      {Number(mentor.rating).toFixed(1)}
                    </span>
                    <span>{mentor.sessions} sessions</span>
                  </div>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#F68B1F] hover:bg-[#d97414] px-4 py-2 rounded-lg transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-gray-900/40">
            <GraduationCap className="w-12 h-12 text-[#F68B1F]/50 mx-auto" />
            <p className="text-gray-400 mt-4">
              No approved mentors yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsPage;

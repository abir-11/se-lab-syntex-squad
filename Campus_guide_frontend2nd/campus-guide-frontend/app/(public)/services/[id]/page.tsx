import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, GraduationCap, Tag } from "lucide-react";
import { getMentorServiceById } from "@/service/getAllMentorServices";
import { getMe } from "@/service/getMe";
import BookingForm from "./_components/BookingForm";

export const dynamic = "force-dynamic";

const ServiceDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [serviceRes, user] = await Promise.all([
    getMentorServiceById(id),
    getMe(),
  ]);

  if (!serviceRes?.success || !serviceRes?.data?.result) {
    notFound();
  }

  const service = serviceRes.data.result;
  const mentorProfile = service.mentor?.mentorProfile;

  const isLoggedIn = user?.success && !!user?.data?.result;
  const currentUser = user?.data?.result;
  const isStudent = isLoggedIn && currentUser?.role === "STUDENT";

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#F68B1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to services
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: service details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#F68B1F]/25 via-[#d97414]/15 to-gray-900 h-64 sm:h-80 flex items-center justify-center">
              {service.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl font-extrabold text-[#F68B1F]/70 uppercase">
                  {service.category?.charAt(0) || "S"}
                </span>
              )}
            </div>

            {/* Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#F68B1F] rounded-full px-3 py-1">
                  <Tag className="w-3 h-3" />
                  {service.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-3 py-1">
                  Approved
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
                {service.name}
              </h1>
              <p className="mt-4 text-gray-400 text-base leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Mentor card */}
            <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                About the mentor
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-full bg-[#F68B1F]/20 border border-[#F68B1F]/40 flex items-center justify-center text-[#F68B1F] text-xl font-extrabold overflow-hidden">
                  {service.mentor?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.mentor.image}
                      alt={service.mentor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    service.mentor?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {service.mentor?.name || service.mentorName}
                  </h3>
                  <p className="text-sm text-[#F68B1F]">
                    {mentorProfile?.department || "Mentor"}
                  </p>
                  {mentorProfile?.bio && (
                    <p className="text-sm text-gray-400 mt-2">
                      {mentorProfile.bio}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    {mentorProfile && (
                      <>
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-[#F68B1F] fill-[#F68B1F]" />
                          {Number(mentorProfile.rating).toFixed(1)} rating
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#F68B1F]" />
                          {mentorProfile.sessions} sessions
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: booking sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <BookingForm
              serviceId={service.id}
              fee={service.fee}
              isStudent={isStudent}
              isLoggedIn={isLoggedIn}
            />

            {service.mobile && (
              <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Contact
                </p>
                <p className="text-sm text-gray-300 mt-2">{service.mobile}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

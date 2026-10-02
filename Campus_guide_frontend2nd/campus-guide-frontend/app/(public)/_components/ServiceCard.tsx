import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { MentorService } from "@/service/getAllMentorServices";

export default function ServiceCard({ service }: { service: MentorService }) {
  const mentorProfile = service.mentor?.mentorProfile;

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F68B1F]/50 hover:shadow-[0_0_25px_rgba(246,139,31,0.15)] transition-all duration-300 flex flex-col"
    >
      {/* Image / placeholder */}
      <div className="h-44 bg-gradient-to-br from-[#F68B1F]/25 via-[#d97414]/15 to-gray-900 relative overflow-hidden flex items-center justify-center">
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl font-extrabold text-[#F68B1F]/70 uppercase">
            {service.category?.charAt(0) || "S"}
          </span>
        )}
        <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider text-white bg-[#F68B1F] rounded-full px-3 py-1">
          {service.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white group-hover:text-[#F68B1F] transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          by <span className="text-gray-400">{service.mentorName}</span>
          {mentorProfile?.department ? ` • ${mentorProfile.department}` : ""}
        </p>
        <p className="text-sm text-gray-400 mt-3 line-clamp-2 flex-1">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-lg font-extrabold text-[#F68B1F]">
              ৳{Number(service.fee).toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-500">per session</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {mentorProfile && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F68B1F] fill-[#F68B1F]" />
                {Number(mentorProfile.rating).toFixed(1)} ({mentorProfile.sessions})
              </span>
            )}
            <span className="flex items-center gap-1 text-[#F68B1F] font-semibold group-hover:gap-2 transition-all">
              Book <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

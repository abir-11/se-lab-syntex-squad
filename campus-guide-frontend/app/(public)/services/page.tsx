import { Layers, Star, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getServices() {
  try {
    const res = await fetch(`${BACKEND}/api/mentor-services?limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch { return []; }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Mentor Services</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Explore Mentoring Services</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Browse approved services offered by our experienced mentors.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc: any) => {
              const id = svc.id ?? svc._id ?? "";
              return (
                <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{svc.category}</span>
                    <span className="text-base font-bold text-orange-500">৳{svc.fee ?? 0}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{svc.name ?? svc.category}</h3>
                  {svc.description && <p className="text-xs text-gray-500 line-clamp-2">{svc.description}</p>}
                  {svc.mentor && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                        {svc.mentor.name?.charAt(0) ?? "M"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{svc.mentor.name}</p>
                        {svc.mentor.mentorProfileDetails?.rating != null && (
                          <p className="text-[10px] text-amber-500 flex items-center gap-0.5">
                            <Star size={10} fill="currentColor" /> {svc.mentor.mentorProfileDetails.rating.toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <Link href={`/mentors/${svc.mentorId ?? ""}`}
                    className="flex items-center justify-center gap-1 w-full bg-orange-500 text-white text-xs font-semibold py-2 rounded-xl hover:bg-orange-600 transition-all active:scale-[0.98]">
                    View Mentor <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Layers size={36} className="text-orange-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No services available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

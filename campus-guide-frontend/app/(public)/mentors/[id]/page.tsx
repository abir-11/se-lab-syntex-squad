import { Star, BookOpen, Phone, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getMentor(id: string) {
  try {
    const res = await fetch(`${BACKEND}/api/mentors/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.result ?? data?.data ?? data;
  } catch { return null; }
}

async function getMentorServices(mentorId: string) {
  try {
    const res = await fetch(`${BACKEND}/api/mentor-services?limit=50`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const all  = Array.isArray(data?.data) ? data.data : [];
    return all.filter((s: any) => s.mentorId === mentorId);
  } catch { return []; }
}

export default async function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [mentor, services] = await Promise.all([getMentor(id), getMentorServices(id)]);
  if (!mentor) notFound();

  const name    = mentor.user?.name ?? mentor.name ?? "Mentor";
  const profile = mentor.mentorProfileDetails ?? mentor;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Back */}
        <Link href="/mentors" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Mentors
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-orange-400 to-orange-500" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-4 mb-4">
              {mentor.image ? (
                <img src={mentor.image} alt={name} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-2xl border-4 border-white bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-3xl shadow-md">
                  {name.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                  <Star size={16} fill="currentColor" /> {(profile?.rating ?? 0).toFixed(1)}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <BookOpen size={14} /> {profile?.sessions ?? 0} sessions
                </span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
            {(profile?.department || mentor.department) && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Building2 size={13} /> {profile?.department ?? mentor.department}
              </p>
            )}
            {(profile?.mobile || mentor.mobile) && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Phone size={13} /> {profile?.mobile ?? mentor.mobile}
              </p>
            )}

            {(profile?.bio ?? mentor.bio) && (
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{profile?.bio ?? mentor.bio}</p>
            )}

            {Array.isArray(profile?.goodSubjects) && profile.goodSubjects.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {profile.goodSubjects.map((s: string) => (
                    <span key={s} className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Available Services</h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc: any) => {
                const sid = svc.id ?? svc._id ?? "";
                return (
                  <div key={sid} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800 text-sm">{svc.name ?? svc.category}</h3>
                      <span className="text-sm font-bold text-orange-500 shrink-0">৳{svc.fee ?? 0}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{svc.category}</span>
                    {svc.description && <p className="text-xs text-gray-500 line-clamp-2">{svc.description}</p>}
                    <Link href="/register"
                      className="block w-full text-center bg-orange-500 text-white text-xs font-semibold py-2 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all mt-2">
                      Book This Service
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
              No services available from this mentor yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

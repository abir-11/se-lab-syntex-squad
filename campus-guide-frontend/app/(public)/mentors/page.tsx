import { Star, Users, BookOpen, Search } from "lucide-react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getMentors() {
  try {
    const res = await fetch(`${BACKEND}/api/mentors?limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return list.filter((m: any) => !m.status || String(m.status).toUpperCase() === "APPROVED");
  } catch { return []; }
}

export default async function PublicMentorsPage() {
  const mentors = await getMentors();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Our Mentors</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Find Your Perfect Mentor</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Connect with experienced mentors from UIU to guide your academic and career journey.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mentors.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">{mentors.length} mentor{mentors.length !== 1 ? "s" : ""} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mentors.map((m: any) => {
                const id   = m.userId ?? m.id ?? m._id ?? "";
                const name = m.user?.name ?? m.name ?? "Mentor";
                const prof = m.mentorProfileDetails ?? m;
                return (
                  <Link key={id} href={`/mentors/${id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden group">
                    {m.image ? (
                      <img src={m.image} alt={name} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-orange-300">{name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-500 transition-colors">{name}</h3>
                      {(prof?.department || m.department) && (
                        <p className="text-xs text-gray-500">{prof?.department ?? m.department}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" />{(prof?.rating ?? m.rating ?? 0).toFixed(1)}</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} />{prof?.sessions ?? m.sessions ?? 0} sessions</span>
                      </div>
                      {(prof?.bio ?? m.bio) && (
                        <p className="text-[11px] text-gray-400 line-clamp-2">{prof?.bio ?? m.bio}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Users size={36} className="text-orange-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No mentors available yet</p>
            <p className="text-sm text-gray-400">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

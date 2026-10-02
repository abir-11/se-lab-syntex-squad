import { BookOpen, ExternalLink, Tag } from "lucide-react";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getResources() {
  try {
    const res = await fetch(`${BACKEND}/api/resources/public`, { cache: "no-store" });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

export default async function ResourcesPage() {
  const resources = await getResources();
  const categories = ["ALL", ...Array.from(new Set(resources.map((r: any) => r.category ?? "OTHER"))) as string[]];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Resources</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Learning Resources</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Access curated academic and learning materials shared by our mentors.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map((r: any) => {
              const id = r.id ?? r._id ?? "";
              return (
                <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {r.image ? (
                    <img src={r.image} alt={r.title} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                      <BookOpen size={36} className="text-teal-300" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                      <Tag size={10} />{(r.category ?? "OTHER").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                    </span>
                    <h3 className="font-bold text-gray-800 text-sm">{r.title}</h3>
                    {r.description && <p className="text-xs text-gray-500 line-clamp-2">{r.description}</p>}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      {r.user?.name && <p className="text-[11px] text-gray-400">By {r.user.name}</p>}
                      {r.link && (
                        <a href={r.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 hover:underline ml-auto">
                          <ExternalLink size={12} /> Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center">
              <BookOpen size={36} className="text-teal-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No resources available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

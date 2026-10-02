import { Newspaper, Calendar, Globe } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getNews() {
  try {
    const res = await fetch(`${BACKEND}/api/campus-news/published`, { cache: "no-store" });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

export default async function CampusNewsPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Campus News</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Latest Campus News</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Stay informed with the latest happenings and announcements from UIU.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {news.map((n: any) => {
              const id   = n.id ?? n._id ?? "";
              const date = n.publishedAt ?? n.createdAt;
              return (
                <article key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {n.image ? (
                    <img src={n.image} alt={n.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
                      <Newspaper size={40} className="text-sky-300" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Globe size={10} />{(n.category ?? "GENERAL").replace("_", " ").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                      </span>
                      {date && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={10} />{new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm flex-1">{n.title}</h3>
                    {n.content && <p className="text-xs text-gray-500 line-clamp-3">{n.content}</p>}
                    {n.user?.name && <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-auto">By {n.user.name}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center">
              <Newspaper size={36} className="text-sky-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No news published yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

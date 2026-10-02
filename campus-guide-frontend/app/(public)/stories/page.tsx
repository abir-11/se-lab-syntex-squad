import { Quote, Calendar } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getStories() {
  try {
    const res = await fetch(`${BACKEND}/api/stories`, { cache: "no-store" });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Success Stories</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Stories of Impact</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Real stories from UIU students who transformed their journeys with Campus Guide.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-6">
        {stories.length > 0 ? stories.map((s: any) => {
          const id = s.id ?? s._id ?? "";
          return (
            <article key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {s.image && <img src={s.image} alt={s.title} className="w-full h-48 object-cover" />}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Quote size={16} className="text-orange-400 flex-shrink-0" />
                  <h2 className="font-bold text-gray-900 text-lg">{s.title}</h2>
                </div>
                {s.excerpt && <p className="text-gray-600 italic text-sm">{s.excerpt}</p>}
                {s.body && <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>}
                {s.date && (
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-2 border-t border-gray-100">
                    <Calendar size={11} />{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </article>
          );
        }) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Quote size={36} className="text-orange-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No stories yet</p>
            <p className="text-sm text-gray-400">Be the first to share your success story!</p>
          </div>
        )}
      </div>
    </div>
  );
}

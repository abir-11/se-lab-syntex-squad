"use client";

import { useEffect, useState, useCallback } from "react";
import { Newspaper, Loader2, Calendar, Search, Globe, X } from "lucide-react";
import { fetchPublishedNews } from "../_actions/studentActions";

interface NewsItem {
  id?: string; _id?: string;
  title: string; content?: string; category?: string;
  image?: string; publishedAt?: string; createdAt?: string;
  user?: { name?: string };
}

export default function StudentNewsPage() {
  const [news, setNews]       = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("ALL");
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchPublishedNews();
    if (res.success) setNews(res.data as NewsItem[]);
    else setError("Unable to load news.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = ["ALL", ...Array.from(new Set(news.map(n => n.category ?? "GENERAL")))];

  const filtered = news.filter(n => {
    const q  = search.toLowerCase();
    const mc = filter === "ALL" || (n.category ?? "GENERAL") === filter;
    const ms = !q || n.title.toLowerCase().includes(q) || (n.content ?? "").toLowerCase().includes(q);
    return mc && ms;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus News</h1>
          <p className="text-xs text-gray-500 mt-1">Latest updates from campus</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === c ? "bg-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            {c === "ALL" ? "All" : c.replace("_", " ").toLowerCase().replace(/^\w/, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(n => {
            const id   = n.id ?? n._id ?? "";
            const date = n.publishedAt ?? n.createdAt;
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {n.image ? (
                  <img src={n.image} alt={n.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
                    <Newspaper size={36} className="text-sky-300" />
                  </div>
                )}
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Globe size={10} />
                      {(n.category ?? "GENERAL").replace("_", " ").toLowerCase().replace(/^\w/, l => l.toUpperCase())}
                    </span>
                    {date && <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug flex-1">{n.title}</h3>
                  {n.content && <p className="text-xs text-gray-500 line-clamp-3">{n.content}</p>}
                  {n.user?.name && <p className="text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-100">By {n.user.name}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center">
            <Newspaper size={32} className="text-sky-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {search ? `No news for "${search}"` : "No news published yet"}
          </p>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-blue-500 hover:underline">Clear search</button>}
        </div>
      )}
    </div>
  );
}

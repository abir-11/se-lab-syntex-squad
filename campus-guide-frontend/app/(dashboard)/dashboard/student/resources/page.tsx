"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Loader2, ExternalLink, Search, Tag, X, BookOpen } from "lucide-react";
import { fetchPublicResources } from "../_actions/studentActions";

interface Resource {
  id?: string; _id?: string;
  title: string; description?: string; category?: string;
  link?: string; image?: string;
  user?: { name?: string };
}

export default function StudentResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("ALL");
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchPublicResources();
    if (res.success) setResources(res.data as Resource[]);
    else setError("Unable to load resources.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = ["ALL", ...Array.from(new Set(resources.map(r => r.category ?? "OTHER")))];

  const filtered = resources.filter(r => {
    const q  = search.toLowerCase();
    const mc = filter === "ALL" || (r.category ?? "OTHER") === filter;
    const ms = !q || r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q);
    return mc && ms;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-xs text-gray-500 mt-1">Academic and learning materials</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === c ? "bg-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            {c === "ALL" ? "All" : c.charAt(0) + c.slice(1).toLowerCase()}
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
          {filtered.map(res => {
            const id = res.id ?? res._id ?? "";
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {res.image ? (
                  <img src={res.image} alt={res.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                    <BookOpen size={32} className="text-teal-300" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <Tag size={10} />
                    {(res.category ?? "OTHER").charAt(0) + (res.category ?? "OTHER").slice(1).toLowerCase()}
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug">{res.title}</h3>
                  {res.description && <p className="text-xs text-gray-500 line-clamp-2">{res.description}</p>}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {res.user?.name && <p className="text-[11px] text-gray-400">By {res.user.name}</p>}
                    {res.link && (
                      <a href={res.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline ml-auto">
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
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center">
            <FileText size={32} className="text-teal-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {search ? `No resources for "${search}"` : "No resources available yet"}
          </p>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-blue-500 hover:underline">Clear search</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[11px] text-gray-400 text-right">Showing {filtered.length} of {resources.length} resources</p>
      )}
    </div>
  );
}

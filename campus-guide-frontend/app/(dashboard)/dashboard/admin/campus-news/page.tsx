"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Newspaper, Loader2, Trash2, Pencil, Plus, Search, X,
  Image as ImageIcon, Tag, FileText, CalendarDays, Globe, EyeOff,
} from "lucide-react";
import {
  fetchCampusNews, createCampusNews, updateCampusNews, deleteCampusNews,
} from "../_actions/adminActions";
import { swConfirmDelete, swConfirm, swErrorToast, swToast } from "@/lib/swal";

// ── Types ─────────────────────────────────────────────────────────────────────
interface NewsItem {
  id?: string; _id?: string;
  title: string; content: string;
  category?: string; image?: string; status?: string;
  publishedAt?: string; createdAt?: string;
  user?: { name?: string };
}

const CATEGORIES = ["ACADEMIC", "RESEARCH", "CAMPUS_LIFE", "SPORTS", "ACHIEVEMENTS", "GENERAL"];
const STATUSES   = ["DRAFT", "PUBLISHED"];

const statusStyle: Record<string, { bg: string; icon: React.ElementType }> = {
  PUBLISHED: { bg: "bg-emerald-50 text-emerald-600", icon: Globe },
  DRAFT:     { bg: "bg-gray-100 text-gray-500",      icon: EyeOff },
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function NewsModal({
  initial, onClose, onSaved,
}: {
  initial?: NewsItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title:       initial?.title    ?? "",
    content:     initial?.content  ?? "",
    category:    initial?.category ?? "GENERAL",
    image:       initial?.image    ?? "",
    status:      initial?.status   ?? "DRAFT",
    publishedAt: initial?.publishedAt
      ? new Date(initial.publishedAt).toISOString().slice(0, 16)
      : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true); setError("");
    const payload = {
      ...form,
      image: form.image || undefined,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    };
    const res = isEdit
      ? await updateCampusNews((initial?.id || initial?._id)!, payload)
      : await createCampusNews(payload);
    setLoading(false);
    if (res.success) { onSaved(); onClose(); }
    else setError(res.message || "Something went wrong");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-gray-100 my-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? "Edit News" : "Create Campus News"}</h2>
            <p className="text-[11px] text-gray-400">Share updates with the campus community</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <span className="flex items-center gap-1"><FileText size={12} className="text-gray-400" />Title <span className="text-red-500">*</span></span>
            </label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required
              placeholder="e.g. Annual Science Fair 2026 Highlights"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <span className="flex items-center gap-1"><Tag size={12} className="text-gray-400" />Category</span>
              </label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ").charAt(0) + c.replace("_", " ").slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <span className="flex items-center gap-1"><ImageIcon size={12} className="text-gray-400" />Image URL (Optional)</span>
            </label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Published At */}
          {form.status === "PUBLISHED" && (
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <span className="flex items-center gap-1"><CalendarDays size={12} className="text-gray-400" />Publish Date (Optional)</span>
              </label>
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700" />
            </div>
          )}

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea value={form.content} onChange={(e) => set("content", e.target.value)} required
              rows={5} placeholder="Write the full news content here…"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-orange-200">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Publish News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminCampusNewsPage() {
  const [news, setNews]             = useState<NewsItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("ALL");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<NewsItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetchCampusNews();
    if (res.success) setNews(res.data as NewsItem[]);
    else setError("Unable to load news. Please try again.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this news article?",
      "This article will be permanently removed."
    );
    if (!confirmed) return;
    setDeletingId(id);
    const res = await deleteCampusNews(id);
    if (res.success) {
      setNews((p) => p.filter((n) => (n.id || n._id) !== id));
      swToast("News article deleted successfully");
    } else {
      swErrorToast(res.message || "Failed to delete");
    }
    setDeletingId(null);
  };

  const handleTogglePublish = async (item: NewsItem) => {
    const id = item.id || item._id || "";
    const newStatus = String(item.status).toUpperCase() === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const label = newStatus === "PUBLISHED" ? "Publish" : "Unpublish";
    const confirmed = await swConfirm(
      `${label} this article?`,
      `"${item.title}" will be ${newStatus === "PUBLISHED" ? "visible to the public" : "moved back to draft"}.`,
      label
    );
    if (!confirmed) return;
    const res = await updateCampusNews(id, { status: newStatus });
    if (res.success) {
      swToast(`Article ${newStatus === "PUBLISHED" ? "published" : "unpublished"} successfully`);
      load();
    } else {
      swErrorToast(res.message || "Failed to update");
    }
  };

  const counts = {
    ALL: news.length,
    PUBLISHED: news.filter((n) => String(n.status).toUpperCase() === "PUBLISHED").length,
    DRAFT: news.filter((n) => String(n.status).toUpperCase() === "DRAFT").length,
  };

  const filtered = news.filter((n) => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "ALL" || String(n.status).toUpperCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus News</h1>
          <p className="text-xs text-gray-500 mt-1">Manage and publish campus news articles</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200 self-start sm:self-auto">
          <Plus size={15} /> Create News
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className={`ml-1.5 text-[10px] font-bold ${filterStatus === s ? "text-orange-100" : "text-gray-400"}`}>{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const id = item.id || item._id || "";
            const rawStatus = String(item.status || "DRAFT").toUpperCase();
            const statusCfg = statusStyle[rawStatus] || statusStyle.DRAFT;
            const StatusIcon = statusCfg.icon;
            const isDeleting = deletingId === id;

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
                    <Newspaper size={36} className="text-sky-300" />
                  </div>
                )}
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {(item.category || "GENERAL").replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${statusCfg.bg}`}>
                      <StatusIcon size={10} />
                      {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.content}</p>

                  {item.user?.name && (
                    <p className="text-[11px] text-gray-400">By {item.user.name}</p>
                  )}

                  {(item.publishedAt || item.createdAt) && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <CalendarDays size={11} />
                      {new Date(item.publishedAt || item.createdAt!).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {/* Publish toggle */}
                    <button onClick={() => handleTogglePublish(item)}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${rawStatus === "PUBLISHED" ? "text-gray-500 hover:bg-gray-100" : "text-emerald-600 hover:bg-emerald-50"}`}>
                      {rawStatus === "PUBLISHED" ? <><EyeOff size={12} /> Unpublish</> : <><Globe size={12} /> Publish</>}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditing(item); setModalOpen(true); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(id)} disabled={isDeleting}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40">
                        {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
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
          <div>
            <p className="text-sm font-semibold text-gray-700">No news articles yet</p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? `No results for "${search}"` : 'Click "Create News" to write the first article.'}
            </p>
          </div>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-orange-500 hover:underline">Clear search</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[11px] text-gray-400 text-right">Showing {filtered.length} of {news.length} articles</p>
      )}

      {modalOpen && <NewsModal initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BookOpen, Loader2, Trash2, Pencil, Plus, Search, ExternalLink,
  X, Link2, FileText, Tag, Image as ImageIcon, CheckCircle2,
} from "lucide-react";
import {
  fetchResources, createResource, updateResource, deleteResource,
} from "../_actions/adminActions";
import { swConfirmDelete, swErrorToast, swToast } from "@/lib/swal";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Resource {
  id?: string; _id?: string;
  title: string; description?: string; category?: string;
  link?: string; image?: string; status?: string;
  user?: { name?: string };
}

const CATEGORIES = ["ACADEMIC", "RESEARCH", "CAREER", "LIBRARY", "TOOLS", "OTHER"];
const STATUSES   = ["PENDING", "APPROVED", "REJECTED"];

const statusStyle: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-600",
  PENDING:  "bg-amber-50 text-amber-600",
  REJECTED: "bg-red-50 text-red-500",
};

const empty = { title: "", description: "", category: "ACADEMIC", link: "", image: "", status: "PENDING" };

// ── Modal ─────────────────────────────────────────────────────────────────────
function ResourceModal({
  initial, onClose, onSaved,
}: {
  initial?: Resource | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title:       initial?.title       ?? "",
    description: initial?.description ?? "",
    category:    initial?.category    ?? "ACADEMIC",
    link:        initial?.link        ?? "",
    image:       initial?.image       ?? "",
    status:      initial?.status      ?? "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.link.trim()) {
      setError("Title and Link are required.");
      return;
    }
    setLoading(true); setError("");
    const payload = { ...form, image: form.image || undefined };
    const res = isEdit
      ? await updateResource((initial?.id || initial?._id)!, payload)
      : await createResource(payload);
    setLoading(false);
    if (res.success) { onSaved(); onClose(); }
    else setError(res.message || "Something went wrong");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? "Edit Resource" : "Add New Resource"}</h2>
            <p className="text-[11px] text-gray-400">Fill in the resource details below</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <span className="flex items-center gap-1"><FileText size={12} className="text-gray-400" /> Title <span className="text-red-500">*</span></span>
            </label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required
              placeholder="e.g. Introduction to Machine Learning"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <span className="flex items-center gap-1"><Tag size={12} className="text-gray-400" /> Category</span>
              </label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white text-gray-700">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-gray-400" /> Status</span>
              </label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white text-gray-700">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <span className="flex items-center gap-1"><Link2 size={12} className="text-gray-400" /> Resource URL <span className="text-red-500">*</span></span>
            </label>
            <input value={form.link} onChange={(e) => set("link", e.target.value)} required
              placeholder="https://example.com/resource"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Image */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              <span className="flex items-center gap-1"><ImageIcon size={12} className="text-gray-400" /> Image URL (Optional)</span>
            </label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Description (Optional)</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={2} placeholder="Brief description of the resource..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminResourcesPage() {
  const [resources, setResources]   = useState<Resource[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("ALL");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetchResources();
    if (res.success) setResources(res.data as Resource[]);
    else setError("Unable to load resources. Please try again.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this resource?",
      "This resource will be permanently removed."
    );
    if (!confirmed) return;
    setDeletingId(id);
    const res = await deleteResource(id);
    if (res.success) {
      setResources((p) => p.filter((r) => (r.id || r._id) !== id));
      swToast("Resource deleted successfully");
    } else {
      swErrorToast(res.message || "Failed to delete");
    }
    setDeletingId(null);
  };

  const filtered = resources.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "ALL" || String(r.status).toUpperCase() === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-xs text-gray-500 mt-1">Manage academic and learning resources</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200 self-start sm:self-auto">
          <Plus size={15} /> Add Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}
          <button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const id = item.id || item._id || "";
            const rawStatus = String(item.status || "PENDING").toUpperCase();
            const isDeleting = deletingId === id;
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                    <BookOpen size={32} className="text-purple-300" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {item.category ? item.category.charAt(0) + item.category.slice(1).toLowerCase() : "General"}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[rawStatus] || "bg-gray-100 text-gray-500"}`}>
                      {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-1">{item.title}</h3>
                  {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-orange-500 hover:underline font-semibold">
                        <ExternalLink size={12} /> Open Link
                      </a>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
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
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
            <BookOpen size={32} className="text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">No resources found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? `No results for "${search}"` : 'Click "Add Resource" to create one.'}
            </p>
          </div>
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-orange-500 hover:underline">Clear search</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[11px] text-gray-400 text-right">Showing {filtered.length} of {resources.length} resources</p>
      )}

      {modalOpen && <ResourceModal initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Layers, Plus, Pencil, Trash2, Loader2, X, Tag, DollarSign, FileText, Phone, Calendar, Clock } from "lucide-react";
import { fetchMyServices, createService, updateService, deleteService } from "../_actions/mentorActions";
import { swConfirmDelete, swToast, swErrorToast } from "@/lib/swal";

interface Service {
  id?: string; _id?: string;
  name?: string; category?: string; description?: string;
  fee?: number; mobile?: string; date?: string; time?: string;
  image?: string; status?: string; mentorId?: string;
}

const CATEGORIES = ["Career", "Academic", "Research", "Programming", "Design", "Language", "Business", "Other"];

const statusStyle: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-600",
  PENDING:  "bg-amber-50 text-amber-600",
  REJECTED: "bg-red-50 text-red-500",
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function ServiceModal({ initial, onClose, onSaved }: {
  initial?: Service | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name:        initial?.name        ?? "",
    category:    initial?.category    ?? "Academic",
    description: initial?.description ?? "",
    fee:         String(initial?.fee  ?? ""),
    mobile:      initial?.mobile      ?? "",
    date:        initial?.date ? new Date(initial.date).toISOString().slice(0,10) : "",
    time:        initial?.time        ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.fee) {
      setError("Name, description, and fee are required."); return;
    }
    setLoading(true); setError("");
    const payload = {
      name: form.name.trim(), category: form.category,
      description: form.description.trim(), fee: Number(form.fee),
      mobile: form.mobile || undefined, date: form.date || undefined,
      time: form.time || undefined,
    };
    const res = isEdit
      ? await updateService((initial?.id || initial?._id)!, payload)
      : await createService(payload);
    setLoading(false);
    if (res.success) { swToast(isEdit ? "Service updated!" : "Service created! Awaiting admin approval."); onSaved(); onClose(); }
    else setError(res.message ?? "Something went wrong");
  };

  const inputCls = "w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-300";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-gray-100 my-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? "Edit Service" : "Create New Service"}</h2>
            <p className="text-[11px] text-gray-400">Services require admin approval before going live</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><FileText size={12} className="text-gray-400"/>Service Name <span className="text-red-500">*</span></span></label>
            <input value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Python Programming Tutoring" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><Tag size={12} className="text-gray-400"/>Category</span></label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={`${inputCls} bg-white text-gray-700`}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><DollarSign size={12} className="text-gray-400"/>Fee (৳) <span className="text-red-500">*</span></span></label>
              <input type="number" min="0" value={form.fee} onChange={e => set("fee", e.target.value)} required placeholder="500" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><Calendar size={12} className="text-gray-400"/>Date (Optional)</span></label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className={`${inputCls} text-gray-700`} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><Clock size={12} className="text-gray-400"/>Time (Optional)</span></label>
              <input type="time" value={form.time} onChange={e => set("time", e.target.value)} className={`${inputCls} text-gray-700`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1"><span className="flex items-center gap-1"><Phone size={12} className="text-gray-400"/>Contact Number (Optional)</span></label>
            <input value={form.mobile} onChange={e => set("mobile", e.target.value)} placeholder="01XXXXXXXXX" className={inputCls} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} required rows={3}
              placeholder="Describe what you'll cover in this service…" className={`${inputCls} resize-none`} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-emerald-200">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MentorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState<Service | null>(null);
  const [deletingId, setDelId]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchMyServices();
    if (res.success) setServices(res.data as Service[]);
    else setError("Unable to load services.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, name: string) => {
    const ok = await swConfirmDelete("Delete this service?", `"${name}" will be permanently removed.`);
    if (!ok) return;
    setDelId(id);
    const res = await deleteService(id);
    if (res.success) { setServices(p => p.filter(s => (s.id ?? s._id) !== id)); swToast("Service deleted"); }
    else swErrorToast(res.message ?? "Failed to delete");
    setDelId(null);
  };

  const counts = { all: services.length, approved: services.filter(s => String(s.status).toUpperCase() === "APPROVED").length, pending: services.filter(s => String(s.status).toUpperCase() === "PENDING").length };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-xs text-gray-500 mt-1">Create and manage your mentoring services</p>
        </div>
        <button onClick={() => { setEditing(null); setModal(true); }}
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-200 self-start sm:self-auto">
          <Plus size={15} /> New Service
        </button>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="flex gap-3 flex-wrap">
          {[["All", counts.all, "bg-gray-100 text-gray-600"], ["Approved", counts.approved, "bg-emerald-50 text-emerald-600"], ["Pending", counts.pending, "bg-amber-50 text-amber-600"]].map(([l, v, cls]) => (
            <span key={l as string} className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>{l}: {v}</span>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={load} className="ml-auto underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={28} /></div>
      ) : services.length > 0 ? (
        <div className="space-y-3">
          {services.map(svc => {
            const id  = svc.id ?? svc._id ?? "";
            const raw = String(svc.status ?? "PENDING").toUpperCase();
            const isDel = deletingId === id;
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{svc.name ?? svc.category}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">৳{svc.fee ?? 0}</p>
                    {svc.description && <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{svc.description}</p>}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{svc.category}</span>
                      {svc.date && <span className="text-[10px] text-gray-400">{new Date(svc.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
                      {svc.time && <span className="text-[10px] text-gray-400">{svc.time}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${statusStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                    {raw.charAt(0) + raw.slice(1).toLowerCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEditing(svc); setModal(true); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(id, svc.name ?? svc.category ?? "Service")} disabled={isDel}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40">
                      {isDel ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Layers size={32} className="text-emerald-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No services yet</p>
          <p className="text-xs text-gray-400">Click &ldquo;New Service&rdquo; to create your first mentoring service.</p>
        </div>
      )}

      {modal && <ServiceModal initial={editing} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}

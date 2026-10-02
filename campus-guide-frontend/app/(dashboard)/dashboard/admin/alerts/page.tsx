"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell, Loader2, Trash2, Pencil, Plus, X,
  AlertTriangle, Info, Wrench, CalendarDays, ShieldAlert,
} from "lucide-react";
import {
  fetchAlerts, createAlert, updateAlert, deleteAlert,
} from "../_actions/adminActions";
import { swConfirmDelete, swErrorToast, swToast } from "@/lib/swal";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Alert {
  id?: string; _id?: string;
  title: string; message: string;
  alertType?: string; priority?: string; status?: string; date?: string;
  user?: { name?: string };
}

const TYPES      = ["GENERAL", "ACADEMIC", "EMERGENCY", "EVENT", "MAINTENANCE"];
const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
const STATUSES   = ["ACTIVE", "INACTIVE"];

const priorityStyle: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600",
  MEDIUM: "bg-amber-50 text-amber-600",
  LOW:    "bg-emerald-50 text-emerald-600",
};

const typeIcon: Record<string, React.ElementType> = {
  EMERGENCY:   ShieldAlert,
  ACADEMIC:    Info,
  EVENT:       CalendarDays,
  MAINTENANCE: Wrench,
  GENERAL:     Bell,
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function AlertModal({
  initial, onClose, onSaved,
}: {
  initial?: Alert | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    title:     initial?.title     ?? "",
    message:   initial?.message   ?? "",
    alertType: initial?.alertType ?? "GENERAL",
    priority:  initial?.priority  ?? "MEDIUM",
    status:    initial?.status    ?? "ACTIVE",
    date:      initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required.");
      return;
    }
    setLoading(true); setError("");
    const payload = { ...form, date: new Date(form.date).toISOString() };
    const res = isEdit
      ? await updateAlert((initial?.id || initial?._id)!, payload)
      : await createAlert(payload);
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
            <h2 className="text-base font-bold text-gray-900">{isEdit ? "Edit Alert" : "Create Campus Alert"}</h2>
            <p className="text-[11px] text-gray-400">Notify students about important updates</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required
              placeholder="e.g. Exam Schedule Update"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300" />
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Type</label>
              <select value={form.alertType} onChange={(e) => set("alertType", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700">
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white text-gray-700">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Date &amp; Time</label>
              <input type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700" />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required
              rows={3} placeholder="Detailed alert message for students…"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-300 resize-none" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-orange-200">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminAlertsPage() {
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [filterPriority, setFilter] = useState("ALL");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<Alert | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const res = await fetchAlerts();
    if (res.success) setAlerts(res.data as Alert[]);
    else setError("Unable to load alerts. Please try again.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    const confirmed = await swConfirmDelete(
      "Delete this alert?",
      "This alert will be permanently removed."
    );
    if (!confirmed) return;
    setDeletingId(id);
    const res = await deleteAlert(id);
    if (res.success) {
      setAlerts((p) => p.filter((a) => (a.id || a._id) !== id));
      swToast("Alert deleted successfully");
    } else {
      swErrorToast(res.message || "Failed to delete");
    }
    setDeletingId(null);
  };

  const counts = {
    ALL: alerts.length,
    HIGH: alerts.filter((a) => String(a.priority).toUpperCase() === "HIGH").length,
    MEDIUM: alerts.filter((a) => String(a.priority).toUpperCase() === "MEDIUM").length,
    LOW: alerts.filter((a) => String(a.priority).toUpperCase() === "LOW").length,
  };

  const filtered = filterPriority === "ALL"
    ? alerts
    : alerts.filter((a) => String(a.priority).toUpperCase() === filterPriority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Alerts</h1>
          <p className="text-xs text-gray-500 mt-1">Manage notifications and announcements</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200 self-start sm:self-auto">
          <Plus size={15} /> Create Alert
        </button>
      </div>

      {/* Priority filter */}
      <div className="flex gap-2 flex-wrap">
        {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
          <button key={p} onClick={() => setFilter(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterPriority === p ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}>
            {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-[10px] font-bold ${filterPriority === p ? "text-orange-100" : "text-gray-400"}`}>
              {counts[p]}
            </span>
          </button>
        ))}
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
        <div className="space-y-3">
          {filtered.map((item) => {
            const id = item.id || item._id || "";
            const rawPriority = String(item.priority || "MEDIUM").toUpperCase();
            const rawStatus   = String(item.status   || "ACTIVE").toUpperCase();
            const rawType     = String(item.alertType || "GENERAL").toUpperCase();
            const Icon = typeIcon[rawType] || Bell;
            const isDeleting = deletingId === id;

            return (
              <div key={id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${priorityStyle[rawPriority] || "bg-gray-50 text-gray-400"}`}>
                  <Icon size={18} />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyle[rawPriority] || "bg-gray-100 text-gray-500"}`}>
                        {rawPriority.charAt(0) + rawPriority.slice(1).toLowerCase()}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rawStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                        {rawStatus.charAt(0) + rawStatus.slice(1).toLowerCase()}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {rawType.charAt(0) + rawType.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
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
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.message}</p>
                  {item.date && (
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <CalendarDays size={11} />
                      {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={32} className="text-amber-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">No alerts yet</p>
            <p className="text-xs text-gray-400 mt-1">Click &ldquo;Create Alert&rdquo; to notify students.</p>
          </div>
        </div>
      )}

      {modalOpen && <AlertModal initial={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
    </div>
  );
}

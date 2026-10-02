"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Loader2, AlertTriangle, Info, Wrench, CalendarDays, ShieldAlert, X } from "lucide-react";
import { fetchActiveAlerts } from "../_actions/studentActions";

interface Alert {
  id?: string; _id?: string;
  title: string; message?: string;
  alertType?: string; priority?: string; date?: string;
}

const priorityStyle: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600",
  MEDIUM: "bg-amber-50 text-amber-600",
  LOW:    "bg-emerald-50 text-emerald-600",
};

const typeIcon: Record<string, React.ElementType> = {
  EMERGENCY: ShieldAlert, ACADEMIC: Info,
  EVENT: CalendarDays, MAINTENANCE: Wrench, GENERAL: Bell,
};

export default function StudentAlertsPage() {
  const [alerts, setAlerts]   = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchActiveAlerts();
    if (res.success) setAlerts(res.data as Alert[]);
    else setError("Unable to load alerts.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = {
    ALL: alerts.length,
    HIGH:   alerts.filter(a => String(a.priority ?? "").toUpperCase() === "HIGH").length,
    MEDIUM: alerts.filter(a => String(a.priority ?? "").toUpperCase() === "MEDIUM").length,
    LOW:    alerts.filter(a => String(a.priority ?? "").toUpperCase() === "LOW").length,
  };

  const filtered = filter === "ALL" ? alerts : alerts.filter(a => String(a.priority ?? "").toUpperCase() === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campus Alerts</h1>
        <p className="text-xs text-gray-500 mt-1">Important announcements from campus administration</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["ALL","HIGH","MEDIUM","LOW"] as const).map(p => (
          <button key={p} onClick={() => setFilter(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === p ? "bg-blue-500 text-white shadow-sm shadow-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}>
            {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
            <span className={`ml-1.5 text-[10px] font-bold ${filter === p ? "text-blue-100" : "text-gray-400"}`}>{counts[p]}</span>
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
        <div className="space-y-3">
          {filtered.map(alert => {
            const id       = alert.id ?? alert._id ?? "";
            const rawPri   = String(alert.priority ?? "MEDIUM").toUpperCase();
            const rawType  = String(alert.alertType ?? "GENERAL").toUpperCase();
            const Icon     = typeIcon[rawType] ?? Bell;
            const priStyle = priorityStyle[rawPri] ?? "bg-gray-50 text-gray-500";
            return (
              <div key={id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${priStyle}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-800">{alert.title}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priStyle}`}>
                        {rawPri.charAt(0) + rawPri.slice(1).toLowerCase()}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {rawType.charAt(0) + rawType.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {alert.message && <p className="text-xs text-gray-500 mt-1">{alert.message}</p>}
                  {alert.date && (
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <CalendarDays size={11} />
                      {new Date(alert.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
          <p className="text-sm font-semibold text-gray-700">No active alerts</p>
          <p className="text-xs text-gray-400">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}

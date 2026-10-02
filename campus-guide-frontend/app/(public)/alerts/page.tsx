import { Bell, ShieldAlert, Info, Wrench, CalendarDays } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";

async function getAlerts() {
  try {
    const res = await fetch(`${BACKEND}/api/alerts/active`, { cache: "no-store" });
    if (!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  } catch { return []; }
}

const priorityStyle: Record<string, string> = {
  HIGH:   "bg-red-50 text-red-600 border-red-100",
  MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
  LOW:    "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const typeIcon: Record<string, React.ElementType> = {
  EMERGENCY: ShieldAlert, ACADEMIC: Info, EVENT: CalendarDays, MAINTENANCE: Wrench, GENERAL: Bell,
};

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <section className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Alerts</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">Campus Alerts</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Important announcements and notices from campus administration.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        {alerts.length > 0 ? alerts.map((a: any) => {
          const id      = a.id ?? a._id ?? "";
          const rawPri  = String(a.priority ?? "MEDIUM").toUpperCase();
          const rawType = String(a.alertType ?? "GENERAL").toUpperCase();
          const Icon    = typeIcon[rawType] ?? Bell;
          const style   = priorityStyle[rawPri] ?? priorityStyle.MEDIUM;
          return (
            <div key={id} className={`rounded-2xl border p-5 flex items-start gap-4 ${style}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-sm">{a.title}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style}`}>{rawPri.charAt(0) + rawPri.slice(1).toLowerCase()}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-current">{rawType.charAt(0) + rawType.slice(1).toLowerCase()}</span>
                  </div>
                </div>
                {a.message && <p className="text-sm mt-1 opacity-80">{a.message}</p>}
                {a.date && <p className="text-[11px] opacity-60 mt-1.5">{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Bell size={36} className="text-amber-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No active alerts</p>
            <p className="text-sm text-gray-400">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

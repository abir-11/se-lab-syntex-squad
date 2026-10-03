"use client";

import { useEffect, useState, useCallback } from "react";
import { Banknote, Loader2, X, CheckCircle, Clock, RefreshCcw, DollarSign } from "lucide-react";
import { fetchMyPayoutsAction } from "@/app/(dashboard)/_actions/paymentActions";

const statusStyle: Record<string, { bg: string; label: string }> = {
  PENDING:    { bg: "bg-amber-50 text-amber-600",  label: "Pending"    },
  PROCESSING: { bg: "bg-blue-50 text-blue-600",    label: "Processing" },
  PAID:       { bg: "bg-emerald-50 text-emerald-600", label: "Paid"   },
  FAILED:     { bg: "bg-red-50 text-red-500",      label: "Failed"    },
};

const statusIcon: Record<string, React.ElementType> = {
  PENDING:    Clock,
  PROCESSING: RefreshCcw,
  PAID:       CheckCircle,
  FAILED:     X,
};

export default function MentorPayoutsPage() {
  const [payouts,  setPayouts]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchMyPayoutsAction();
    if (res.success) setPayouts(res.data as any[]);
    else setError("Unable to load payouts.");
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const total     = payouts.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const paid      = payouts.filter(p => String(p.status).toUpperCase() === "PAID").reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const pending   = payouts.filter(p => ["PENDING","PROCESSING"].includes(String(p.status).toUpperCase())).reduce((s, p) => s + Number(p.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Payouts</h1>
        <p className="text-xs text-gray-500 mt-1">Track your earnings from completed sessions</p>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Earned",    amount: total,   color: "text-emerald-600", bg: "bg-emerald-50"  },
            { label: "Paid Out",        amount: paid,    color: "text-blue-600",    bg: "bg-blue-50"     },
            { label: "Pending/Processing", amount: pending, color: "text-amber-600", bg: "bg-amber-50"  },
          ].map(({ label, amount, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">{label}</p>
                <p className={`text-xl font-bold mt-0.5 ${color}`}>৳{amount.toFixed(2)}</p>
              </div>
            </div>
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
      ) : payouts.length > 0 ? (
        <div className="space-y-3">
          {payouts.map((po: any) => {
            const id       = po.id ?? po._id ?? "";
            const raw      = String(po.status ?? "PENDING").toUpperCase();
            const cfg      = statusStyle[raw] ?? statusStyle.PENDING;
            const Icon     = statusIcon[raw] ?? Clock;
            const service  = po.booking?.service;
            const student  = po.booking?.student;

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Banknote size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-gray-800">
                      {service?.name ?? service?.category ?? "Session Payout"}
                    </p>
                    {student?.name && (
                      <p className="text-xs text-gray-500">Student: {student.name}</p>
                    )}
                    <p className="text-[11px] text-gray-400 font-mono">
                      Payment #{po.paymentId?.slice(0,8).toUpperCase()}
                    </p>
                    {po.releasedAt && (
                      <p className="text-[11px] text-gray-400">
                        Released: {new Date(po.releasedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <p className="text-xl font-bold text-emerald-600">৳{Number(po.amount).toFixed(2)}</p>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.bg}`}>
                    <Icon size={12} /> {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Banknote size={32} className="text-emerald-300" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No payouts yet</p>
          <p className="text-xs text-gray-400">
            Complete sessions with students to receive payouts.
          </p>
        </div>
      )}
    </div>
  );
}

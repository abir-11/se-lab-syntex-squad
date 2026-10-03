"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard, Loader2, X, CheckCircle, RefreshCcw,
  DollarSign, Clock, XCircle, Banknote, ArrowUpRight,
} from "lucide-react";
import {
  fetchAllPaymentsAction,
  fetchPaymentStatsAction,
  releasePaymentAction,
  refundPaymentAction,
  fetchAllPayoutsAction,
  processPayoutAction,
  markPayoutPaidAction,
} from "@/app/(dashboard)/_actions/paymentActions";
import { swConfirm, swToast, swErrorToast } from "@/lib/swal";

// ── Status styles ──────────────────────────────────────────────────────────────
const payStyle: Record<string, string> = {
  PENDING:  "bg-amber-50 text-amber-600",
  PAID:     "bg-blue-50 text-blue-600",
  HELD:     "bg-indigo-50 text-indigo-600",
  RELEASED: "bg-emerald-50 text-emerald-600",
  REFUNDED: "bg-gray-100 text-gray-500",
  FAILED:   "bg-red-50 text-red-500",
};

const payoutStyle: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-600",
  PROCESSING: "bg-blue-50 text-blue-600",
  PAID:       "bg-emerald-50 text-emerald-600",
  FAILED:     "bg-red-50 text-red-500",
};

type Tab = "payments" | "payouts";
type PaymentFilter = "ALL" | "PENDING" | "HELD" | "RELEASED" | "REFUNDED" | "FAILED";

export default function AdminPaymentsPage() {
  const [tab,         setTab]         = useState<Tab>("payments");
  const [payments,    setPayments]    = useState<any[]>([]);
  const [payouts,     setPayouts]     = useState<any[]>([]);
  const [stats,       setStats]       = useState<any>(null);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<PaymentFilter>("ALL");
  const [actionId,    setActionId]    = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true); setError(null);
    const [pRes, poRes, sRes] = await Promise.all([
      fetchAllPaymentsAction(),
      fetchAllPayoutsAction(),
      fetchPaymentStatsAction(),
    ]);
    if (pRes.success)  setPayments(pRes.data as any[]);
    if (poRes.success) setPayouts(poRes.data  as any[]);
    if (sRes.success)  setStats(sRes.data);
    if (!pRes.success) setError("Unable to load payments.");
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleRelease = async (id: string) => {
    const ok = await swConfirm("Release payment?", "This will release payment to the mentor.", "Release");
    if (!ok) return;
    setActionId(id);
    const r = await releasePaymentAction(id);
    if (r.success) { swToast("Payment released"); loadAll(); }
    else swErrorToast(r.message ?? "Failed");
    setActionId(null);
  };

  const handleRefund = async (id: string) => {
    const ok = await swConfirm("Refund payment?", "This will refund the payment to the student.", "Refund");
    if (!ok) return;
    setActionId(id);
    const r = await refundPaymentAction(id);
    if (r.success) { swToast("Payment refunded"); loadAll(); }
    else swErrorToast(r.message ?? "Failed");
    setActionId(null);
  };

  const handleProcessPayout = async (id: string) => {
    setActionId(id);
    const r = await processPayoutAction(id);
    if (r.success) { swToast("Payout processing"); loadAll(); }
    else swErrorToast(r.message ?? "Failed");
    setActionId(null);
  };

  const handleMarkPaid = async (id: string) => {
    setActionId(id);
    const r = await markPayoutPaidAction(id);
    if (r.success) { swToast("Payout marked as paid"); loadAll(); }
    else swErrorToast(r.message ?? "Failed");
    setActionId(null);
  };

  const filteredPayments = filter === "ALL"
    ? payments
    : payments.filter(p => String(p.status).toUpperCase() === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-xs text-gray-500 mt-1">Monitor and manage all financial transactions</p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total",     value: stats.totalPayments,    icon: CreditCard,  bg: "bg-blue-50",    color: "text-blue-500"    },
            { label: "Held",      value: stats.heldPayments,     icon: Clock,       bg: "bg-indigo-50",  color: "text-indigo-500"  },
            { label: "Released",  value: stats.releasedPayments, icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-500" },
            { label: "Pending",   value: stats.pendingPayments,  icon: RefreshCcw,  bg: "bg-amber-50",   color: "text-amber-500"   },
            { label: "Refunded",  value: stats.refundedPayments, icon: ArrowUpRight,bg: "bg-gray-50",    color: "text-gray-500"    },
            { label: "Failed",    value: stats.failedPayments,   icon: XCircle,     bg: "bg-red-50",     color: "text-red-500"     },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                <Icon size={15} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{value}</h3>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Amount summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Volume",   amount: stats.totalAmount,    color: "text-blue-600"    },
            { label: "Currently Held", amount: stats.heldAmount,     color: "text-indigo-600"  },
            { label: "Released",       amount: stats.releasedAmount, color: "text-emerald-600" },
          ].map(({ label, amount, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>৳{Number(amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(["payments","payouts"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              tab === t ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} />{error}<button onClick={loadAll} className="ml-auto underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={28} /></div>
      ) : tab === "payments" ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(["ALL","PENDING","HELD","RELEASED","REFUNDED","FAILED"] as PaymentFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === f ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                }`}>
                {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                <span className={`ml-1 text-[10px] font-bold ${filter === f ? "text-orange-100" : "text-gray-400"}`}>
                  {f === "ALL" ? payments.length : payments.filter(p => String(p.status).toUpperCase() === f).length}
                </span>
              </button>
            ))}
          </div>

          {/* Payments table */}
          {filteredPayments.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50/60 border-b border-gray-100">
                    <tr>
                      {["Booking","Student","Mentor","Amount","Platform Fee","Mentor Gets","Status","Transaction","Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPayments.map((p: any) => {
                      const raw = String(p.status ?? "PENDING").toUpperCase();
                      const isActing = actionId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-gray-400">{p.bookingId?.slice(0,8)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-700">{p.student?.name ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600">{p.mentor?.name ?? "—"}</td>
                          <td className="px-4 py-3 font-bold text-gray-800">৳{Number(p.amount).toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-500">৳{Number(p.platformFee).toFixed(2)}</td>
                          <td className="px-4 py-3 text-emerald-600 font-semibold">৳{Number(p.mentorAmount).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full font-semibold ${payStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                              {raw.charAt(0) + raw.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-400">{p.transactionId ?? "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              {raw === "HELD" && (
                                <>
                                  <button onClick={() => handleRelease(p.id)} disabled={isActing}
                                    className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-40 flex items-center gap-1">
                                    {isActing ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={10} />} Release
                                  </button>
                                  <button onClick={() => handleRefund(p.id)} disabled={isActing}
                                    className="px-2.5 py-1 border border-red-200 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-50 transition-all disabled:opacity-40">
                                    Refund
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <CreditCard size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">No payments found</p>
            </div>
          )}
        </>
      ) : (
        /* Payouts tab */
        payouts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50/60 border-b border-gray-100">
                  <tr>
                    {["Booking","Mentor","Amount","Status","Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payouts.map((po: any) => {
                    const raw = String(po.status ?? "PENDING").toUpperCase();
                    const isActing = actionId === po.id;
                    return (
                      <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-400">{po.bookingId?.slice(0,8)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">{po.mentor?.name ?? "—"}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600">৳{Number(po.amount).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full font-semibold ${payoutStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                            {raw.charAt(0) + raw.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {raw === "PENDING" && (
                              <button onClick={() => handleProcessPayout(po.id)} disabled={isActing}
                                className="px-2.5 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-all disabled:opacity-40 flex items-center gap-1">
                                {isActing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCcw size={10} />} Process
                              </button>
                            )}
                            {raw === "PROCESSING" && (
                              <button onClick={() => handleMarkPaid(po.id)} disabled={isActing}
                                className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-40 flex items-center gap-1">
                                {isActing ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={10} />} Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Banknote size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No payouts yet</p>
          </div>
        )
      )}
    </div>
  );
}

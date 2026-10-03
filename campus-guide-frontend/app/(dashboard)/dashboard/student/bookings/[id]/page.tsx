"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Calendar, Clock, User, Layers,
  CheckCircle, XCircle, AlertCircle, DollarSign, Activity,
  CreditCard, Banknote, X,
} from "lucide-react";
import { fetchBookingByIdAction, updateBookingAction, cancelBookingAction } from "@/app/(dashboard)/_actions/bookingActions";
import { confirmPaymentAction } from "@/app/(dashboard)/_actions/paymentActions";
import { swConfirm, swConfirmDelete, swToast, swErrorToast } from "@/lib/swal";

// ── Status helpers ─────────────────────────────────────────────────────────────
const bookingStatusStyle: Record<string, string> = {
  PENDING:     "bg-amber-50 text-amber-600 border-amber-200",
  ACCEPTED:    "bg-blue-50 text-blue-600 border-blue-200",
  CONFIRMED:   "bg-indigo-50 text-indigo-600 border-indigo-200",
  IN_PROGRESS: "bg-purple-50 text-purple-600 border-purple-200",
  COMPLETED:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  REJECTED:    "bg-red-50 text-red-500 border-red-200",
  CANCELLED:   "bg-gray-100 text-gray-500 border-gray-200",
};

const paymentStatusStyle: Record<string, string> = {
  PENDING:  "bg-amber-50 text-amber-600",
  PAID:     "bg-blue-50 text-blue-600",
  HELD:     "bg-indigo-50 text-indigo-600",
  RELEASED: "bg-emerald-50 text-emerald-600",
  REFUNDED: "bg-gray-100 text-gray-500",
  FAILED:   "bg-red-50 text-red-500",
};

// ── Timeline ──────────────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  { key: "PENDING",     label: "Booking Requested" },
  { key: "ACCEPTED",    label: "Mentor Accepted" },
  { key: "CONFIRMED",   label: "You Confirmed" },
  { key: "IN_PROGRESS", label: "Session In Progress" },
  { key: "COMPLETED",   label: "Completed" },
];

const STATUS_ORDER = ["PENDING","ACCEPTED","CONFIRMED","IN_PROGRESS","COMPLETED"];

function TimelineStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
        done   ? "bg-emerald-500 border-emerald-500"  :
        active ? "bg-orange-500 border-orange-500"    :
                 "bg-white border-gray-300"
      }`}>
        {done   && <CheckCircle size={14} className="text-white" />}
        {active && <Activity    size={11} className="text-white" />}
      </div>
      <span className={`text-xs font-semibold ${done ? "text-emerald-600" : active ? "text-orange-600" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [booking,    setBooking]    = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [actionId,   setActionId]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [txnId,      setTxnId]      = useState("");
  const [showPayForm, setShowPayForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const res = await fetchBookingByIdAction(id);
    if (res.success) setBooking(res.data);
    else setError(res.message ?? "Unable to load booking");
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (action: string, label: string, confirmMsg?: string) => {
    if (confirmMsg) {
      const ok = await swConfirm(label, confirmMsg, label);
      if (!ok) return;
    }
    setActionId(action);
    const res = await updateBookingAction(id, action);
    if (res.success) { swToast(`${label} successful`); load(); }
    else swErrorToast(res.message ?? "Failed");
    setActionId(null);
  };

  const doCancel = async () => {
    const ok = await swConfirmDelete("Cancel this booking?", "This booking will be cancelled.");
    if (!ok) return;
    setActionId("cancel");
    const res = await cancelBookingAction(id);
    if (res.success) { swToast("Booking cancelled"); router.push("/dashboard/student/bookings"); }
    else swErrorToast(res.message ?? "Failed");
    setActionId(null);
  };

  const doConfirmPayment = async () => {
    if (!txnId.trim()) { swErrorToast("Enter a transaction ID"); return; }
    const payment = booking?.payment;
    if (!payment) { swErrorToast("Payment record not found"); return; }
    setActionId("pay");
    const res = await confirmPaymentAction(payment.id, txnId.trim());
    if (res.success) { swToast("Payment confirmed!"); setShowPayForm(false); load(); }
    else swErrorToast(res.message ?? "Payment failed");
    setActionId(null);
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
  );

  if (error || !booking) return (
    <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-3">
      <XCircle size={20} />{error ?? "Booking not found"}
      <Link href="/dashboard/student/bookings" className="ml-auto text-xs underline">Back</Link>
    </div>
  );

  const rawStatus   = String(booking.status        ?? "PENDING").toUpperCase();
  const rawPayStatus = String(booking.paymentStatus ?? "PENDING").toUpperCase();
  const statusIdx   = STATUS_ORDER.indexOf(rawStatus);
  const isMine      = true; // server-side confirmed
  const payment     = booking.payment;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link href="/dashboard/student/bookings"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Bookings
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 font-mono">#{booking.id?.slice(0,8).toUpperCase()}</p>
          <h1 className="text-lg font-bold text-gray-900 mt-1">
            {booking.service?.name ?? booking.service?.category ?? "Booking"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            with <span className="font-semibold">{booking.mentor?.name ?? "Mentor"}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${bookingStatusStyle[rawStatus] ?? "bg-gray-100 text-gray-500"}`}>
            {rawStatus.replace("_"," ")}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${paymentStatusStyle[rawPayStatus] ?? "bg-gray-100 text-gray-500"}`}>
            Payment: {rawPayStatus}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: User,      label: "Mentor",   value: booking.mentor?.name  ?? "—" },
          { icon: Layers,    label: "Service",  value: booking.service?.name ?? booking.service?.category ?? "—" },
          { icon: Calendar,  label: "Date",     value: booking.date ? new Date(booking.date).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}) : "—" },
          { icon: Clock,     label: "Time",     value: booking.time ?? "—" },
          { icon: DollarSign,label: "Amount",   value: `৳${Number(booking.amount ?? 0).toFixed(2)}` },
          { icon: CreditCard,label: "Category", value: booking.service?.category ?? "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Notes</p>
          <p className="text-sm text-gray-600 italic">&ldquo;{booking.notes}&rdquo;</p>
        </div>
      )}

      {/* Timeline */}
      {!["REJECTED","CANCELLED"].includes(rawStatus) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-bold text-gray-900 mb-5">Booking Timeline</p>
          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, i) => (
              <TimelineStep
                key={step.key}
                label={step.label}
                done={statusIdx > i}
                active={statusIdx === i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Payment info */}
      {payment && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><Banknote size={16} />Payment Details</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ["Amount",       `৳${Number(payment.amount).toFixed(2)}`],
              ["Platform Fee", `৳${Number(payment.platformFee).toFixed(2)}`],
              ["Mentor Gets",  `৳${Number(payment.mentorAmount).toFixed(2)}`],
              ["Status",       payment.status],
              ["Provider",     payment.provider ?? "manual"],
              ["Transaction",  payment.transactionId ?? "—"],
            ].map(([k,v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">{k}</p>
                <p className="font-semibold text-gray-800 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <p className="text-sm font-bold text-gray-900">Actions</p>

        {/* Confirm booking (after mentor accepts) */}
        {rawStatus === "ACCEPTED" && rawPayStatus !== "HELD" && (
          <button onClick={() => doAction("confirm", "Confirm Booking", "Confirm this session with the mentor?")}
            disabled={!!actionId}
            className="flex items-center gap-2 w-full sm:w-auto bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 active:scale-[0.98]">
            {actionId === "confirm" ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            Confirm Booking
          </button>
        )}

        {/* Pay (simulate payment confirm) */}
        {rawStatus === "ACCEPTED" && rawPayStatus === "PENDING" && !showPayForm && (
          <button onClick={() => setShowPayForm(true)}
            className="flex items-center gap-2 w-full sm:w-auto bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all active:scale-[0.98]">
            <CreditCard size={15} /> Pay Now
          </button>
        )}

        {showPayForm && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-amber-800">Enter Payment Reference</p>
            <p className="text-xs text-amber-700">
              Complete your payment via bKash/Nagad/bank transfer and enter the transaction ID below.
              <br />In production this will integrate with a real payment gateway.
            </p>
            <input value={txnId} onChange={e => setTxnId(e.target.value)}
              placeholder="e.g. TXN123456789"
              className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white" />
            <div className="flex gap-2">
              <button onClick={doConfirmPayment} disabled={!!actionId}
                className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50">
                {actionId === "pay" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                Confirm Payment
              </button>
              <button onClick={() => setShowPayForm(false)} className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Student confirms completion */}
        {rawStatus === "CONFIRMED" && rawPayStatus === "HELD" && (
          <button onClick={() => doAction("student_complete", "Mark Completed", "Confirm the session is complete? This will release payment to the mentor.")}
            disabled={!!actionId}
            className="flex items-center gap-2 w-full sm:w-auto bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 active:scale-[0.98]">
            {actionId === "student_complete" ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            Mark as Completed & Release Payment
          </button>
        )}

        {/* Cancel (PENDING only) */}
        {rawStatus === "PENDING" && (
          <button onClick={doCancel} disabled={!!actionId}
            className="flex items-center gap-2 w-full sm:w-auto border border-red-200 text-red-500 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50">
            {actionId === "cancel" ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
            Cancel Booking
          </button>
        )}

        {["COMPLETED","REJECTED","CANCELLED"].includes(rawStatus) && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertCircle size={13} /> No further actions available for this booking.
          </p>
        )}
      </div>
    </div>
  );
}

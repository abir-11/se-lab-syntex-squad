"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Loader2, User } from "lucide-react";
import { fetchMentorApplications, updateMentorApprovalStatus } from "../_actions/adminActions";
import { swConfirm, swErrorToast, swToast } from "@/lib/swal";

interface MentorApplicant {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  department?: string;
  status?: "pending" | "approved" | "rejected";
  image?: string;
  avatar?: string;
}

export default function PendingApprovalsCard() {
  const [applicants, setApplicants] = useState<MentorApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMentorApplications();
      if (result?.success && Array.isArray(result.data)) {
        const pending = (result.data as MentorApplicant[]).filter(
          (item) => item.status === "pending" || !item.status
        );
        setApplicants(pending);
      } else {
        setApplicants([]);
      }
    } catch (err) {
      console.error("Error loading applicants:", err);
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (!id) return;

    const label = status === "approved" ? "Approve" : "Reject";
    const confirmed = await swConfirm(
      `${label} this application?`,
      status === "approved"
        ? "This mentor will be approved and can start offering services."
        : "This application will be rejected.",
      label
    );
    if (!confirmed) return;

    setActionLoading(id);
    try {
      const res = await updateMentorApprovalStatus(id, status);
      if (res?.success) {
        setApplicants((prev) => prev.filter((item) => (item._id || item.id) !== id));
        swToast(`Application ${status} successfully`);
      } else {
        swErrorToast(res?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating approval status:", err);
      swErrorToast("An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Pending Mentor Approvals</h2>
        <span className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full font-semibold">
          {applicants.length} pending
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            onClick={() => { setError(null); loadApplicants(); }}
            className="underline font-semibold flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
        </div>
      ) : applicants.length > 0 ? (
        <div className="space-y-3">
          {applicants.map((item) => {
            const id = item._id || item.id || "";
            const isProcessing = actionLoading === id;

            return (
              <div
                key={id}
                className="bg-gray-50/70 p-3.5 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.image || item.avatar ? (
                    <img
                      src={item.image || item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-800">{item.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {item.department || item.email || "Applicant"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAction(id, "approved")}
                    className="p-1.5 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Approve"
                  >
                    {isProcessing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAction(id, "rejected")}
                    className="p-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Reject"
                  >
                    {isProcessing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <X size={14} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-400 py-6 text-center">
          No pending mentor applications.
        </p>
      )}
    </div>
  );
}

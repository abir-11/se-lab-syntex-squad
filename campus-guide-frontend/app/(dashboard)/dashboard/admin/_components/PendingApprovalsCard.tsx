"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Check, X, Loader2, User, ChevronDown, ChevronUp,
  Phone, Building2, Star, BookOpen, Briefcase, ExternalLink,
} from "lucide-react";
import { fetchMentorApplications, updateMentorApprovalStatus } from "../_actions/adminActions";
import { swConfirm, swErrorToast, swToast } from "@/lib/swal";

interface MentorApplicant {
  _id?: string;
  id?: string;
  userId?: string;
  department?: string;
  mobile?: string;
  bio?: string;
  cgpa?: number | string;
  goodSubjects?: string[];
  experience?: string;
  portfolio?: string;
  status?: string;
  createdAt?: string;
  // nested user object from backend
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  // sometimes name/email appear at top level
  name?: string;
  email?: string;
}

export default function PendingApprovalsCard() {
  const [applicants,     setApplicants]     = useState<MentorApplicant[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [actionLoading,  setActionLoading]  = useState<string | null>(null);
  const [expanded,       setExpanded]       = useState<string | null>(null);
  const [error,          setError]          = useState<string | null>(null);

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMentorApplications();
      if (result?.success && Array.isArray(result.data)) {
        const pending = (result.data as MentorApplicant[]).filter((item) => {
          const s = String(item.status ?? "").toUpperCase();
          return s === "PENDING" || s === "";
        });
        setApplicants(pending);
      } else {
        setApplicants([]);
      }
    } catch {
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadApplicants(); }, [loadApplicants]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (!id) return;
    const label = status === "approved" ? "Approve" : "Reject";
    const ok = await swConfirm(
      `${label} this application?`,
      status === "approved"
        ? "This mentor will be approved and can start offering services."
        : "This application will be rejected.",
      label
    );
    if (!ok) return;
    setActionLoading(id);
    try {
    const res = await updateMentorApprovalStatus(id, { status });
      if (res?.success) {
        setApplicants((prev) => prev.filter((item) => (item._id || item.id) !== id));
        setExpanded(null);
        swToast(`Application ${status} successfully`);
      } else {
        swErrorToast(res?.message || "Failed to update status");
      }
    } catch {
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
          <button onClick={() => { setError(null); loadApplicants(); }} className="underline font-semibold">
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
            const id           = item._id || item.id || "";
            const isProcessing = actionLoading === id;
            const isExpanded   = expanded === id;
            const name         = item.user?.name  ?? item.name  ?? "Applicant";
            const email        = item.user?.email ?? item.email ?? "";
            const subjects     = Array.isArray(item.goodSubjects) ? item.goodSubjects : [];

            return (
              <div key={id} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* ── Collapsed row ── */}
                <div
                  className="bg-gray-50/70 p-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{name}</p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {item.department ?? email ?? "Applicant"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Quick approve/reject */}
                    <button disabled={isProcessing} onClick={e => { e.stopPropagation(); handleAction(id, "approved"); }}
                      className="p-1.5 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all disabled:opacity-50"
                      title="Approve">
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    </button>
                    <button disabled={isProcessing} onClick={e => { e.stopPropagation(); handleAction(id, "rejected"); }}
                      className="p-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50"
                      title="Reject">
                      {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                    </button>
                    {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </div>

                {/* ── Expanded details ── */}
                {isExpanded && (
                  <div className="p-4 space-y-4 border-t border-gray-100 bg-white">
                    {/* Basic info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {email && (
                        <div className="flex items-start gap-2">
                          <User size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                            <p className="text-xs text-gray-700">{email}</p>
                          </div>
                        </div>
                      )}
                      {item.department && (
                        <div className="flex items-start gap-2">
                          <Building2 size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Department</p>
                            <p className="text-xs text-gray-700">{item.department}</p>
                          </div>
                        </div>
                      )}
                      {item.mobile && (
                        <div className="flex items-start gap-2">
                          <Phone size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Mobile</p>
                            <p className="text-xs text-gray-700">{item.mobile}</p>
                          </div>
                        </div>
                      )}
                      {item.cgpa != null && (
                        <div className="flex items-start gap-2">
                          <Star size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">CGPA</p>
                            <p className="text-xs text-gray-700">{Number(item.cgpa).toFixed(2)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {item.bio && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                          <Briefcase size={11} /> Bio
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{item.bio}</p>
                      </div>
                    )}

                    {/* Good Subjects */}
                    {subjects.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                          <BookOpen size={11} /> Good Subjects
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {subjects.map((s: string) => (
                            <span key={s} className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {item.experience && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Experience</p>
                        <p className="text-xs text-gray-600">{item.experience}</p>
                      </div>
                    )}

                    {/* Portfolio */}
                    {item.portfolio && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Portfolio</p>
                        <a href={item.portfolio} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:underline flex items-center gap-1">
                          <ExternalLink size={11} /> {item.portfolio}
                        </a>
                      </div>
                    )}

                    {/* Applied date */}
                    {item.createdAt && (
                      <p className="text-[10px] text-gray-400">
                        Applied: {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button disabled={isProcessing} onClick={() => handleAction(id, "approved")}
                        className="flex items-center gap-1.5 flex-1 justify-center bg-emerald-500 text-white text-xs font-semibold py-2 rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 active:scale-[0.98]">
                        {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        Approve
                      </button>
                      <button disabled={isProcessing} onClick={() => handleAction(id, "rejected")}
                        className="flex items-center gap-1.5 flex-1 justify-center border border-red-200 text-red-500 text-xs font-semibold py-2 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 active:scale-[0.98]">
                        {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-400 py-6 text-center">No pending mentor applications.</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase, CheckCircle, Clock, XCircle, Plus, X,
  Loader2, BookOpen, Phone, Building2, FileText,
  Star, GraduationCap, ArrowRight,
} from "lucide-react";
import { applyForMentorAction } from "@/app/(dashboard)/_actions/mentorApplyActions";

interface Auth {
  isLoggedIn: boolean;
  role: string | null;
  userId: string | null;
  application: any | null;
}

const DEPARTMENTS = [
  "CSE", "EEE", "BBA", "English", "Law", "Architecture",
  "Civil Engineering", "Textile Engineering", "Pharmacy", "Accounting", "Other",
];

// ── Shared input class ─────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all";

export default function MentorApplicationSection({ auth }: { auth: Auth }) {
  const [subjects,   setSubjects]   = useState<string[]>([]);
  const [subInput,   setSubInput]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");
  const [form, setForm] = useState({
    department: "CSE",
    mobile:     "",
    bio:        "",
    cgpa:       "",
    experience: "",
    portfolio:  "",
  });

  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const addSubject = () => {
    const s = subInput.trim();
    if (s && !subjects.includes(s)) setSubjects(p => [...p, s]);
    setSubInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSubject(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.mobile.trim())      { setError("Mobile number is required."); return; }
    if (!form.bio.trim())         { setError("Bio is required."); return; }
    if (!form.cgpa)               { setError("CGPA is required."); return; }
    if (subjects.length === 0)    { setError("Please add at least one good subject."); return; }

    const cgpaNum = parseFloat(form.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 4) {
      setError("CGPA must be a number between 0.00 and 4.00."); return;
    }

    setLoading(true);
    try {
      const res = await applyForMentorAction({
        department:   form.department,
        mobile:       form.mobile.trim(),
        bio:          form.bio.trim(),
        cgpa:         cgpaNum,
        goodSubjects: subjects,
        experience:   form.experience.trim() || undefined,
        portfolio:    form.portfolio.trim()  || undefined,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        // Friendly API error messages
        const msg = res.message ?? "Something went wrong";
        if (msg.toLowerCase().includes("already applied") || msg.toLowerCase().includes("already have"))
          setError("You already have a mentor application. Please check the status above.");
        else if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("401"))
          setError("Please log in to submit a mentor application.");
        else if (msg.toLowerCase().includes("student"))
          setError("Only students can apply. If you believe this is an error, please contact support.");
        else
          setError(msg);
      }
    } catch {
      setError("Unable to connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const app       = auth.application;
  const appStatus = app?.status ? String(app.status).toUpperCase() : null;
  const isMentor  = auth.role === "MENTOR";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Briefcase size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Become a Mentor</h2>
        </div>
        <p className="text-orange-100 text-sm max-w-2xl">
          Are you a student with strong academic or technical skills? Apply to become a mentor and help
          other students through personalised guidance and mentoring sessions.
        </p>
      </div>

      <div className="px-6 sm:px-8 py-8">

        {/* ── NOT LOGGED IN ── */}
        {!auth.isLoggedIn && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Want to become a mentor?</h3>
              <p className="text-gray-700 text-sm mt-1">
                Log in with your student account to submit a mentor application. The process is quick and free.
              </p>
            </div>
            <Link
              href="/login?redirect=/contact"
              className="flex items-center gap-2 bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
            >
              Login to Apply <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── ALREADY A MENTOR ── */}
        {auth.isLoggedIn && isMentor && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle size={32} className="text-emerald-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">You are an approved Mentor!</h3>
              <p className="text-gray-700 text-sm mt-1">
                You already have mentor status. Manage your services, bookings, and profile from your mentor dashboard.
              </p>
            </div>
            <Link
              href="/dashboard/mentor"
              className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap"
            >
              Mentor Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── APPLICATION PENDING ── */}
        {auth.isLoggedIn && !isMentor && appStatus === "PENDING" && (
          <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <Clock size={28} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Application Under Review</h3>
              <p className="text-gray-700 text-sm mt-1">
                Your mentor application has been submitted and is currently being reviewed by an administrator.
                You will be notified once a decision is made.
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Status: Pending Review
              </span>
            </div>
          </div>
        )}

        {/* ── APPLICATION APPROVED (but role not yet MENTOR) ── */}
        {auth.isLoggedIn && !isMentor && appStatus === "APPROVED" && (
          <div className="flex items-start gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle size={28} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Congratulations! Application Approved</h3>
              <p className="text-gray-700 text-sm mt-1">
                Your mentor application has been approved. Please log out and log back in to access your Mentor Dashboard with updated permissions.
              </p>
            </div>
          </div>
        )}

        {/* ── APPLICATION REJECTED ── */}
        {auth.isLoggedIn && !isMentor && appStatus === "REJECTED" && !submitted && (
          <div className="mb-6 flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl">
            <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Previous Application Rejected</h3>
              <p className="text-gray-700 text-sm mt-1">
                Your earlier application was not approved. You may update your information and submit a new application below.
              </p>
            </div>
          </div>
        )}

        {/* ── APPLICATION FORM (no app or rejected) ── */}
        {auth.isLoggedIn && !isMentor && appStatus !== "PENDING" && appStatus !== "APPROVED" && !submitted && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {appStatus === "REJECTED" ? "Re-apply as Mentor" : "Mentor Application Form"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Fill in all required fields carefully. Your application will be reviewed by an admin.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl">
                <XCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Department */}
              <div>
                <label htmlFor="dept" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-500" />
                    Department <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  id="dept"
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                  className={inputCls}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Mobile + CGPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-500" />
                      Mobile Number <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={e => set("mobile", e.target.value)}
                    placeholder="01712345678"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cgpa" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-gray-500" />
                      CGPA (0.00 – 4.00) <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={form.cgpa}
                    onChange={e => set("cgpa", e.target.value)}
                    placeholder="e.g. 3.75"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} className="text-gray-500" />
                    Bio <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={e => set("bio", e.target.value)}
                  placeholder="Tell students about yourself, your skills, and your teaching approach…"
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {/* Good Subjects */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-gray-500" />
                    Good Subjects <span className="text-red-500">*</span>
                  </span>
                </label>
                <p className="text-xs text-gray-500 mb-2">Type a subject and press Enter or click + to add it.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subInput}
                    onChange={e => setSubInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Data Structures & Algorithms"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    disabled={!subInput.trim()}
                    className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {subjects.map(s => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => setSubjects(p => p.filter(x => x !== s))}
                          className="text-orange-500 hover:text-orange-700 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {subjects.length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">No subjects added yet.</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Experience{" "}
                  <span className="text-gray-500 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="experience"
                  type="text"
                  value={form.experience}
                  onChange={e => set("experience", e.target.value)}
                  placeholder="e.g. 2 years of tutoring junior students at UIU"
                  className={inputCls}
                />
              </div>

              {/* Portfolio */}
              <div>
                <label htmlFor="portfolio" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-gray-500" />
                    Portfolio / GitHub{" "}
                    <span className="text-gray-500 font-normal text-xs">(optional)</span>
                  </span>
                </label>
                <input
                  id="portfolio"
                  type="url"
                  value={form.portfolio}
                  onChange={e => set("portfolio", e.target.value)}
                  placeholder="https://github.com/your-username"
                  className={inputCls}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Submitting Application…</>
                ) : (
                  <><Briefcase size={16} /> Submit Mentor Application</>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree that your application will be reviewed by the admin team. You will be notified of the outcome.
              </p>
            </form>
          </div>
        )}

        {/* ── SUCCESS STATE ── */}
        {submitted && (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={44} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Application Submitted Successfully!</h3>
              <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
                Your mentor application has been sent to the admin team for review.
                You will be notified once your application is approved or rejected.
              </p>
            </div>
            <span className="inline-block text-xs font-bold text-amber-700 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-200">
              Status: Pending Review
            </span>
          </div>
        )}

      </div>
    </section>
  );
}

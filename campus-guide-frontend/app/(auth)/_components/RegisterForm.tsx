'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, User, Mail, Lock, Phone, Users, Building2, Loader2, Image as ImageIcon } from "lucide-react";
import { registerUserAction } from "../_actions/auth";

interface Department {
  id: string;
  departmentName?: string;
  name?: string;
  status?: string;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://campus-guide-backend.vercel.app";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [departmentId, setDepartmentId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptLoading, setDeptLoading] = useState(true);
  
  const router = useRouter(); // Router ডিক্লেয়ার করা হয়েছে

  useEffect(() => {
    fetch(`${BACKEND}/api/departments`, { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        let list: Department[] = [];
        if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.data?.result)) list = data.data.result;
        else if (Array.isArray(data)) list = data;

        const active = list.filter(d => !d.status || String(d.status).toUpperCase() === "ACTIVE");
        setDepartments(active);
        if (active.length > 0) setDepartmentId(active[0].id);
      })
      .catch(() => {})
      .finally(() => setDeptLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!phoneNumber.trim()) { setError("Phone number is required."); return; }
    if (!departmentId) { setError("Please select a department."); return; }

    setLoading(true);
    try {
      const res = await registerUserAction({
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        departmentId,
        gender,
        profilePhoto: profilePhoto.trim() || "https://example.com/profile.jpg",
      });

      if (res?.success) {
        if (res.redirectUrl) {
          // রেজিস্টার এবং অটো-লগিন সাকসেসফুল হলে ড্যাশবোর্ডে পাঠাবে
          router.push(res.redirectUrl);
        } else {
          // কোনো কারণে অটো-লগিন ফেইল করলে Success স্ক্রিন দেখাবে
          setDone(true);
        }
      } else {
        setError(res?.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ... (বাকি UI / form আগের মতই থাকবে, শুধুমাত্র form return-এর অংশটুকু নিচে দিলাম)
  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Account Created!</h1>
        <p className="text-[#6B7280] text-sm">Welcome to UIU Campus Guide. You can now log in.</p>
        <Link href="/login" className="block w-full bg-[#F97316] text-white py-3 rounded-xl font-bold">
          Go to Login
        </Link>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all placeholder:text-[#9CA3AF]";
  const labelClass = "block text-sm font-semibold text-[#374151] mb-1.5";

  // Form HTML আগের মতই... 
  // (আপনার উপরের কোডের <form> থেকে শেষ পর্যন্ত হুবুহু বসিয়ে দিন)
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-1">Create your account</h1>
      <p className="text-[#6B7280] text-sm mb-7">Join UIU Campus Guide — free for all UIU students</p>
      
      {/*... ফর্মের বাকি সব input fields আপনার অরিজিনাল কোডের মতই থাকবে ...*/}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-gray-400" /> Full Name <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            placeholder="Md. Arafat Alam"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" /> Email Address <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-gray-400" /> Password <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              className={`${inputClass} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" /> Phone Number <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="tel"
            placeholder="01712345678"
            value={phoneNumber}
            onChange={e => { setPhoneNumber(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>

        {/* Gender + Department */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" /> Gender <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")}
              className={inputClass}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Building2 size={14} className="text-gray-400" /> Department <span className="text-red-500">*</span>
              </span>
            </label>
            {deptLoading ? (
              <div className={`${inputClass} flex items-center gap-2 text-gray-400`}>
                <Loader2 size={14} className="animate-spin" /> Loading…
              </div>
            ) : departments.length === 0 ? (
              <div className={`${inputClass} text-gray-400 text-xs`}>
                No departments available
              </div>
            ) : (
              <select
                value={departmentId}
                onChange={e => { setDepartmentId(e.target.value); setError(""); }}
                className={inputClass}
                required
              >
                <option value="">— Select department —</option>
                {departments.map(d => {
                    const label = (d.departmentName ?? d.name ?? d.id)
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c: string) => c.toUpperCase());
                    return (
                      <option key={d.id} value={d.id}>{label}</option>
                    );
                  })}
              </select>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        <div>
          <label className={`${labelClass} text-[#6B7280]`}>
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-gray-400" /> Profile Photo URL{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </span>
          </label>
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={profilePhoto}
            onChange={e => setProfilePhoto(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || deptLoading}
          className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating Account…" : "Create Account"}
        </button>

        <p className="text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F97316] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
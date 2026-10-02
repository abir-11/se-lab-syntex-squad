'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { loginUserAction } from "../_actions/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUserAction({ email: email.trim(), password });

     if (res?.success && res.redirectUrl) {
  window.location.href = res.redirectUrl; 
} else {
        setError(res?.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all placeholder:text-[#9CA3AF]";

  return (
    <>
      <h1 className="text-2xl font-bold text-[#1F2937] mb-1">Welcome back</h1>
      <p className="text-[#6B7280] text-sm mb-8">Sign in to your UIU Campus Guide account</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              Email address <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            className={inputClass}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1.5">
            <span className="flex items-center gap-1.5">
              <Lock size={14} className="text-gray-400" />
              Password <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              className={`${inputClass} pr-10`}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#F97316] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </>
  );
}
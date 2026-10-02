"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction } from "../_actions/loginAction";
import { useRouter } from "next/dist/client/components/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await loginAction(
        {
          success: false,
          message: "",
        },
        formData
      );

      if (response.success) {
        toast.success(response.message);
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold tracking-tight text-white"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-400 mt-2 text-sm"
        >
          Sign in to book mentors and explore your campus.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#F68B1F]/70" />
            </div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 focus:border-[#F68B1F] transition-all"
            />
          </div>
          {errors.email && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.email.message as string}
            </span>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#F68B1F]/70" />
            </div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 focus:border-[#F68B1F] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#F68B1F] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.password.message as string}
            </span>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 mt-6 border border-transparent rounded-xl shadow-[0_0_15px_rgba(246,139,31,0.25)] text-sm font-bold text-white bg-[#F68B1F] hover:bg-[#d97414] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F68B1F] focus:ring-offset-[#1a1206] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </motion.div>
      </form>

      {/* Sign Up Link */}
      <motion.div
        variants={itemVariants}
        className="mt-6 text-center text-sm text-gray-400"
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#F68B1F] hover:text-[#ff9d38] transition-colors"
        >
          Sign up
        </Link>
      </motion.div>
    </motion.div>
  );
}

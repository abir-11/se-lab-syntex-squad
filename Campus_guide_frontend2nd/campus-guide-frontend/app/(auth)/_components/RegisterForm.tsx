"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { registerAction } from "../_actions/registerAction";

type Department = {
  id: string;
  departmentName: string;
};

export default function RegisterForm({ departments }: { departments: Department[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRole = watch("role") || "STUDENT";

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      formData.append("role", data.role || "STUDENT");
      if (data.gender) formData.append("gender", data.gender);
      if (data.departmentId) formData.append("departmentId", data.departmentId);

      const response = await registerAction(
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 focus:border-[#F68B1F] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.08 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Create Account
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Join Campus Guide as a student or mentor.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#F68B1F]/70" />
            </div>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>
          {errors.name && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.name.message as string}
            </span>
          )}
        </motion.div>

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
              className={inputClass}
            />
          </div>
          {errors.email && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.email.message as string}
            </span>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-[#F68B1F]/70" />
            </div>
            <input
              {...register("phoneNumber")}
              placeholder="+880 1XXXXXXXXX"
              className={inputClass}
            />
          </div>
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
              className={inputClass}
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

        {/* Role */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Register as
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["STUDENT", "MENTOR"].map((role) => (
              <label
                key={role}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-all ${
                  selectedRole === role
                    ? "border-[#F68B1F] bg-[#F68B1F]/10 text-[#F68B1F]"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  value={role}
                  {...register("role")}
                  className="hidden"
                />
                {role === "STUDENT" ? "Student" : "Mentor"}
              </label>
            ))}
          </div>
        </motion.div>

        {/* Gender + Department */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Gender <span className="text-gray-500">(optional)</span>
            </label>
            <select
              {...register("gender")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 transition-all"
              defaultValue=""
            >
              <option value="" className="bg-gray-900">Select</option>
              <option value="MALE" className="bg-gray-900">Male</option>
              <option value="FEMALE" className="bg-gray-900">Female</option>
              <option value="OTHER" className="bg-gray-900">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Department <span className="text-gray-500">(optional)</span>
            </label>
            <select
              {...register("departmentId")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 transition-all"
              defaultValue=""
            >
              <option value="" className="bg-gray-900">Select</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-gray-900">
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-[0_0_15px_rgba(246,139,31,0.25)] text-sm font-bold text-white bg-[#F68B1F] hover:bg-[#d97414] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F68B1F] focus:ring-offset-[#1a1206] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </motion.div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#F68B1F] hover:text-[#ff9d38] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { Loader2, CalendarDays, Clock, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createBookingAction } from "@/service/bookingActions";

export default function BookingForm({
  serviceId,
  fee,
  isStudent,
  isLoggedIn,
}: {
  serviceId: string;
  fee: string;
  isStudent: boolean;
  isLoggedIn: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error("Please pick a date and time for your session.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createBookingAction({
        serviceId,
        date,
        time,
        notes: notes || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        setDate("");
        setTime("");
        setNotes("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm">
          Log in as a student to book this session.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 px-6 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm transition-colors"
        >
          Log In to Book
        </Link>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm">
          Only student accounts can book mentor sessions.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold text-white">Book This Session</h3>
        <span className="text-xl font-extrabold text-[#F68B1F]">
          ৳{Number(fee).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Date
          </label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F68B1F]/70" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F68B1F]/70" />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 4:00 PM"
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
          Notes <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything the mentor should know before the session..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F68B1F]/50 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F68B1F] hover:bg-[#d97414] text-white font-bold text-sm shadow-[0_0_15px_rgba(246,139,31,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Booking...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Request Booking
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center">
        The mentor reviews your request. You confirm once they accept.
      </p>
    </motion.form>
  );
}

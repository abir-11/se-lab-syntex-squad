import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { getMe } from "@/service/getMe";
import { getMyBookingsAction } from "@/service/bookingActions";

export const dynamic = "force-dynamic";

export default async function StudentOverviewPage() {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  const bookingsRes = await getMyBookingsAction();
  const myBookings = (bookingsRes?.data || []).filter(
    (b: any) => b.student?.id === currentUser.id
  );

  const pending = myBookings.filter((b: any) => b.status === "PENDING").length;
  const accepted = myBookings.filter((b: any) => b.status === "ACCEPTED").length;
  const confirmed = myBookings.filter((b: any) => b.status === "CONFIRMED").length;
  const rejected = myBookings.filter((b: any) => b.status === "REJECTED").length;

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Welcome back, {currentUser.name?.split(" ")[0]}!
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Track your mentor session bookings.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        {[
          { label: "Pending Requests", value: pending, icon: Clock, color: "bg-yellow-400/10 text-yellow-500" },
          { label: "Accepted (confirm now)", value: accepted, icon: CalendarCheck, color: "bg-blue-400/10 text-blue-500" },
          { label: "Confirmed Sessions", value: confirmed, icon: CheckCircle2, color: "bg-emerald-400/10 text-emerald-500" },
          { label: "Rejected", value: rejected, icon: XCircle, color: "bg-red-400/10 text-red-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-4">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        <Link
          href="/dashboard/student/bookings"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all"
        >
          <h3 className="font-bold text-gray-900 group-hover:text-[#F68B1F] transition-colors flex items-center gap-2">
            My Bookings
            <ArrowRight className="w-4 h-4" />
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Confirm accepted sessions or cancel pending requests.
          </p>
        </Link>
        <Link
          href="/services"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all"
        >
          <h3 className="font-bold text-gray-900 group-hover:text-[#F68B1F] transition-colors flex items-center gap-2">
            Find a Mentor
            <ArrowRight className="w-4 h-4" />
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Browse approved mentor services and book a session.
          </p>
        </Link>
      </div>
    </div>
  );
}

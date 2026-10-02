import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, CalendarCheck, ArrowRight, Clock } from "lucide-react";
import { getMe } from "@/service/getMe";
import { getMyBookingsAction } from "@/service/bookingActions";
import { getAllMentorServices } from "@/service/getAllMentorServices";

export const dynamic = "force-dynamic";

export default async function MentorOverviewPage() {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  const [bookingsRes, servicesRes] = await Promise.all([
    getMyBookingsAction(),
    getAllMentorServices({ limit: 100 }),
  ]);

  // Service.mentorId is the mentor's user id
  const myServices = (servicesRes?.data || []).filter(
    (s) => s.mentor?.id === currentUser.id
  );

  const myBookings = (bookingsRes?.data || []).filter(
    (b: any) => b.mentor?.id === currentUser.id
  );

  const pending = myBookings.filter((b: any) => b.status === "PENDING").length;
  const accepted = myBookings.filter((b: any) => b.status === "ACCEPTED").length;
  const confirmed = myBookings.filter((b: any) => b.status === "CONFIRMED").length;

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Welcome back, {currentUser.name?.split(" ")[0]}!
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Here&apos;s what&apos;s happening with your mentor sessions.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-11 h-11 rounded-xl bg-[#F68B1F]/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#F68B1F]" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-4">
            {myServices.length}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Active Services
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-11 h-11 rounded-xl bg-yellow-400/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-4">{pending}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Pending Requests
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-11 h-11 rounded-xl bg-blue-400/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-4">{accepted}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Accepted (awaiting confirm)
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-4">
            {confirmed}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Confirmed Sessions
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        <Link
          href="/dashboard/mentor/bookings"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all"
        >
          <h3 className="font-bold text-gray-900 group-hover:text-[#F68B1F] transition-colors flex items-center gap-2">
            Manage Bookings
            <ArrowRight className="w-4 h-4" />
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Accept or reject student session requests.
          </p>
        </Link>
        <Link
          href="/dashboard/mentor/my-services"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F68B1F]/50 hover:shadow-lg transition-all"
        >
          <h3 className="font-bold text-gray-900 group-hover:text-[#F68B1F] transition-colors flex items-center gap-2">
            My Services
            <ArrowRight className="w-4 h-4" />
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Publish, edit or remove your mentor services.
          </p>
        </Link>
      </div>
    </div>
  );
}

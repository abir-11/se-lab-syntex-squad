import { fetchMentorStats, fetchMentorBookings, fetchMyServices } from "./_actions/mentorActions";
import { Layers, BookOpen, CheckCircle, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

const statusStyle: Record<string, string> = {
  PENDING:  "bg-amber-50 text-amber-600",
  ACCEPTED: "bg-blue-50 text-blue-600",
  CONFIRMED:"bg-emerald-50 text-emerald-600",
  REJECTED: "bg-red-50 text-red-500",
  CANCELLED:"bg-gray-100 text-gray-500",
};

export default async function MentorDashboardPage() {
  const [statsRes, bookingsRes, servicesRes] = await Promise.all([
    fetchMentorStats(),
    fetchMentorBookings(),
    fetchMyServices(),
  ]);

  const stats = statsRes.data;
  const recentBookings = (bookingsRes.data as any[]).slice(0, 5);
  const myServices     = (servicesRes.data as any[]).slice(0, 4);

  const statCards = [
    { label: "Total Services",    value: stats.totalServices,    icon: Layers,       bg: "bg-emerald-50", color: "text-emerald-500", href: "/dashboard/mentor/services" },
    { label: "Approved Services", value: stats.approvedServices, icon: CheckCircle,  bg: "bg-blue-50",    color: "text-blue-500",    href: "/dashboard/mentor/services" },
    { label: "Total Bookings",    value: stats.totalBookings,    icon: BookOpen,     bg: "bg-purple-50",  color: "text-purple-500",  href: "/dashboard/mentor/bookings" },
    { label: "Pending Requests",  value: stats.pendingBookings,  icon: Clock,        bg: "bg-amber-50",   color: "text-amber-500",   href: "/dashboard/mentor/bookings" },
    { label: "Accepted Sessions", value: stats.acceptedBookings, icon: TrendingUp,   bg: "bg-teal-50",    color: "text-teal-500",    href: "/dashboard/mentor/bookings" },
    { label: "Pending Services",  value: stats.pendingServices,  icon: Star,         bg: "bg-orange-50",  color: "text-orange-500",  href: "/dashboard/mentor/services" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentor Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Your mentoring activity at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, bg, color, href }) => (
          <Link key={label} href={href}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>
              <Icon size={17} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Booking Requests</h2>
            <Link href="/dashboard/mentor/bookings" className="text-xs font-semibold text-emerald-500 hover:underline">View all</Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b: any) => {
                const id  = b.id ?? b._id ?? "";
                const raw = String(b.status ?? "PENDING").toUpperCase();
                return (
                  <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{b.student?.name ?? "Student"}</p>
                      <p className="text-[11px] text-gray-400">{b.service?.name ?? b.service?.category ?? "Session"}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[raw] ?? "bg-gray-100 text-gray-500"}`}>
                      {raw.charAt(0) + raw.slice(1).toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No booking requests yet.</p>
            </div>
          )}
        </div>

        {/* My Services */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">My Services</h2>
            <Link href="/dashboard/mentor/services" className="text-xs font-semibold text-emerald-500 hover:underline">Manage</Link>
          </div>
          {myServices.length > 0 ? (
            <div className="space-y-3">
              {myServices.map((s: any) => {
                const id  = s.id ?? s._id ?? "";
                const raw = String(s.status ?? "PENDING").toUpperCase();
                return (
                  <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{s.name ?? s.category}</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">৳{s.fee ?? 0}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      raw === "APPROVED" ? "bg-emerald-50 text-emerald-600" :
                      raw === "PENDING"  ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-500"
                    }`}>{raw.charAt(0) + raw.slice(1).toLowerCase()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Layers size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No services yet.</p>
              <Link href="/dashboard/mentor/services" className="text-xs font-semibold text-emerald-500 hover:underline mt-1 block">
                Create your first service →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

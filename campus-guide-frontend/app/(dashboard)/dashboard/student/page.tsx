import { fetchStudentStats, fetchMyBookings, fetchPublicEvents } from "./_actions/studentActions";
import { BookOpen, Users, Calendar, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function StudentDashboardPage() {
  const [statsRes, bookingsRes, eventsRes] = await Promise.all([
    fetchStudentStats(),
    fetchMyBookings(),
    fetchPublicEvents(),
  ]);

  const stats = statsRes.data;
  const recentBookings = (bookingsRes.data as any[]).slice(0, 4);
  const upcomingEvents = (eventsRes.data as any[])
    .filter((e: any) => ["UPCOMING", "ONGOING"].includes(String(e.status ?? "").toUpperCase()))
    .slice(0, 3);

  const statusStyle: Record<string, string> = {
    PENDING:   "bg-amber-50 text-amber-600",
    ACCEPTED:  "bg-blue-50 text-blue-600",
    CONFIRMED: "bg-emerald-50 text-emerald-600",
    CANCELLED: "bg-red-50 text-red-500",
    REJECTED:  "bg-red-50 text-red-500",
  };

  const statCards = [
    { label: "Total Bookings",     value: stats.totalBookings,     icon: BookOpen,     bg: "bg-blue-50",    color: "text-blue-500",    href: "/dashboard/student/bookings" },
    { label: "Pending Bookings",   value: stats.pendingBookings,   icon: Clock,        bg: "bg-amber-50",   color: "text-amber-500",   href: "/dashboard/student/bookings" },
    { label: "Confirmed Sessions", value: stats.confirmedBookings, icon: CheckCircle,  bg: "bg-emerald-50", color: "text-emerald-500", href: "/dashboard/student/bookings" },
    { label: "Available Mentors",  value: stats.totalMentors,      icon: Users,        bg: "bg-purple-50",  color: "text-purple-500",  href: "/dashboard/student/mentors"  },
    { label: "Campus Events",      value: stats.totalEvents,       icon: Calendar,     bg: "bg-orange-50",  color: "text-orange-500",  href: "/dashboard/student/events"   },
    { label: "Resources",          value: stats.totalResources,    icon: FileText,     bg: "bg-teal-50",    color: "text-teal-500",    href: "/dashboard/student/resources"},
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Your campus activity at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, bg, color, href }) => (
          <Link key={label} href={href}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
            <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>
              <Icon size={18} />
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
            <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/dashboard/student/bookings"
              className="text-xs font-semibold text-blue-500 hover:underline">View all</Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b: any) => {
                const id  = b.id ?? b._id ?? "";
                const raw = String(b.status ?? "PENDING").toUpperCase();
                return (
                  <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {b.service?.name ?? b.service?.category ?? "Session"}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {b.mentor?.name ?? "Mentor"} •{" "}
                        {b.date ? new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                      </p>
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
              <p className="text-xs text-gray-400">No bookings yet.</p>
              <Link href="/dashboard/student/mentors"
                className="text-xs font-semibold text-blue-500 hover:underline mt-1 block">
                Browse mentors →
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/dashboard/student/events"
              className="text-xs font-semibold text-blue-500 hover:underline">View all</Link>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((e: any) => {
                const id  = e.id ?? e._id ?? "";
                const raw = String(e.status ?? "").toUpperCase();
                return (
                  <div key={id} className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-gray-800 leading-snug">{e.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        raw === "ONGOING" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {raw.charAt(0) + raw.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {e.location && <p className="text-[11px] text-gray-400">{e.location}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No upcoming events.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "Find Mentor",  href: "/dashboard/student/mentors",   icon: Users,    color: "text-purple-500 bg-purple-50" },
            { label: "My Bookings",  href: "/dashboard/student/bookings",  icon: BookOpen, color: "text-blue-500 bg-blue-50"    },
            { label: "Events",       href: "/dashboard/student/events",    icon: Calendar, color: "text-orange-500 bg-orange-50"},
            { label: "Campus News",  href: "/dashboard/student/news",      icon: AlertCircle, color: "text-sky-500 bg-sky-50"  },
            { label: "Alerts",       href: "/dashboard/student/alerts",    icon: AlertCircle, color: "text-red-500 bg-red-50"  },
            { label: "Resources",    href: "/dashboard/student/resources", icon: FileText, color: "text-teal-500 bg-teal-50"  },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

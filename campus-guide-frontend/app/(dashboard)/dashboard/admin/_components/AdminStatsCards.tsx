import {
  Users,
  GraduationCap,
  Star,
  AlertCircle,
  CalendarDays,
  Building2,
  BookOpen,
  Layers,
  Newspaper,
  Bell,
  FileText,
  Globe,
  Shield,
} from "lucide-react";

interface StatsProps {
  stats: {
    // existing
    totalUsers?: number;
    totalStudents?: number;
    totalMentors?: number;
    totalAdmins?: number;
    pendingApprovals?: number;
    totalEvents?: number;
    totalDepartments?: number;
    totalBookings?: number;
    totalServices?: number;
    // new
    totalResources?: number;
    activeAlerts?: number;
    publishedNews?: number;
    draftNews?: number;
  };
}

const cards = [
  { key: "totalUsers"      as const, label: "Total Users",        sub: "All members",        icon: Users,        bg: "bg-orange-50",  color: "text-orange-500"  },
  { key: "totalStudents"   as const, label: "Students",           sub: "Enrolled",           icon: GraduationCap,bg: "bg-blue-50",    color: "text-blue-500"    },
  { key: "totalMentors"    as const, label: "Mentors",            sub: "Approved",           icon: Star,         bg: "bg-emerald-50", color: "text-emerald-500" },
  { key: "totalAdmins"     as const, label: "Admins",             sub: "System admins",      icon: Shield,       bg: "bg-purple-50",  color: "text-purple-500"  },
  { key: "pendingApprovals"as const, label: "Pending Approvals",  sub: "Needs review",       icon: AlertCircle,  bg: "bg-amber-50",   color: "text-amber-500"   },
  { key: "totalEvents"     as const, label: "Events",             sub: "Campus events",      icon: CalendarDays, bg: "bg-indigo-50",  color: "text-indigo-500"  },
  { key: "totalDepartments"as const, label: "Departments",        sub: "Academic depts",     icon: Building2,    bg: "bg-sky-50",     color: "text-sky-500"     },
  { key: "totalBookings"   as const, label: "Bookings",           sub: "All bookings",       icon: BookOpen,     bg: "bg-pink-50",    color: "text-pink-500"    },
  { key: "totalServices"   as const, label: "Mentor Services",    sub: "Listed",             icon: Layers,       bg: "bg-teal-50",    color: "text-teal-500"    },
  { key: "totalResources"  as const, label: "Resources",          sub: "Learning materials", icon: FileText,     bg: "bg-violet-50",  color: "text-violet-500"  },
  { key: "activeAlerts"    as const, label: "Active Alerts",      sub: "Campus alerts",      icon: Bell,         bg: "bg-red-50",     color: "text-red-500"     },
  { key: "publishedNews"   as const, label: "Published News",     sub: "Live articles",      icon: Globe,        bg: "bg-emerald-50", color: "text-emerald-600" },
];

export default function AdminStatsCards({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, sub, icon: Icon, bg, color }) => {
        const value = stats?.[key] ?? 0;
        return (
          <div
            key={key}
            className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={19} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

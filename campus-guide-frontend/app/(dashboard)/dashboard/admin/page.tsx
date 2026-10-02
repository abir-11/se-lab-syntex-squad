import AdminStatsCards from "./_components/AdminStatsCards";
import PendingApprovalsCard from "./_components/PendingApprovalsCard";
import RecentBookingsCard from "./_components/RecentBookingsCard";
import { fetchAdminStats, fetchAdminStatsExtended } from "./_actions/adminActions";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch both stat groups in parallel
  const [baseRes, extended] = await Promise.all([
    fetchAdminStats(),
    fetchAdminStatsExtended(),
  ]);

  const stats = {
    ...(baseRes?.data || {
      totalUsers:       0,
      totalStudents:    0,
      totalMentors:     0,
      totalAdmins:      0,
      pendingApprovals: 0,
      totalEvents:      0,
      totalDepartments: 0,
      totalBookings:    0,
      totalServices:    0,
    }),
    totalResources: extended.totalResources,
    activeAlerts:   extended.activeAlerts,
    publishedNews:  extended.publishedNews,
    draftNews:      extended.draftNews,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Real-time statistics &amp; applicant reviews</p>
      </div>

      <AdminStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovalsCard />
        <RecentBookingsCard />
      </div>
    </div>
  );
}

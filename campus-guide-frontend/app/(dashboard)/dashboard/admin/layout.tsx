import { cookies } from "next/headers";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const BACKEND =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "https://campus-guide-backend.vercel.app";

    const res = await fetch(`${BACKEND}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `accessToken=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const u = data?.data || data;
    if (!u?.name) return null;

    return { name: u.name, email: u.email ?? "", role: u.role ?? "ADMIN" };
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      {/* Sidebar — handles both mobile top-bar and desktop sidebar */}
      <DashboardSidebar user={user} />

      {/* Right column: sticky header + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop sticky header (hidden on mobile — mobile uses DashboardSidebar's top bar) */}
        <DashboardHeader user={user} />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

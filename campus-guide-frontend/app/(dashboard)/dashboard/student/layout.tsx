import { cookies } from "next/headers";
import StudentSidebar from "./_components/StudentSidebar";
import StudentHeader from "./_components/StudentHeader";

async function getStudentUser() {
  try {
    const store = await cookies();
    const token = store.get("accessToken")?.value;
    if (!token) return null;
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "https://campus-guide-backend.vercel.app";
    const res = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Cookie: `accessToken=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const u = data?.data || data;
    return u?.name ? { name: u.name, email: u.email ?? "", role: u.role ?? "STUDENT" } : null;
  } catch { return null; }
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getStudentUser();
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <StudentSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

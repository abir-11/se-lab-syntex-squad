import { cookies } from "next/headers";
import MentorSidebar from "./_components/MentorSidebar";
import MentorHeader from "./_components/MentorHeader";

async function getMentorUser() {
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
    const u = data?.data?.result ?? data?.data ?? data;
    return u?.name ? { name: u.name, email: u.email ?? "", role: u.role ?? "MENTOR" } : null;
  } catch { return null; }
}

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const user = await getMentorUser();
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <MentorSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <MentorHeader user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

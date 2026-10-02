import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

// JWT Token decode করার জন্য হেলপার ফাংশন (Fallback)
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default async function Navbar() {
  let user: { name: string; email: string; role: string } | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
      const BACKEND =
        process.env.NEXT_PUBLIC_BACKEND_API_URL ||
        "https://campus-guide-backend.vercel.app";

      // ১. Backend API থেকে ইউজার ডাটা ফেচ করার চেষ্টা
      try {
        const res = await fetch(`${BACKEND}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `accessToken=${token}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          // Backend Response flexible extraction
          const u = data?.data?.user || data?.data || data?.user || data;
          const name = u?.name || u?.fullName || u?.user?.name;
          const email = u?.email || u?.user?.email;
          const role = u?.role || u?.user?.role || "STUDENT";

          if (email) {
            user = {
              name: name || email.split("@")[0],
              email: email,
              role: role,
            };
          }
        }
      } catch (err) {
        console.error("Navbar /api/auth/me fetch error:", err);
      }

      // ২. এপিআই ফেইল করলে টোকেন decode করে ডাটা নেওয়ার Fallback
      if (!user) {
        const decoded = parseJwt(token);
        if (decoded) {
          const email = decoded.email || decoded.user?.email;
          const name =
            decoded.name ||
            decoded.user?.name ||
            (email ? email.split("@")[0] : "User");
          const role = decoded.role || decoded.user?.role || "STUDENT";

          if (email || decoded.id || decoded.sub) {
            user = {
              name: name,
              email: email || "user@uiucampus.com",
              role: role,
            };
          }
        }
      }
    }
  } catch (error) {
    console.error("Navbar error:", error);
  }

  return <NavbarClient user={user} />;
}
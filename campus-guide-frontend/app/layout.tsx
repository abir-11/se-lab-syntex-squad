import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/app/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "campus-guide",
  description:
    "campus-guide is a platform that connects students with mentors and provides information about campus events and resources.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * AuthProvider wraps the entire app so useAuth() works everywhere.
         *
         * ── Navbar strategy ──────────────────────────────────────────────────
         *  • Public routes   → Navbar lives in app/(public)/layout.tsx
         *  • Auth routes     → app/(auth)/layout.tsx  (no navbar)
         *  • Dashboard routes→ app/(dashboard)/…/layout.tsx  (own sidebar/header)
         *
         * There is NO <Navbar> here — each route group owns its own header so
         * public and dashboard navbars never render at the same time.
         */}
        <AuthProvider>
          <Toaster position="top-right" richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

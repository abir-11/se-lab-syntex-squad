import React from "react";
import FooterSection from "@/components/shared/footer/page";
// ✅ NavbarClient-এর বদলে Server Component (Navbar) ইম্পোর্ট করুন
import Navbar from "@/components/shared/navbar/Navbar"; 

/**
 * Public layout — wraps every page under app/(public)/.
 *
 * The Navbar lives HERE (not in the root layout), so it only renders
 * on public routes. Dashboard and auth routes never see this layout.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar Server Component যা কুকি পড়ে ডাটা NavbarClient-এ পাঠাবে */}
      <Navbar />
      <main className="flex-1">{children}</main>
      <FooterSection />
    </div>
  );
}
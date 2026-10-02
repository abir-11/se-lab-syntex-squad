import React from "react";
import { Navbar } from "@/components/shared/navbar/page";
import Footer from "@/components/shared/footer/page";
import { getMe } from "@/service/getMe";

export const dynamic = "force-dynamic";

const PublicLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;

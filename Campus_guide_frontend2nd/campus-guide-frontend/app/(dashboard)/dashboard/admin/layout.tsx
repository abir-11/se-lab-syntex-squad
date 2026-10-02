import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import AdminLayoutClient from "./_components/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  if (currentUser.role !== "ADMIN" && currentUser.role !== "FACULTY") {
    redirect("/dashboard");
  }

  return (
    <AdminLayoutClient userName={currentUser.name} role={currentUser.role}>
      {children}
    </AdminLayoutClient>
  );
}

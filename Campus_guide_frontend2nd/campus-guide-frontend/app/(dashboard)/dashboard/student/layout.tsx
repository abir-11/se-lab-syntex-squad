import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import StudentLayoutClient from "./_components/StudentLayoutClient";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  if (currentUser.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return (
    <StudentLayoutClient userName={currentUser.name}>
      {children}
    </StudentLayoutClient>
  );
}

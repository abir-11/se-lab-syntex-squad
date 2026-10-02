import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import MentorLayoutClient from "./_components/MentorLayoutClient";

export const dynamic = "force-dynamic";

export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  if (currentUser.role !== "MENTOR") {
    redirect("/dashboard");
  }

  return (
    <MentorLayoutClient userName={currentUser.name}>
      {children}
    </MentorLayoutClient>
  );
}

import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getAllMentorServices } from "@/service/getAllMentorServices";
import MyServicesClient from "./_components/MyServicesClient";

export const dynamic = "force-dynamic";

export default async function MentorMyServicesPage() {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  const servicesRes = await getAllMentorServices({ limit: 100 });
  // Service.mentorId is the mentor's user id
  const myServices = (servicesRes?.data || []).filter(
    (s) => s.mentor?.id === currentUser.id
  );

  return <MyServicesClient services={myServices} />;
}

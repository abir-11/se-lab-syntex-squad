import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getMyBookingsAction } from "@/service/bookingActions";
import MentorBookingsClient from "./_components/MentorBookingsClient";

export const dynamic = "force-dynamic";

export default async function MentorBookingsPage() {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  const bookingsRes = await getMyBookingsAction();
  const myBookings = (bookingsRes?.data || []).filter(
    (b: any) => b.mentor?.id === currentUser.id
  );

  return <MentorBookingsClient bookings={myBookings} />;
}

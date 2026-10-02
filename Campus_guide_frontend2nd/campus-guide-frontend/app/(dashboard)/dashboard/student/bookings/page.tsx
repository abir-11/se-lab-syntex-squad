import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getMyBookingsAction } from "@/service/bookingActions";
import StudentBookingsClient from "./_components/StudentBookingsClient";

export const dynamic = "force-dynamic";

export default async function StudentBookingsPage() {
  const user = await getMe();

  if (!user?.success || !user?.data?.result) {
    redirect("/login");
  }

  const currentUser = user.data.result;

  const bookingsRes = await getMyBookingsAction();
  const myBookings = (bookingsRes?.data || []).filter(
    (b: any) => b.student?.id === currentUser.id
  );

  return <StudentBookingsClient bookings={myBookings} />;
}

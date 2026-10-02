import React from "react";
import { getAllMentors } from "@/service/getAllMentors";
import MentorsClient from "./_components/MentorsClient";

export const dynamic = "force-dynamic";

export default async function AdminMentorsPage() {
  const mentorsRes = await getAllMentors();
  const mentors = mentorsRes?.data || [];

  return <MentorsClient mentors={mentors} />;
}

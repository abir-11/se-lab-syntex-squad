import React from "react";
import { getHomeContent } from "@/service/getPublishedStories";
import HomeContentClient from "./_components/HomeContentClient";

export const dynamic = "force-dynamic";

export default async function AdminHomeContentPage() {
  const homeContentRes = await getHomeContent();
  const homeContent = homeContentRes?.data ?? null;

  return <HomeContentClient homeContent={homeContent} />;
}

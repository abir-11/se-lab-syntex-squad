import React from "react";
import { getPublishedStories } from "@/service/getPublishedStories";
import StoriesClient from "./_components/StoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
  const storiesRes = await getPublishedStories();
  const stories = storiesRes?.data || [];

  return <StoriesClient stories={stories} />;
}

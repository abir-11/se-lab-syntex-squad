import React from "react";
import { getAllEvents } from "@/service/getPublishedStories";
import EventsClient from "./_components/EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const eventsRes = await getAllEvents({ limit: 100 });
  const events = eventsRes?.data || [];

  return <EventsClient events={events} />;
}

"use client";

import { useParams } from "next/navigation";
import { useWedding } from "@/lib/store";
import { EventForm } from "@/components/events/EventForm";
import { EmptyState } from "@/components/ui/primitives";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const w = useWedding();
  const event = w.events.find((e) => e.id === id);
  if (!event) return <div className="mx-auto max-w-3xl py-12"><EmptyState title="Event not found" /></div>;
  return <EventForm event={event} />;
}

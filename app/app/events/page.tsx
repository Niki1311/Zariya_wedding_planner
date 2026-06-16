"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding } from "@/lib/store";
import { sortedEvents, eventProgress, eventPendingTasks } from "@/lib/selectors";
import { PageTitle, Card, ProgressRing, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { formatINR, formatDate, formatTimeRange } from "@/lib/utils";
import { Plus, MapPin, ListChecks, Wallet, CalendarHeart, Sparkles } from "lucide-react";

const EVENT_EMOJI: Record<string, string> = { haldi: "🌼", mehendi: "🌿", sangeet: "🎶", wedding: "💍", reception: "✨" };
const FILTERS = [
  { value: "all", label: "All events" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ceremonies", label: "Ceremonies" },
  { value: "celebrations", label: "Celebrations" },
  { value: "completed", label: "Completed" },
];

export default function EventsPage() {
  const w = useWedding();
  const [filter, setFilter] = useState("all");
  const events = sortedEvents(w);

  const vendorBudget = (eventId: string) =>
    w.vendors.filter((v) => v.eventIds.includes(eventId)).reduce((s, v) => s + v.totalAgreed, 0);

  const filtered = events.filter((e) => {
    const past = e.date ? new Date(e.date) < new Date() : false;
    if (filter === "upcoming") return e.date && new Date(e.date) >= new Date();
    if (filter === "ceremonies") return e.isCeremony;
    if (filter === "celebrations") return !e.isCeremony;
    if (filter === "completed") return eventProgress(e) === 100 || past;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Wedding events"
        icon={<Sparkles className="h-6 w-6" />}
        subtitle="Curated celebrations across your unforgettable days."
        action={
          <div className="flex gap-2">
            <Link href="/app/schedule"><Button variant="ghost">Master timeline</Button></Link>
            <Link href="/app/events/new"><Button icon={<Plus className="h-4 w-4" />}>Add new event</Button></Link>
          </div>
        }
      />

      <FadeIn><FilterTabs options={FILTERS} value={filter} onChange={setFilter} /></FadeIn>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_16rem]">
        {filtered.length === 0 ? (
          <EmptyState title="No events in this view" message="Add a new event or change the filter." action={<Link href="/app/events/new"><Button icon={<Plus className="h-4 w-4" />}>Add new event</Button></Link>} />
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {filtered.map((e) => {
              const progress = eventProgress(e);
              const pending = eventPendingTasks(e);
              const budget = vendorBudget(e.id);
              return (
                <StaggerItem key={e.id}>
                  <Link href={`/app/events/${e.id}`}>
                    <Card className="group h-full overflow-hidden p-0 transition hover:shadow-lift">
                      <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-gold-100 via-ivory-200 to-gold-50 text-4xl">
                        <span>{EVENT_EMOJI[e.type] ?? "🎉"}</span>
                        {e.isCeremony && <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-700">Ceremony</span>}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-serif text-xl font-semibold">{e.name}</h3>
                            <p className="text-xs text-ink-muted">{e.date ? formatDate(e.date) : "Date TBD"} · {formatTimeRange(e.startTime, e.endTime)}</p>
                            {e.location && <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted"><MapPin className="h-3 w-3" /> {e.location}</p>}
                          </div>
                          <ProgressRing value={progress} size={48} stroke={5} />
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-ink-light">
                          <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-gold-500" /> {budget > 0 ? formatINR(budget, { compact: true }) : "—"}</span>
                          <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5 text-gold-500" /> {pending} pending</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        <Card>
          <h3 className="mb-1 flex items-center gap-2 text-base font-semibold"><CalendarHeart className="h-4 w-4 text-gold-500" /> Celebration journey</h3>
          <p className="mb-4 text-xs text-ink-muted">Your celebration flow, in order.</p>
          <div className="relative space-y-4 pl-5">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gold-200" />
            {events.map((e) => (
              <Link key={e.id} href={`/app/events/${e.id}`} className="relative block">
                <span className="absolute -left-5 top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-gold-400 bg-white" />
                <p className="text-sm font-medium text-ink">{e.name}</p>
                <p className="text-xs text-ink-muted">{e.date ? formatDate(e.date) : "TBD"} · {formatTimeRange(e.startTime, e.endTime)}</p>
              </Link>
            ))}
            {events.length === 0 && <p className="text-sm text-ink-muted">No events yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useWedding, useStore } from "@/lib/store";
import { sortedEvents, eventProgress, eventGuestCounts, eventVendors } from "@/lib/selectors";
import { Card, SectionTitle, ProgressRing, Chip, StatusChip, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { EventChecklist } from "@/components/events/EventChecklist";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FadeIn } from "@/components/ui/motion";
import { formatINR, formatDate, formatTime, formatTimeRange, cn } from "@/lib/utils";
import { MapPin, Clock, ListChecks, Users, Store, StickyNote, Wallet, Pencil, Trash2, CalendarHeart } from "lucide-react";

const EVENT_EMOJI: Record<string, string> = { haldi: "🌼", mehendi: "🌿", sangeet: "🎶", wedding: "💍", reception: "✨" };

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const events = sortedEvents(w);
  const event = w.events.find((e) => e.id === id);

  const [notes, setNotes] = useState(event?.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  if (!event) return <div className="mx-auto max-w-3xl py-12"><EmptyState title="Event not found" message="It may have been deleted." action={<Link href="/app/events"><Button>Back to events</Button></Link>} /></div>;

  const progress = eventProgress(event);
  const counts = eventGuestCounts(w, event.id);
  const vendors = eventVendors(w, event.id);
  const budget = vendors.reduce((s, v) => s + v.totalAgreed, 0);
  const paid = vendors.reduce((s, v) => s + w.payments.filter((p) => p.vendorId === v.id && p.status === "Paid").reduce((a, p) => a + p.amount, 0), 0);

  async function saveNotes() {
    if (!notesDirty) return;
    await mutate("PATCH", `/api/events/${event!.id}`, { notes });
    setNotesDirty(false);
  }
  async function confirmDelete() {
    setDelLoading(true);
    await mutate("DELETE", `/api/events/${event!.id}`);
    setDelLoading(false);
    router.push("/app/events");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Event switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {events.map((e) => (
          <Link
            key={e.id}
            href={`/app/events/${e.id}`}
            className={cn("rounded-full border px-3.5 py-1.5 text-sm transition", e.id === event.id ? "border-gold-400 bg-gradient-to-b from-gold-50 to-gold-100 font-medium text-gold-700" : "border-transparent bg-ivory-200/60 text-ink-muted hover:bg-ivory-200")}
          >
            {EVENT_EMOJI[e.type] ?? "🎉"} {e.name}
          </Link>
        ))}
      </div>

      <FadeIn>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="flex items-center gap-2 font-serif text-3xl font-semibold">
            {EVENT_EMOJI[event.type] ?? "🎉"} {event.name}
            {event.isCeremony && <Chip tone="gold">Ceremony</Chip>}
          </h1>
          <div className="flex gap-2">
            <Link href={`/app/events/${event.id}/edit`}><Button variant="ghost" icon={<Pencil className="h-4 w-4" />}>Edit event</Button></Link>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleting(true)}>Delete</Button>
          </div>
        </div>
      </FadeIn>

      {/* Overview */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <ProgressRing value={progress} size={84} stroke={7} />
          <div className="flex flex-1 flex-wrap gap-x-10 gap-y-3">
            <Overview icon={<CalendarHeart className="h-4 w-4" />} label="Date" value={event.date ? formatDate(event.date, "long") : "Not set"} />
            <Overview icon={<Clock className="h-4 w-4" />} label="Time" value={formatTimeRange(event.startTime, event.endTime)} />
            <Overview icon={<MapPin className="h-4 w-4" />} label="Location" value={event.location || "Not set"} />
            <Overview icon={<Users className="h-4 w-4" />} label="Guests" value={`${counts.invited} invited · ${counts.expected} expected`} />
          </div>
        </div>
        {event.description && <p className="mt-4 border-t border-gold-100 pt-4 text-sm text-ink-light">{event.description}</p>}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionTitle title="Checklist" icon={<ListChecks className="h-5 w-5" />} subtitle="Drives this event's progress. Click text to edit, use the dot to change status." />
            <EventChecklist eventId={event.id} items={event.checklist} />
          </Card>

          <Card>
            <SectionTitle title="Timeline / run-of-show" icon={<Clock className="h-5 w-5" />} subtitle="Also appears in the Master Wedding Timeline." action={<Link href={`/app/events/${event.id}/edit`} className="text-xs font-medium text-gold-700 hover:underline">Edit schedule</Link>} />
            {event.subEvents.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-muted">No run-of-show yet. Edit the event to build one.</p>
            ) : (
              <div className="relative space-y-3 pl-6">
                <div className="absolute bottom-2 left-[9px] top-2 w-px bg-gold-200" />
                {event.subEvents.map((s) => (
                  <div key={s.id} className="relative">
                    <span className="absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-gold-400 bg-white" />
                    <p className="text-sm font-medium">{formatTime(s.startTime)} — {s.title}</p>
                    <p className="text-xs text-ink-muted">{formatTimeRange(s.startTime, s.endTime)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle title="Notes" icon={<StickyNote className="h-5 w-5" />} action={notesDirty ? <Button size="sm" onClick={saveNotes}>Save notes</Button> : undefined} />
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesDirty(true); }}
              onBlur={saveNotes}
              placeholder="Add notes for this event…"
              className="input-base min-h-[100px] resize-y"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle title="Guest count" icon={<Users className="h-5 w-5" />} />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-ivory-50/70 p-4 text-center">
                <p className="font-serif text-3xl font-semibold text-gold-700">{counts.invited}</p>
                <p className="text-xs text-ink-muted">Invited</p>
              </div>
              <div className="rounded-xl bg-sage-bg/60 p-4 text-center">
                <p className="font-serif text-3xl font-semibold text-sage-text">{counts.expected}</p>
                <p className="text-xs text-ink-muted">Expected</p>
              </div>
            </div>
            <Link href="/app/guests" className="mt-3 block text-center text-xs font-medium text-gold-700 hover:underline">Manage guests</Link>
          </Card>

          <Card>
            <SectionTitle title="Vendors involved" icon={<Store className="h-5 w-5" />} />
            {vendors.length === 0 ? (
              <p className="py-2 text-sm text-ink-muted">No vendors linked. <Link href={`/app/events/${event.id}/edit`} className="text-gold-700 hover:underline">Link vendors</Link></p>
            ) : (
              <div className="space-y-2">
                {vendors.map((v) => (
                  <Link key={v.id} href={`/app/vendors/${v.id}/edit`} className="flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-ivory-100">
                    <div>
                      <p className="text-sm font-medium">{v.name}</p>
                      <p className="text-xs text-ink-muted">{v.category}</p>
                    </div>
                    <StatusChip status={v.contractStatus} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {budget > 0 && (
            <Card>
              <SectionTitle title="Budget summary" icon={<Wallet className="h-5 w-5" />} />
              <div className="space-y-2 text-sm">
                <Row label="Committed" value={formatINR(budget)} />
                <Row label="Paid" value={formatINR(paid)} tone="text-sage-text" />
                <Row label="Pending" value={formatINR(budget - paid)} tone="text-amberc-text" />
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={confirmDelete}
        title="Delete event?"
        message={`Delete ${event.name}? This removes its checklist, run-of-show and links. Guests and vendors remain but lose this event link.`}
        confirmLabel="Delete event"
        danger
        loading={delLoading}
      />
    </div>
  );
}

function Overview({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted">{icon} {label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={cn("font-medium", tone)}>{value}</span>
    </div>
  );
}

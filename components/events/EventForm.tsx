"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, useWedding } from "@/lib/store";
import { EventData } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea, Checkbox } from "@/components/ui/fields";
import { timeToMinutes } from "@/lib/utils";
import { CalendarHeart, ListOrdered, Store, Plus, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";

interface SubRow { title: string; startTime: string; endTime: string; }

export function EventForm({ event }: { event?: EventData | null }) {
  const wedding = useWedding();
  const router = useRouter();
  const mutate = useStore((s) => s.mutate);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(event?.name ?? "");
  const [date, setDate] = useState(event?.date ? event.date.slice(0, 10) : "");
  const [startTime, setStartTime] = useState(event?.startTime ?? "");
  const [endTime, setEndTime] = useState(event?.endTime ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [subs, setSubs] = useState<SubRow[]>(
    event?.subEvents.map((s) => ({ title: s.title, startTime: s.startTime, endTime: s.endTime })) ?? []
  );
  const [vendorIds, setVendorIds] = useState<string[]>(event?.vendorIds ?? []);

  function addSub() {
    setSubs([...subs, { title: "", startTime: startTime || "16:00", endTime: endTime || "17:00" }]);
  }
  function updateSub(i: number, k: keyof SubRow, v: string) {
    setSubs(subs.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  }
  function removeSub(i: number) {
    setSubs(subs.filter((_, idx) => idx !== i));
  }
  function toggleVendor(id: string) {
    setVendorIds(vendorIds.includes(id) ? vendorIds.filter((v) => v !== id) : [...vendorIds, id]);
  }

  // gentle overlap detection
  const overlaps = subs.some((a, i) =>
    subs.some((b, j) => i < j && a.startTime && a.endTime && b.startTime && b.endTime &&
      timeToMinutes(a.startTime) < timeToMinutes(b.endTime) && timeToMinutes(b.startTime) < timeToMinutes(a.endTime))
  );

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const cleanSubs = subs.filter((s) => s.title.trim());
      if (event) {
        await mutate("PATCH", `/api/events/${event.id}`, { name, date: date || null, startTime, endTime, location, description, subEvents: cleanSubs, vendorIds });
        router.push(`/app/events/${event.id}`);
      } else {
        const res = await mutate("POST", "/api/events", { name });
        const id = res?.id;
        if (id) {
          await mutate("PATCH", `/api/events/${id}`, { date: date || null, startTime, endTime, location, description, subEvents: cleanSubs, vendorIds });
          router.push(`/app/events/${id}`);
        } else {
          router.push("/app/events");
        }
      }
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/app/events" className="flex items-center gap-1 hover:text-gold-700"><ArrowLeft className="h-4 w-4" /> Events</Link>
        <span>/</span>
        <span className="text-ink">{event ? "Edit event" : "Add new event"}</span>
      </div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">{event ? `Edit ${event.name}` : "Add new event"}</h1>
      <p className="mb-6 text-sm text-ink-muted">Set the date, time, location, sub-events and vendors for this celebration.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <SectionTitle title="Event details" icon={<CalendarHeart className="h-5 w-5" />} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event name" required className="sm:col-span-2"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome dinner" /></Field>
              <Field label="Date"><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Location"><TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lotus Garden" /></Field>
              <Field label="Start time"><TextInput type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></Field>
              <Field label="End time"><TextInput type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></Field>
              <Field label="Short description" className="sm:col-span-2"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            </div>
          </Card>

          <Card>
            <SectionTitle
              title="Build timeline (run-of-show)"
              icon={<ListOrdered className="h-5 w-5" />}
              subtitle="Sub-events of any duration. Overlaps are allowed for parallel activities."
              action={<Button size="sm" variant="ghost" onClick={addSub} icon={<Plus className="h-4 w-4" />}>Add</Button>}
            />
            {overlaps && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-amberc-bg px-3 py-2 text-xs text-amberc-text">
                <AlertTriangle className="h-4 w-4" /> Some sub-events overlap — that&apos;s fine, you can still save.
              </div>
            )}
            <div className="space-y-2">
              {subs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput value={s.title} onChange={(e) => updateSub(i, "title", e.target.value)} placeholder="e.g. Guest arrival" className="flex-1" />
                  <TextInput type="time" value={s.startTime} onChange={(e) => updateSub(i, "startTime", e.target.value)} className="w-28" />
                  <span className="text-ink-muted">–</span>
                  <TextInput type="time" value={s.endTime} onChange={(e) => updateSub(i, "endTime", e.target.value)} className="w-28" />
                  <button onClick={() => removeSub(i)} className="rounded-lg p-2 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              {subs.length === 0 && <p className="py-3 text-center text-sm text-ink-muted">No sub-events yet. Add one to build the run-of-show.</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionTitle title="Vendors for this event" icon={<Store className="h-5 w-5" />} subtitle="Link existing vendors — no duplicates created." />
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {wedding.vendors.map((v) => (
                <Checkbox key={v.id} checked={vendorIds.includes(v.id)} onChange={() => toggleVendor(v.id)} label={<span><span className="font-medium">{v.name}</span> <span className="text-xs text-ink-muted">· {v.category}</span></span>} />
              ))}
              {wedding.vendors.length === 0 && <p className="text-sm text-ink-muted">No vendors yet. Add vendors first to link them.</p>}
            </div>
          </Card>
          <div className="sticky bottom-4 space-y-2">
            <Button onClick={save} loading={saving} className="w-full" disabled={!name.trim()}>Save event</Button>
            <Link href="/app/events"><Button variant="ghost" className="w-full">Cancel</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

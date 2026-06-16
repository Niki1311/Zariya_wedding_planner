"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWedding, useStore } from "@/lib/store";
import { sortedEvents } from "@/lib/selectors";
import { PageTitle, Card, SectionTitle, Chip } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, Toggle } from "@/components/ui/fields";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatINR } from "@/lib/utils";
import { Heart, CalendarHeart, Wallet, Bell, Sparkles, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, Pencil, Check } from "lucide-react";

export default function SettingsPage() {
  const w = useWedding();
  const router = useRouter();
  const mutate = useStore((s) => s.mutate);
  const events = sortedEvents(w);

  const [wd, setWd] = useState({
    coupleNames: w.coupleNames, weddingName: w.weddingName, location: w.location,
    startDate: w.startDate?.slice(0, 10) ?? "", endDate: w.endDate?.slice(0, 10) ?? "", totalBudget: w.totalBudget.toString(),
  });
  const [savingWd, setSavingWd] = useState(false);
  const [savedWd, setSavedWd] = useState(false);

  const [newEvent, setNewEvent] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{ id: string; name: string } | null>(null);

  const [newCat, setNewCat] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function saveWedding() {
    setSavingWd(true);
    await mutate("PATCH", "/api/wedding", { ...wd, totalBudget: parseFloat(wd.totalBudget) || 0, startDate: wd.startDate || null, endDate: wd.endDate || null });
    setSavingWd(false);
    setSavedWd(true);
    setTimeout(() => setSavedWd(false), 2000);
  }
  async function addEvent() {
    if (!newEvent.trim()) return;
    await mutate("POST", "/api/events", { name: newEvent.trim() });
    setNewEvent("");
  }
  async function saveRename() {
    if (!renaming) return;
    await mutate("PATCH", `/api/events/${renaming.id}`, { name: renaming.name });
    setRenaming(null);
  }
  async function deleteEvent() {
    if (!deletingEvent) return;
    await mutate("DELETE", `/api/events/${deletingEvent.id}`);
    setDeletingEvent(null);
  }
  async function move(idx: number, dir: -1 | 1) {
    const target = events[idx + dir];
    const cur = events[idx];
    if (!target) return;
    await mutate("PATCH", `/api/events/${cur.id}`, { position: target.position });
    await mutate("PATCH", `/api/events/${target.id}`, { position: cur.position });
  }
  async function addCategory() {
    if (!newCat.trim()) return;
    await mutate("POST", "/api/budget-categories", { name: newCat.trim() });
    setNewCat("");
  }
  async function toggleNotify(key: string, val: boolean) {
    await mutate("PATCH", "/api/wedding", { [key]: val });
  }
  async function restartGuide() {
    await mutate("PATCH", "/api/wedding", { guideCompleted: false });
    router.push("/app");
  }
  async function doReset() {
    setResetting(true);
    await mutate("POST", "/api/reset");
    setResetting(false);
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Settings" subtitle="Manage your workspace, events, budget and preferences." />

      <div className="space-y-6">
        {/* Wedding details */}
        <Card>
          <SectionTitle title="Wedding details" icon={<Heart className="h-5 w-5" />} action={savedWd ? <Chip tone="sage"><Check className="h-3 w-3" /> Saved</Chip> : <Button size="sm" onClick={saveWedding} loading={savingWd}>Save changes</Button>} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Couple names"><TextInput value={wd.coupleNames} onChange={(e) => setWd({ ...wd, coupleNames: e.target.value })} /></Field>
            <Field label="Wedding name"><TextInput value={wd.weddingName} onChange={(e) => setWd({ ...wd, weddingName: e.target.value })} /></Field>
            <Field label="Location"><TextInput value={wd.location} onChange={(e) => setWd({ ...wd, location: e.target.value })} /></Field>
            <Field label="Total budget (₹)" hint={wd.totalBudget ? formatINR(parseFloat(wd.totalBudget)) : undefined}><TextInput type="number" value={wd.totalBudget} onChange={(e) => setWd({ ...wd, totalBudget: e.target.value })} /></Field>
            <Field label="Start date"><TextInput type="date" value={wd.startDate} onChange={(e) => setWd({ ...wd, startDate: e.target.value })} /></Field>
            <Field label="End date"><TextInput type="date" value={wd.endDate} onChange={(e) => setWd({ ...wd, endDate: e.target.value })} /></Field>
          </div>
        </Card>

        {/* Events */}
        <Card>
          <SectionTitle title="Selected events" icon={<CalendarHeart className="h-5 w-5" />} subtitle="Add, rename, reorder or remove — changes reflect across the app." />
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2 rounded-lg border border-gold-50 bg-white px-3 py-2">
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-muted hover:text-gold-700 disabled:opacity-30"><ChevronUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === events.length - 1} className="text-ink-muted hover:text-gold-700 disabled:opacity-30"><ChevronDown className="h-3.5 w-3.5" /></button>
                </div>
                <span className="flex-1 text-sm font-medium">{e.name}</span>
                {e.isCeremony && <Chip tone="gold">Ceremony</Chip>}
                <button onClick={() => setRenaming({ id: e.id, name: e.name })} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeletingEvent({ id: e.id, name: e.name })} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <TextInput value={newEvent} onChange={(e) => setNewEvent(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addEvent()} placeholder="Add an event (e.g. Pool party)" />
            <Button variant="ghost" onClick={addEvent} icon={<Plus className="h-4 w-4" />}>Add</Button>
          </div>
        </Card>

        {/* Budget categories */}
        <Card>
          <SectionTitle title="Budget categories" icon={<Wallet className="h-5 w-5" />} />
          <div className="flex flex-wrap gap-2">
            {[...w.budgetCategories].sort((a, b) => a.position - b.position).map((c) => (
              <span key={c.id} className="group flex items-center gap-1.5 rounded-full border border-gold-200/70 bg-white px-3 py-1 text-sm">
                {c.name}
                <button onClick={() => mutate("DELETE", `/api/budget-categories/${c.id}`)} className="text-ink-muted opacity-0 transition hover:text-rose-text group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <TextInput value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} placeholder="Add a budget category" />
            <Button variant="ghost" onClick={addCategory} icon={<Plus className="h-4 w-4" />}>Add</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <SectionTitle title="Notification preferences" icon={<Bell className="h-5 w-5" />} />
          <div className="space-y-3">
            <Toggle checked={w.notifyPayments} onChange={(v) => toggleNotify("notifyPayments", v)} label="Payment reminders" />
            <Toggle checked={w.notifyTasks} onChange={(v) => toggleNotify("notifyTasks", v)} label="Task & deadline alerts" />
            <Toggle checked={w.notifyRsvp} onChange={(v) => toggleNotify("notifyRsvp", v)} label="RSVP follow-up reminders" />
            <Toggle checked={w.notifyBudget} onChange={(v) => toggleNotify("notifyBudget", v)} label="Over-budget warnings" />
          </div>
        </Card>

        {/* Guide + reset */}
        <Card>
          <SectionTitle title="Workspace" icon={<Sparkles className="h-5 w-5" />} />
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" icon={<Sparkles className="h-4 w-4" />} onClick={restartGuide}>Restart dashboard guide</Button>
            <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={() => setResetOpen(true)}>Reset & start fresh</Button>
          </div>
          <p className="mt-3 text-xs text-ink-muted">Reset clears all events, guests, vendors, payments and budget so you can set up a new wedding from scratch.</p>
        </Card>
      </div>

      {/* Rename modal */}
      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Rename event"
        footer={<><Button variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button><Button onClick={saveRename}>Save</Button></>}>
        <Field label="Event name"><TextInput value={renaming?.name ?? ""} onChange={(e) => setRenaming(renaming ? { ...renaming, name: e.target.value } : null)} /></Field>
      </Modal>

      <ConfirmDialog open={!!deletingEvent} onClose={() => setDeletingEvent(null)} onConfirm={deleteEvent} title="Remove event?" message={`Remove ${deletingEvent?.name}? Its checklist and run-of-show are deleted; guests and vendors lose this event link.`} confirmLabel="Remove" danger />
      <ConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={doReset} title="Reset workspace?" message="This permanently clears all your wedding data and returns you to onboarding. This cannot be undone." confirmLabel="Reset everything" danger loading={resetting} />
    </div>
  );
}

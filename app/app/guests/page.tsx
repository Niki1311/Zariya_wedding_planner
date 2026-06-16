"use client";

import { useState } from "react";
import { useWedding, useStore } from "@/lib/store";
import { guestSummary, guestSegments } from "@/lib/selectors";
import { GuestData } from "@/lib/types";
import { PageTitle, Card, StatCard, StatusChip, Chip, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GuestModal } from "@/components/guests/GuestModal";
import { FadeIn } from "@/components/ui/motion";
import { Users, UserCheck, UserMinus, Clock, Plus, Pencil, Trash2, Search } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "Accepted", label: "Accepted" },
  { value: "Pending", label: "Pending" },
  { value: "Declined", label: "Declined" },
  { value: "Bride side", label: "Bride side" },
  { value: "Groom side", label: "Groom side" },
  { value: "Family", label: "Family" },
  { value: "Friends", label: "Friends" },
];

export default function GuestsPage() {
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const summary = guestSummary(w);
  const segs = guestSegments(w);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GuestData | null>(null);
  const [deleting, setDeleting] = useState<GuestData | null>(null);
  const [delLoading, setDelLoading] = useState(false);

  const eventName = (id: string) => w.events.find((e) => e.id === id)?.name ?? "";

  const filtered = w.guests.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "all") return true;
    if (["Accepted", "Pending", "Declined"].includes(filter)) return g.rsvpStatus === filter;
    if (["Bride side", "Groom side"].includes(filter)) return g.side === filter;
    return g.segment === filter;
  });

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(g: GuestData) {
    setEditing(g);
    setModalOpen(true);
  }
  async function confirmDelete() {
    if (!deleting) return;
    setDelLoading(true);
    await mutate("DELETE", `/api/guests/${deleting.id}`);
    setDelLoading(false);
    setDeleting(null);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Guests"
        subtitle="Manage your guest list, RSVP updates, invited events and notes."
        action={<Button onClick={openAdd} icon={<Plus className="h-4 w-4" />}>Add guest</Button>}
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total guests" value={summary.total} icon={<Users className="h-5 w-5" />} tone="gold" />
          <StatCard label="Accepted" value={summary.accepted} icon={<UserCheck className="h-5 w-5" />} tone="sage" />
          <StatCard label="Pending RSVP" value={summary.pending} icon={<Clock className="h-5 w-5" />} tone="amber" />
          <StatCard label="Declined" value={summary.declined} icon={<UserMinus className="h-5 w-5" />} tone="rose" />
        </div>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-100 p-4">
            <FilterTabs options={FILTERS} value={filter} onChange={setFilter} size="sm" />
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="w-48 rounded-lg border border-gold-200/70 bg-ivory-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No guests found" message="Add your first guest to start tracking RSVPs." action={<Button onClick={openAdd} icon={<Plus className="h-4 w-4" />}>Add guest</Button>} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-2.5 font-medium">Guest</th>
                    <th className="px-4 py-2.5 font-medium">Contact</th>
                    <th className="px-4 py-2.5 font-medium">Side</th>
                    <th className="px-4 py-2.5 font-medium">RSVP</th>
                    <th className="px-4 py-2.5 font-medium">Invited events</th>
                    <th className="px-4 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id} className="group border-b border-gold-50 transition hover:bg-ivory-50/60">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-ink">{g.name}</p>
                        {g.notes && <p className="text-xs text-ink-muted">{g.notes}</p>}
                      </td>
                      <td className="px-4 py-2.5 text-ink-light">
                        <p>{g.phone}</p>
                        <p className="text-xs text-ink-muted">{g.email}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="text-ink-light">{g.side}</p>
                        <p className="text-xs text-ink-muted">{g.segment}</p>
                      </td>
                      <td className="px-4 py-2.5"><StatusChip status={g.rsvpStatus} /></td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {g.eventIds.slice(0, 3).map((id) => (
                            <Chip key={id} tone="gold">{eventName(id)}</Chip>
                          ))}
                          {g.eventIds.length > 3 && <Chip tone="slate">+{g.eventIds.length - 3}</Chip>}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button onClick={() => openEdit(g)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setDeleting(g)} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-2.5 text-xs text-ink-muted">Showing {filtered.length} of {w.guests.length} guests</div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 text-base font-semibold">RSVP overview</h3>
            <RsvpRow label="Accepted" value={summary.accepted} total={summary.total} tone="bg-sage-text" />
            <RsvpRow label="Pending" value={summary.pending} total={summary.total} tone="bg-amberc-ring" />
            <RsvpRow label="Declined" value={summary.declined} total={summary.total} tone="bg-rose-ring" />
          </Card>
          <Card>
            <h3 className="mb-3 text-base font-semibold">Guest segments</h3>
            <div className="space-y-2">
              {Object.entries(segs.bySegment).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              <div className="my-2 h-px bg-gold-100" />
              {Object.entries(segs.bySide).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <GuestModal open={modalOpen} onClose={() => setModalOpen(false)} guest={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete guest?"
        message={`Remove ${deleting?.name} from your guest list? This also updates RSVP totals and event counts.`}
        confirmLabel="Delete"
        danger
        loading={delLoading}
      />
    </div>
  );
}

function RsvpRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-ink-light">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-300">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

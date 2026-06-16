"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea, Select, Checkbox } from "@/components/ui/fields";
import { useStore, useWedding } from "@/lib/store";
import { GuestData } from "@/lib/types";

const SIDES = ["Bride side", "Groom side"];
const SEGMENTS = ["Family", "Friends", "Work", "Family Friends", "Other"];
const RSVP = ["Accepted", "Pending", "Declined"];

export function GuestModal({ open, onClose, guest }: { open: boolean; onClose: () => void; guest?: GuestData | null }) {
  const wedding = useWedding();
  const mutate = useStore((s) => s.mutate);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => init(guest));

  // re-init when guest changes
  const [lastId, setLastId] = useState(guest?.id ?? "new");
  if ((guest?.id ?? "new") !== lastId) {
    setLastId(guest?.id ?? "new");
    setForm(init(guest));
  }

  function set<K extends keyof ReturnType<typeof init>>(k: K, v: ReturnType<typeof init>[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function toggleEvent(id: string) {
    set("eventIds", form.eventIds.includes(id) ? form.eventIds.filter((e) => e !== id) : [...form.eventIds, id]);
  }

  async function save() {
    setSaving(true);
    try {
      if (guest) await mutate("PATCH", `/api/guests/${guest.id}`, form);
      else await mutate("POST", "/api/guests", form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={guest ? "Edit guest" : "Add guest"}
      subtitle="Added once — RSVP totals and event counts update automatically."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={saving}>{guest ? "Save guest" : "Add guest"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required>
          <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sunita Mehra" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Email"><TextInput value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" /></Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Side"><Select value={form.side} onChange={(e) => set("side", e.target.value)} options={SIDES} /></Field>
          <Field label="Segment"><Select value={form.segment} onChange={(e) => set("segment", e.target.value)} options={SEGMENTS} /></Field>
          <Field label="RSVP"><Select value={form.rsvpStatus} onChange={(e) => set("rsvpStatus", e.target.value)} options={RSVP} /></Field>
        </div>
        <Field label="Invited events" hint="Controls each event's guest count.">
          <div className="flex flex-wrap gap-2">
            {wedding.events.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleEvent(e.id)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  form.eventIds.includes(e.id)
                    ? "border-gold-400 bg-gold-50 text-gold-700"
                    : "border-gold-200/70 bg-white text-ink-muted hover:bg-ivory-100"
                }`}
              >
                {e.name}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Vegetarian, VIP seating" /></Field>
      </div>
    </Modal>
  );
}

function init(g?: GuestData | null) {
  return {
    name: g?.name ?? "",
    phone: g?.phone ?? "",
    email: g?.email ?? "",
    side: (g?.side ?? "Bride side") as string,
    segment: (g?.segment ?? "Family") as string,
    rsvpStatus: (g?.rsvpStatus ?? "Pending") as string,
    notes: g?.notes ?? "",
    eventIds: g?.eventIds ?? [],
  };
}

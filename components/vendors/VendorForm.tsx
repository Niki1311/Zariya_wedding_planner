"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, useWedding } from "@/lib/store";
import { VendorData, VENDOR_CATEGORIES, CONTRACT_STATUSES, PAYMENT_STATUSES } from "@/lib/types";
import { Card, SectionTitle, Chip, StatusChip } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea, Select, Checkbox } from "@/components/ui/fields";
import { Building2, Phone, FileText, CalendarHeart, StickyNote, Lightbulb, ArrowLeft } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function VendorForm({ vendor }: { vendor?: VendorData | null }) {
  const wedding = useWedding();
  const router = useRouter();
  const mutate = useStore((s) => s.mutate);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => init(vendor));

  function set<K extends keyof ReturnType<typeof init>>(k: K, v: ReturnType<typeof init>[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function toggleEvent(id: string) {
    set("eventIds", form.eventIds.includes(id) ? form.eventIds.filter((e) => e !== id) : [...form.eventIds, id]);
  }

  async function save() {
    setSaving(true);
    try {
      const body = { ...form, totalAgreed: parseFloat(form.totalAgreed as string) || 0, advanceAmount: parseFloat(form.advanceAmount as string) || 0 };
      if (vendor) await mutate("PATCH", `/api/vendors/${vendor.id}`, body);
      else await mutate("POST", "/api/vendors", body);
      router.push("/app/vendors");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/app/vendors" className="flex items-center gap-1 hover:text-gold-700"><ArrowLeft className="h-4 w-4" /> Vendors</Link>
        <span>/</span>
        <span className="text-ink">{vendor ? "Edit vendor" : "Add new vendor"}</span>
      </div>
      <h1 className="mb-6 font-serif text-3xl font-semibold">{vendor ? "Edit vendor" : "Add new vendor"}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <Card>
            <SectionTitle title="Basic details" icon={<Building2 className="h-5 w-5" />} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vendor name" required><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. The Grand Udaipur" /></Field>
              <Field label="Category"><Select value={form.category} onChange={(e) => set("category", e.target.value)} options={VENDOR_CATEGORIES as unknown as string[]} /></Field>
              <Field label="Business / brand name"><TextInput value={form.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
              <Field label="Service city"><TextInput value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Udaipur" /></Field>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Contact information" icon={<Phone className="h-5 w-5" />} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact person"><TextInput value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} /></Field>
              <Field label="Preferred communication"><Select value={form.prefComm} onChange={(e) => set("prefComm", e.target.value)} options={["Call", "WhatsApp", "Email"]} /></Field>
              <Field label="Phone number"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Email address"><TextInput value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Alternate contact"><TextInput value={form.altContact} onChange={(e) => set("altContact", e.target.value)} /></Field>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Contract & payment" icon={<FileText className="h-5 w-5" />} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contract status"><Select value={form.contractStatus} onChange={(e) => set("contractStatus", e.target.value)} options={CONTRACT_STATUSES as unknown as string[]} /></Field>
              <Field label="Payment status"><Select value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)} options={PAYMENT_STATUSES as unknown as string[]} /></Field>
              <Field label="Total agreed amount (₹)" hint={form.totalAgreed ? formatINR(parseFloat(form.totalAgreed as string)) : undefined}><TextInput type="number" value={form.totalAgreed} onChange={(e) => set("totalAgreed", e.target.value)} /></Field>
              <Field label="Advance amount (₹)"><TextInput type="number" value={form.advanceAmount} onChange={(e) => set("advanceAmount", e.target.value)} /></Field>
              <Field label="Next payment due date"><TextInput type="date" value={form.nextDueDate} onChange={(e) => set("nextDueDate", e.target.value)} /></Field>
            </div>
          </Card>

          <Card>
            <SectionTitle title="Preferred events served" icon={<CalendarHeart className="h-5 w-5" />} subtitle="Linking an event makes this vendor appear on that event's detail page." />
            <div className="flex flex-wrap gap-2">
              {wedding.events.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleEvent(e.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    form.eventIds.includes(e.id) ? "border-gold-400 bg-gold-50 text-gold-700" : "border-gold-200/70 bg-white text-ink-muted hover:bg-ivory-100"
                  }`}
                >
                  {e.name}
                </button>
              ))}
              {wedding.events.length === 0 && <p className="text-sm text-ink-muted">Add events first to link them.</p>}
            </div>
          </Card>

          <Card>
            <SectionTitle title="Notes & preferences" icon={<StickyNote className="h-5 w-5" />} />
            <TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any details to remember about this vendor..." />
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold"><Lightbulb className="h-4 w-4 text-gold-500" /> Quick tips</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>• Add each vendor once — it&apos;s reused across Budget, Payments, Events & Dashboard.</li>
              <li>• Enter the agreed amount to track budget health automatically.</li>
              <li>• Link events to show this vendor on those event pages.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 text-base font-semibold">Vendor preview</h3>
            <p className="font-serif text-lg font-semibold">{form.name || "New vendor"}</p>
            <p className="text-sm text-ink-muted">{form.category}{form.city ? ` · ${form.city}` : ""}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusChip status={form.contractStatus} />
              <StatusChip status={form.paymentStatus} />
            </div>
            {parseFloat(form.totalAgreed as string) > 0 && (
              <p className="mt-3 text-sm">Agreed: <span className="font-semibold">{formatINR(parseFloat(form.totalAgreed as string))}</span></p>
            )}
          </Card>
          <div className="sticky bottom-4 space-y-2">
            <Button onClick={save} loading={saving} className="w-full">{vendor ? "Save vendor" : "Save vendor"}</Button>
            <Link href="/app/vendors"><Button variant="ghost" className="w-full">Cancel</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function init(v?: VendorData | null) {
  return {
    name: v?.name ?? "",
    category: v?.category ?? "Venue",
    brand: v?.brand ?? "",
    city: v?.city ?? "",
    contactPerson: v?.contactPerson ?? "",
    phone: v?.phone ?? "",
    email: v?.email ?? "",
    altContact: v?.altContact ?? "",
    prefComm: v?.prefComm ?? "Call",
    contractStatus: v?.contractStatus ?? "Not contacted",
    paymentStatus: v?.paymentStatus ?? "Unpaid",
    totalAgreed: (v?.totalAgreed ?? "").toString(),
    advanceAmount: (v?.advanceAmount ?? "").toString(),
    nextDueDate: v?.nextDueDate ? v.nextDueDate.slice(0, 10) : "",
    notes: v?.notes ?? "",
    eventIds: v?.eventIds ?? [],
  };
}

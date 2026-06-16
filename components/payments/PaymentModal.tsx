"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea, Select } from "@/components/ui/fields";
import { useStore, useWedding } from "@/lib/store";
import { PaymentData, PAYMENT_METHODS, BUDGET_CATEGORY_NAMES } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const STATUSES = ["Due", "Paid", "Overdue"];

export function PaymentModal({
  open,
  onClose,
  payment,
  defaultVendorId,
}: {
  open: boolean;
  onClose: () => void;
  payment?: PaymentData | null;
  defaultVendorId?: string;
}) {
  const wedding = useWedding();
  const mutate = useStore((s) => s.mutate);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => init(payment, defaultVendorId));
  const [lastId, setLastId] = useState(payment?.id ?? "new");
  if ((payment?.id ?? "new") !== lastId) {
    setLastId(payment?.id ?? "new");
    setForm(init(payment, defaultVendorId));
  }

  function set<K extends keyof ReturnType<typeof init>>(k: K, v: ReturnType<typeof init>[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    try {
      const body = { ...form, amount: parseFloat(form.amount as string) || 0 };
      if (payment) await mutate("PATCH", `/api/payments/${payment.id}`, body);
      else await mutate("POST", "/api/payments", body);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const vendorOptions = [{ value: "", label: "— No vendor —" }, ...wedding.vendors.map((v) => ({ value: v.id, label: v.name }))];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={payment ? "Update payment" : "Add payment"}
      subtitle="Updates budget health and vendor status automatically."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={saving}>{payment ? "Save payment" : "Add payment"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vendor"><Select value={form.vendorId} onChange={(e) => set("vendorId", e.target.value)} options={vendorOptions} /></Field>
          <Field label="Category"><Select value={form.category} onChange={(e) => set("category", e.target.value)} options={BUDGET_CATEGORY_NAMES as unknown as string[]} /></Field>
        </div>
        <Field label="Purpose"><TextInput value={form.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="e.g. Venue booking deposit" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount (₹)" hint={form.amount ? formatINR(parseFloat(form.amount as string)) : undefined}>
            <TextInput type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" />
          </Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => set("status", e.target.value)} options={STATUSES} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Due date"><TextInput type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} /></Field>
          {form.status === "Paid" ? (
            <Field label="Paid date"><TextInput type="date" value={form.paidDate} onChange={(e) => set("paidDate", e.target.value)} /></Field>
          ) : (
            <div />
          )}
        </div>
        {form.status === "Paid" && (
          <Field label="Payment method"><Select value={form.method} onChange={(e) => set("method", e.target.value)} options={PAYMENT_METHODS as unknown as string[]} /></Field>
        )}
        <Field label="Notes"><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function init(p?: PaymentData | null, defaultVendorId?: string) {
  const iso = (d: string | null | undefined) => (d ? d.slice(0, 10) : "");
  return {
    vendorId: p?.vendorId ?? defaultVendorId ?? "",
    category: p?.category ?? "Miscellaneous",
    purpose: p?.purpose ?? "",
    amount: (p?.amount ?? "").toString(),
    dueDate: iso(p?.dueDate),
    paidDate: iso(p?.paidDate),
    method: p?.method ?? "Bank transfer",
    status: p?.status ?? "Due",
    notes: p?.notes ?? "",
  };
}

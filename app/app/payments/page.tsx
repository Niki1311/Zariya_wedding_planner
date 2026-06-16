"use client";

import { useState } from "react";
import { useWedding, useStore } from "@/lib/store";
import { upcomingPayments, paidPayments, vendorWiseDues, pendingBalancesByType } from "@/lib/selectors";
import { PaymentData } from "@/lib/types";
import { PageTitle, Card, SectionTitle, PriorityChip, Chip, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { FadeIn } from "@/components/ui/motion";
import { formatINR, formatDate } from "@/lib/utils";
import { Plus, Clock, CheckCircle2, CircleDollarSign, Pencil, Trash2, Check } from "lucide-react";

export default function PaymentsPage() {
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const upcoming = upcomingPayments(w);
  const paid = paidPayments(w);
  const dues = vendorWiseDues(w);
  const pending = pendingBalancesByType(w);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentData | null>(null);
  const [deleting, setDeleting] = useState<PaymentData | null>(null);
  const [delLoading, setDelLoading] = useState(false);

  function add() { setEditing(null); setModalOpen(true); }
  function edit(p: PaymentData) { setEditing(p); setModalOpen(true); }
  async function markPaid(p: PaymentData) { await mutate("PATCH", `/api/payments/${p.id}`, { status: "Paid" }); }
  async function confirmDelete() {
    if (!deleting) return;
    setDelLoading(true);
    await mutate("DELETE", `/api/payments/${deleting.id}`);
    setDelLoading(false);
    setDeleting(null);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Payments"
        subtitle="Track what is due, what's pending, and what's been paid — all in one place."
        action={<Button onClick={add} icon={<Plus className="h-4 w-4" />}>Add payment</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_19rem]">
        <div className="space-y-6">
          {/* Upcoming */}
          <Card className="p-0">
            <div className="border-b border-gold-100 p-4"><SectionTitle title="Upcoming payments" icon={<Clock className="h-5 w-5" />} className="mb-0" /></div>
            {upcoming.length === 0 ? (
              <div className="p-6"><EmptyState title="No upcoming payments" message="Add a payment to start tracking dues." /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-2.5 font-medium">Vendor</th><th className="px-4 py-2.5 font-medium">Purpose</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th><th className="px-4 py-2.5 font-medium">Due</th>
                    <th className="px-4 py-2.5 font-medium">Priority</th><th className="px-4 py-2.5"></th>
                  </tr></thead>
                  <tbody>
                    {upcoming.map((p) => (
                      <tr key={p.id} className="group border-b border-gold-50 hover:bg-ivory-50/60">
                        <td className="px-4 py-2.5 font-medium">{p.vendorName}</td>
                        <td className="px-4 py-2.5 text-ink-light">{p.purpose || "—"}</td>
                        <td className="px-4 py-2.5 text-right font-medium">{formatINR(p.amount, { compact: true })}</td>
                        <td className="px-4 py-2.5">{p.dueDate ? formatDate(p.dueDate) : "—"} {p.overdue && <Chip tone="rose">Overdue</Chip>}</td>
                        <td className="px-4 py-2.5"><PriorityChip priority={p.priority} /></td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                            <button title="Mark paid" onClick={() => markPaid(p)} className="rounded-lg p-1.5 text-ink-muted hover:bg-sage-bg hover:text-sage-text"><Check className="h-4 w-4" /></button>
                            <button title="Edit" onClick={() => edit(p)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><Pencil className="h-4 w-4" /></button>
                            <button title="Delete" onClick={() => setDeleting(p)} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Vendor-wise dues */}
          <Card className="p-0">
            <div className="border-b border-gold-100 p-4"><SectionTitle title="Vendor-wise dues" icon={<CircleDollarSign className="h-5 w-5" />} className="mb-0" /></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5 font-medium">Vendor</th><th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 text-right font-medium">Committed</th><th className="px-4 py-2.5 text-right font-medium">Paid</th>
                  <th className="px-4 py-2.5 text-right font-medium">Balance</th><th className="px-4 py-2.5 font-medium">Next due</th>
                </tr></thead>
                <tbody>
                  {dues.map((d) => (
                    <tr key={d.vendorId} className="border-b border-gold-50">
                      <td className="px-4 py-2.5 font-medium">{d.vendor}</td>
                      <td className="px-4 py-2.5 text-ink-light">{d.category}</td>
                      <td className="px-4 py-2.5 text-right">{formatINR(d.committed, { compact: true })}</td>
                      <td className="px-4 py-2.5 text-right text-sage-text">{formatINR(d.paid, { compact: true })}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{formatINR(d.balance, { compact: true })}</td>
                      <td className="px-4 py-2.5 text-ink-light">{d.nextDue ? formatDate(d.nextDue) : "—"}</td>
                    </tr>
                  ))}
                  {dues.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-ink-muted">No vendor dues yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Paid */}
          <Card className="p-0">
            <div className="border-b border-gold-100 p-4"><SectionTitle title="Paid payments" icon={<CheckCircle2 className="h-5 w-5" />} className="mb-0" /></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5 font-medium">Paid date</th><th className="px-4 py-2.5 font-medium">Vendor</th>
                  <th className="px-4 py-2.5 font-medium">Purpose</th><th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Method</th><th className="px-4 py-2.5"></th>
                </tr></thead>
                <tbody>
                  {paid.map((p) => (
                    <tr key={p.id} className="group border-b border-gold-50 hover:bg-ivory-50/60">
                      <td className="px-4 py-2.5">{p.paidDate ? formatDate(p.paidDate) : "—"}</td>
                      <td className="px-4 py-2.5 font-medium">{p.vendorName}</td>
                      <td className="px-4 py-2.5 text-ink-light">{p.purpose || "—"}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{formatINR(p.amount, { compact: true })}</td>
                      <td className="px-4 py-2.5"><Chip tone="sage">{p.method || "—"}</Chip></td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                          <button title="Edit" onClick={() => edit(p)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><Pencil className="h-4 w-4" /></button>
                          <button title="Delete" onClick={() => setDeleting(p)} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paid.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-ink-muted">No paid payments yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Pending balances */}
        <div className="space-y-4">
          <Card>
            <SectionTitle title="Pending balances" className="mb-3" />
            <p className="mb-3 font-serif text-2xl font-semibold text-gold-700">{formatINR(pending.total, { compact: true })}</p>
            <div className="space-y-3">
              {Object.entries(pending.groups).map(([k, v]) => {
                const pct = pending.total > 0 ? (v / pending.total) * 100 : 0;
                return (
                  <div key={k}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-ink-light">{k}</span><span className="font-medium">{formatINR(v, { compact: true })}</span></div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-300"><div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} payment={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Delete payment?" message="This payment will be removed and budget/vendor status recalculated." confirmLabel="Delete" danger loading={delLoading} />
    </div>
  );
}

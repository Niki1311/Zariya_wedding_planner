"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding, useStore } from "@/lib/store";
import { budgetCategoryStats } from "@/lib/selectors";
import { Card, Chip, ProgressBar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput } from "@/components/ui/fields";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { formatINR, formatDate } from "@/lib/utils";
import { ArrowLeft, MoreVertical, ChevronDown, Plus } from "lucide-react";

export default function BudgetCategoriesPage() {
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const cats = budgetCategoryStats(w);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editCat, setEditCat] = useState<{ id: string; name: string; estimated: number } | null>(null);
  const [editVal, setEditVal] = useState("");
  const [toActual, setToActual] = useState<{ id: string; name: string; actual: number } | null>(null);
  const [actualLoading, setActualLoading] = useState(false);
  const [payCat, setPayCat] = useState<string | null>(null);

  async function saveEstimate() {
    if (!editCat) return;
    await mutate("PATCH", `/api/budget-categories/${editCat.id}`, { estimatedAmount: parseFloat(editVal) || 0 });
    setEditCat(null);
  }
  async function applyToActual() {
    if (!toActual) return;
    setActualLoading(true);
    await mutate("PATCH", `/api/budget-categories/${toActual.id}`, { estimatedAmount: toActual.actual });
    setActualLoading(false);
    setToActual(null);
  }

  return (
    <div className="mx-auto max-w-7xl" onClick={() => setMenuId(null)}>
      <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/app/budget" className="flex items-center gap-1 hover:text-gold-700"><ArrowLeft className="h-4 w-4" /> Budget</Link>
        <span>/</span><span className="text-ink">All categories</span>
      </div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">All categories</h1>
      <p className="mb-6 text-sm text-ink-muted">Explore every budget category in detail.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {cats.map((c) => {
          const payments = w.payments.filter((p) => (p.category || "Miscellaneous") === c.name);
          const ratio = c.estimated > 0 ? Math.min(100, (c.actual / c.estimated) * 100) : c.actual > 0 ? 100 : 0;
          return (
            <Card key={c.id} className="p-0">
              <div className="flex items-start justify-between p-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{c.name}</h3>
                  <p className="text-xs text-ink-muted">{c.primaryVendor ? c.primaryVendor.name : "No primary vendor"}</p>
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setMenuId(menuId === c.id ? null : c.id)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200"><MoreVertical className="h-4 w-4" /></button>
                  {menuId === c.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gold-100 bg-white py-1 shadow-lift">
                      <MenuBtn label="Edit estimated budget" onClick={() => { setEditCat({ id: c.id, name: c.name, estimated: c.estimated }); setEditVal(c.estimated.toString()); setMenuId(null); }} />
                      {c.over && <MenuBtn label="Update budget to actual" onClick={() => { setToActual({ id: c.id, name: c.name, actual: c.actual }); setMenuId(null); }} highlight />}
                      <MenuBtn label="Add payment" onClick={() => { setPayCat(c.name); setMenuId(null); }} />
                      <MenuBtn label={expanded === c.id ? "Hide details" : "View linked vendors"} onClick={() => { setExpanded(expanded === c.id ? null : c.id); setMenuId(null); }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <Amt label="Estimated" value={c.estimated} />
                  <Amt label="Actual" value={c.actual} tone={c.over ? "text-rose-text" : "text-ink"} />
                  <Amt label="Paid" value={c.paid} tone="text-sage-text" />
                  <Amt label="Pending" value={c.pending} tone="text-amberc-text" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar value={ratio} tone={c.over ? "rose" : "gold"} className="flex-1" />
                  {c.over ? <Chip tone="rose">+{formatINR(c.overBy, { compact: true })}</Chip> : <Chip tone="sage">On track</Chip>}
                </div>
              </div>

              <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="mt-3 flex w-full items-center justify-center gap-1 border-t border-gold-50 py-2 text-xs text-ink-muted hover:bg-ivory-50">
                {expanded === c.id ? "Hide" : "Details"} <ChevronDown className={`h-3.5 w-3.5 transition ${expanded === c.id ? "rotate-180" : ""}`} />
              </button>

              {expanded === c.id && (
                <div className="space-y-3 border-t border-gold-50 bg-ivory-50/40 p-4 text-sm">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Linked vendors</p>
                    {c.vendors.length === 0 ? <p className="text-ink-muted">None</p> : c.vendors.map((v) => (
                      <Link key={v.id} href={`/app/vendors/${v.id}/edit`} className="flex justify-between py-0.5 hover:text-gold-700">
                        <span>{v.name}</span><span className="font-medium">{formatINR(v.amount, { compact: true })}</span>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Payment schedule</p>
                    {payments.length === 0 ? <p className="text-ink-muted">No payments</p> : payments.map((p) => (
                      <div key={p.id} className="flex justify-between py-0.5">
                        <span className="text-ink-light">{p.purpose || "Payment"} · {p.status}</span>
                        <span className="font-medium">{formatINR(p.amount, { compact: true })} {p.dueDate ? `· ${formatDate(p.dueDate)}` : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit estimate modal */}
      <Modal open={!!editCat} onClose={() => setEditCat(null)} title={`Edit estimated budget — ${editCat?.name}`}
        footer={<><Button variant="ghost" onClick={() => setEditCat(null)}>Cancel</Button><Button onClick={saveEstimate}>Save</Button></>}>
        <Field label="Estimated amount (₹)" hint={editVal ? formatINR(parseFloat(editVal)) : undefined}>
          <TextInput type="number" value={editVal} onChange={(e) => setEditVal(e.target.value)} />
        </Field>
      </Modal>

      <ConfirmDialog
        open={!!toActual}
        onClose={() => setToActual(null)}
        onConfirm={applyToActual}
        title="Update budget to actual?"
        message={<>This sets <b>{toActual?.name}</b>&apos;s estimated budget to its actual amount of <b>{formatINR(toActual?.actual ?? 0)}</b>, removing the over-budget warning. Payment records stay the same.</>}
        confirmLabel="Update budget"
        loading={actualLoading}
      />

      <PaymentModal open={!!payCat} onClose={() => setPayCat(null)} />
    </div>
  );
}

function Amt({ label, value, tone = "text-ink" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg bg-ivory-50/70 p-2">
      <p className="text-[0.65rem] text-ink-muted">{label}</p>
      <p className={`font-serif text-sm font-semibold ${tone}`}>{formatINR(value, { compact: true })}</p>
    </div>
  );
}
function MenuBtn({ label, onClick, highlight }: { label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button onClick={onClick} className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-ivory-100 ${highlight ? "font-medium text-gold-700" : "text-ink-light"}`}>
      {label}
    </button>
  );
}

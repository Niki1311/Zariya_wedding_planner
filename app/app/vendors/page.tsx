"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding, useStore } from "@/lib/store";
import { vendorSummary, vendorBalance } from "@/lib/selectors";
import { VendorData, CONTRACT_STATUSES, PAYMENT_STATUSES, VENDOR_CATEGORIES } from "@/lib/types";
import { PageTitle, Card, StatCard, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { FadeIn } from "@/components/ui/motion";
import { formatINR } from "@/lib/utils";
import { Store, CheckCircle2, Clock, Receipt, Plus, Pencil, Trash2, Search, IndianRupee } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All vendors" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Pending", label: "Pending" },
  { value: "In review", label: "In review" },
  { value: "paymentdue", label: "Payment due" },
];

export default function VendorsPage() {
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const summary = vendorSummary(w);
  const [filter, setFilter] = useState("all");
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [payVendor, setPayVendor] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<VendorData | null>(null);
  const [delLoading, setDelLoading] = useState(false);

  const filtered = w.vendors.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.contactPerson.toLowerCase().includes(search.toLowerCase())) return false;
    if (cat !== "all" && v.category !== cat) return false;
    if (filter === "all") return true;
    if (filter === "paymentdue") return ["Advance due", "Overdue", "Partial paid", "Unpaid"].includes(v.paymentStatus) && v.totalAgreed > 0;
    return v.contractStatus === filter;
  });

  const catCounts = VENDOR_CATEGORIES.map((c) => ({ name: c, count: w.vendors.filter((v) => v.category === c).length })).filter((c) => c.count > 0);

  async function quickPatch(id: string, data: Record<string, unknown>) {
    await mutate("PATCH", `/api/vendors/${id}`, data);
  }
  async function confirmDelete() {
    if (!deleting) return;
    setDelLoading(true);
    await mutate("DELETE", `/api/vendors/${deleting.id}`);
    setDelLoading(false);
    setDeleting(null);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Vendors"
        subtitle="Manage vendor contacts, contracts, payments and event links."
        action={<Link href="/app/vendors/new"><Button icon={<Plus className="h-4 w-4" />}>Add new vendor</Button></Link>}
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total vendors" value={summary.total} icon={<Store className="h-5 w-5" />} tone="gold" />
          <StatCard label="Contracts confirmed" value={summary.confirmed} icon={<CheckCircle2 className="h-5 w-5" />} tone="sage" />
          <StatCard label="Pending / review" value={summary.pendingReview} icon={<Clock className="h-5 w-5" />} tone="amber" />
          <StatCard label="Payment follow-ups" value={summary.paymentFollowUps} icon={<Receipt className="h-5 w-5" />} tone="rose" />
        </div>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-100 p-4">
            <FilterTabs options={FILTERS} value={filter} onChange={setFilter} size="sm" />
            <div className="flex items-center gap-2">
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-gold-200/70 bg-ivory-50 px-2 py-1.5 text-sm outline-none focus:border-gold-400">
                <option value="all">All categories</option>
                {VENDOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-40 rounded-lg border border-gold-200/70 bg-ivory-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-gold-400" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6"><EmptyState title="No vendors found" message="Add your first vendor to start tracking contracts and payments." action={<Link href="/app/vendors/new"><Button icon={<Plus className="h-4 w-4" />}>Add new vendor</Button></Link>} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-2.5 font-medium">Vendor</th>
                    <th className="px-4 py-2.5 font-medium">Contact</th>
                    <th className="px-4 py-2.5 font-medium">Contract</th>
                    <th className="px-4 py-2.5 font-medium">Payment</th>
                    <th className="px-4 py-2.5 font-medium text-right">Balance</th>
                    <th className="px-4 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="group border-b border-gold-50 transition hover:bg-ivory-50/60">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-ink">{v.name}</p>
                        <p className="text-xs text-ink-muted">{v.category}{v.city ? ` · ${v.city}` : ""}</p>
                      </td>
                      <td className="px-4 py-2.5 text-ink-light">
                        <p>{v.contactPerson}</p>
                        <p className="text-xs text-ink-muted">{v.phone}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <select value={v.contractStatus} onChange={(e) => quickPatch(v.id, { contractStatus: e.target.value })} className="rounded-lg border border-gold-100 bg-white px-2 py-1 text-xs outline-none focus:border-gold-400">
                          {CONTRACT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <select value={v.paymentStatus} onChange={(e) => quickPatch(v.id, { paymentStatus: e.target.value })} className="rounded-lg border border-gold-100 bg-white px-2 py-1 text-xs outline-none focus:border-gold-400">
                          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium">{v.totalAgreed > 0 ? formatINR(vendorBalance(w, v), { compact: true }) : "—"}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button title="Add payment" onClick={() => setPayVendor(v.id)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><IndianRupee className="h-4 w-4" /></button>
                          <Link href={`/app/vendors/${v.id}/edit`} title="Edit" className="rounded-lg p-1.5 text-ink-muted hover:bg-ivory-200 hover:text-gold-700"><Pencil className="h-4 w-4" /></Link>
                          <button title="Delete" onClick={() => setDeleting(v)} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-bg hover:text-rose-text"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Category overview</h3>
          <div className="space-y-2">
            {catCounts.map((c) => (
              <button key={c.name} onClick={() => setCat(c.name)} className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition hover:bg-ivory-100">
                <span className="text-ink-light">{c.name}</span>
                <span className="font-medium text-gold-700">{c.count}</span>
              </button>
            ))}
            {catCounts.length === 0 && <p className="text-sm text-ink-muted">No vendors yet.</p>}
          </div>
        </Card>
      </div>

      <PaymentModal open={!!payVendor} onClose={() => setPayVendor(null)} defaultVendorId={payVendor ?? undefined} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete vendor?"
        message={`Remove ${deleting?.name}? Linked event references will be cleared. Payment records remain but are unlinked.`}
        confirmLabel="Delete"
        danger
        loading={delLoading}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell as BarCell } from "recharts";
import { useWedding } from "@/lib/store";
import { budgetSummary, budgetCategoryStats, overBudgetAlerts } from "@/lib/selectors";
import { PageTitle, Card, SectionTitle, StatCard, Chip } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/motion";
import { formatINR } from "@/lib/utils";
import { Wallet, TrendingDown, CircleDollarSign, PiggyBank, AlertTriangle, ListTree } from "lucide-react";

export default function BudgetPage() {
  const w = useWedding();
  const s = budgetSummary(w);
  const cats = budgetCategoryStats(w);
  const alerts = overBudgetAlerts(w);

  const donut = [
    { name: "Spent", value: Math.max(0, s.spent), color: "#4B7B4A" },
    { name: "Committed", value: Math.max(0, s.committed), color: "#E6C77A" },
    { name: "Remaining", value: Math.max(0, s.remaining), color: "#EFE5D3" },
  ];
  const bars = cats.filter((c) => c.estimated > 0 || c.actual > 0).map((c) => ({ name: c.name.slice(0, 4), estimated: c.estimated, actual: c.actual, over: c.over }));

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Budget health"
        subtitle="A clear view of where your wedding budget stands."
        action={<Link href="/app/budget/categories"><Button variant="ghost" icon={<ListTree className="h-4 w-4" />}>All categories</Button></Link>}
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total budget" value={formatINR(s.totalBudget, { compact: true })} icon={<Wallet className="h-5 w-5" />} tone="gold" sub="Overall planned" />
          <StatCard label="Amount spent" value={formatINR(s.spent, { compact: true })} icon={<TrendingDown className="h-5 w-5" />} tone="sage" sub="Payments paid" />
          <StatCard label="Amount committed" value={formatINR(s.committed, { compact: true })} icon={<CircleDollarSign className="h-5 w-5" />} tone="amber" sub="Confirmed unpaid" />
          <StatCard label="Remaining" value={formatINR(s.remaining, { compact: true })} icon={<PiggyBank className="h-5 w-5" />} tone={s.remaining < 0 ? "rose" : "gold"} sub="Budget − spent − committed" />
        </div>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <Card>
          <SectionTitle title="Overall budget health" />
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="none">
                  {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatINR(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-xs text-ink-muted">Total</p>
                <p className="font-serif text-xl font-semibold">{formatINR(s.totalBudget, { compact: true })}</p>
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            {donut.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                <span className="font-medium">{formatINR(d.value, { compact: true })}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Estimated vs actual" subtitle="Where actual cost runs above or below plan." />
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} barGap={2}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6E6B82" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => formatINR(v)} cursor={{ fill: "rgba(196,154,74,0.06)" }} />
                <Bar dataKey="estimated" fill="#E7D8BF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
                  {bars.map((b, i) => <BarCell key={i} fill={b.over ? "#A8473F" : "#C49A4A"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ivory-400" /> Estimated</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold-500" /> Actual</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-text" /> Over budget</span>
          </div>
        </Card>
      </div>

      {alerts.length > 0 && (
        <Card className="mt-6 border-rose-ring/40 bg-rose-bg/30">
          <SectionTitle title="Overspending alerts" icon={<AlertTriangle className="h-5 w-5 text-rose-text" />} />
          <div className="grid gap-2 sm:grid-cols-2">
            {alerts.map((a) => (
              <Link key={a.id} href="/app/budget/categories" className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-soft transition hover:shadow-card">
                <span className="text-sm font-medium text-ink">{a.name} is over budget</span>
                <Chip tone="rose">+{formatINR(a.overBy, { compact: true })}</Chip>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 p-0">
        <div className="border-b border-gold-100 p-4"><SectionTitle title="Category-wise budget" className="mb-0" /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-100 text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 text-right font-medium">Estimated</th>
                <th className="px-4 py-2.5 text-right font-medium">Actual</th>
                <th className="px-4 py-2.5 text-right font-medium">Paid</th>
                <th className="px-4 py-2.5 text-right font-medium">Pending</th>
                <th className="px-4 py-2.5 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => {
                const ratio = c.estimated > 0 ? Math.min(100, (c.actual / c.estimated) * 100) : c.actual > 0 ? 100 : 0;
                return (
                  <tr key={c.id} className="border-b border-gold-50">
                    <td className="px-4 py-2.5 font-medium text-ink">{c.name}</td>
                    <td className="px-4 py-2.5 text-right">{formatINR(c.estimated, { compact: true })}</td>
                    <td className="px-4 py-2.5 text-right">{formatINR(c.actual, { compact: true })}</td>
                    <td className="px-4 py-2.5 text-right text-sage-text">{formatINR(c.paid, { compact: true })}</td>
                    <td className="px-4 py-2.5 text-right text-amberc-text">{formatINR(c.pending, { compact: true })}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-ivory-300">
                          <div className={`h-full rounded-full ${c.over ? "bg-rose-text" : "bg-gold-500"}`} style={{ width: `${ratio}%` }} />
                        </div>
                        {c.over && <Chip tone="rose">Over</Chip>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

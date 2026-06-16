"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWedding } from "@/lib/store";
import {
  countdownDays,
  planningProgress,
  planningStatusLabel,
  guestSummary,
  attentionItems,
  sortedEvents,
  budgetSummary,
  vendorSummary,
  upcomingPayments,
} from "@/lib/selectors";
import { Card, SectionTitle, ProgressRing, Chip, PriorityChip, StatusChip } from "@/components/ui/primitives";
import { FadeIn, Stagger, StaggerItem, AnimatedNumber } from "@/components/ui/motion";
import { GuidedTour } from "@/components/workspace/GuidedTour";
import { formatINR, formatDate, formatTimeRange } from "@/lib/utils";
import {
  CalendarHeart, Users, Wallet, ArrowRight, AlertCircle, Clock, Store, Receipt, ChevronRight, CalendarDays, TrendingUp,
} from "lucide-react";

const EVENT_EMOJI: Record<string, string> = { haldi: "🌼", mehendi: "🌿", sangeet: "🎶", wedding: "💍", reception: "✨" };

export default function DashboardPage() {
  const w = useWedding();
  const router = useRouter();
  const days = countdownDays(w);
  const progress = planningProgress(w);
  const guests = guestSummary(w);
  const attention = attentionItems(w);
  const events = sortedEvents(w);
  const budget = budgetSummary(w);
  const vendors = vendorSummary(w);
  const payments = upcomingPayments(w).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <GuidedTour />

      <FadeIn>
        <h1 className="font-serif text-3xl font-semibold">
          {greeting()}, {w.user.name || w.coupleNames.split("&")[0]?.trim() || "there"} 💐
        </h1>
        <p className="text-sm text-ink-muted">Here&apos;s what&apos;s happening with your wedding, and what needs your attention next.</p>
      </FadeIn>

      {/* Top stats */}
      <Stagger className="grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <Card className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-50 text-gold-600">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Wedding countdown</p>
              <p className="font-serif text-3xl font-semibold leading-none">
                {days === null ? "—" : <><AnimatedNumber value={Math.abs(days)} /> {days >= 0 ? "days to go" : "days ago"}</>}
              </p>
            </div>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card className="flex items-center gap-4">
            <ProgressRing value={progress} size={56} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Planning progress</p>
              <p className="font-serif text-3xl font-semibold leading-none">
                <AnimatedNumber value={progress} format={(n) => `${Math.round(n)}%`} />
              </p>
              <Chip tone="sage" className="mt-1">{planningStatusLabel(progress)}</Chip>
            </div>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Link href="/app/guests">
            <Card className="flex items-center gap-4 transition hover:shadow-lift">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-bg text-sage-text">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Guest summary</p>
                <p className="font-serif text-3xl font-semibold leading-none">
                  <AnimatedNumber value={guests.accepted} /> / {guests.total}
                </p>
                <p className="text-xs text-ink-muted">accepted</p>
              </div>
            </Card>
          </Link>
        </StaggerItem>
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attention */}
        <div className="lg:col-span-2" data-tour="attention-area">
          <Card>
            <SectionTitle title="What needs your attention next" icon={<AlertCircle className="h-5 w-5" />} subtitle="Upcoming and overdue planning items" />
            {attention.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">Nothing urgent — you&apos;re all caught up ✨</p>
            ) : (
              <div className="space-y-2">
                {attention.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => router.push(a.href)}
                    className="flex w-full items-center gap-3 rounded-xl border border-gold-50 bg-ivory-50/60 px-4 py-3 text-left transition hover:border-gold-200 hover:bg-ivory-100"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-gold-600 shadow-soft">
                      {a.category === "Payments" ? <Receipt className="h-4 w-4" /> : a.category === "Budget" ? <Wallet className="h-4 w-4" /> : a.category === "Vendors" ? <Store className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{a.title}</span>
                      <span className="text-xs text-ink-muted">{a.category}{a.dueDate ? ` · Due ${formatDate(a.dueDate)}` : ""}</span>
                    </span>
                    <PriorityChip priority={a.priority} />
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Itinerary */}
        <Card>
          <SectionTitle title="Your event itinerary" icon={<CalendarHeart className="h-5 w-5" />} action={<Link href="/app/schedule" className="text-xs font-medium text-gold-700 hover:underline">View schedule</Link>} />
          <div className="space-y-2">
            {events.map((e) => (
              <Link key={e.id} href={`/app/events/${e.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-ivory-100">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-50 text-base">{EVENT_EMOJI[e.type] ?? "🎉"}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.name}</p>
                  <p className="text-xs text-ink-muted">{e.date ? formatDate(e.date) : "Date TBD"} · {formatTimeRange(e.startTime, e.endTime)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </Link>
            ))}
            {events.length === 0 && <p className="py-4 text-center text-sm text-ink-muted">No events yet.</p>}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Budget summary */}
        <Card>
          <SectionTitle title="Budget summary" icon={<Wallet className="h-5 w-5" />} action={<Link href="/app/budget" className="text-xs font-medium text-gold-700 hover:underline">View budget</Link>} />
          <div className="grid grid-cols-2 gap-3">
            <BudgetStat label="Total budget" value={budget.totalBudget} tone="text-ink" />
            <BudgetStat label="Amount spent" value={budget.spent} tone="text-sage-text" />
            <BudgetStat label="Committed" value={budget.committed} tone="text-amberc-text" />
            <BudgetStat label="Remaining" value={budget.remaining} tone={budget.remaining < 0 ? "text-rose-text" : "text-gold-700"} />
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-ivory-300">
            <div className="flex h-full">
              <div className="h-full bg-sage-text" style={{ width: `${pct(budget.spent, budget.totalBudget)}%` }} />
              <div className="h-full bg-amberc-ring" style={{ width: `${pct(budget.committed, budget.totalBudget)}%` }} />
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-ink-muted">
            <Legend color="bg-sage-text" label="Spent" />
            <Legend color="bg-amberc-ring" label="Committed" />
            <Legend color="bg-ivory-300" label="Remaining" />
          </div>
        </Card>

        {/* Vendors & payments */}
        <Card>
          <SectionTitle title="Vendors & payments" icon={<Store className="h-5 w-5" />} action={<Link href="/app/payments" className="text-xs font-medium text-gold-700 hover:underline">View payments</Link>} />
          <div className="mb-3 grid grid-cols-3 gap-2">
            <MiniCount label="Confirmed" value={vendors.confirmed} tone="sage" />
            <MiniCount label="Pending" value={vendors.pendingReview} tone="amber" />
            <MiniCount label="Follow-ups" value={vendors.paymentFollowUps} tone="rose" />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Upcoming payments</p>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-ivory-50/70 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.vendorName}</p>
                  <p className="text-xs text-ink-muted">{p.purpose || "Payment"} · {p.dueDate ? formatDate(p.dueDate) : "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formatINR(p.amount, { compact: true })}</span>
                  <PriorityChip priority={p.priority} />
                </div>
              </div>
            ))}
            {payments.length === 0 && <p className="py-3 text-center text-sm text-ink-muted">No upcoming payments.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function pct(n: number, total: number) {
  return total > 0 ? Math.max(0, Math.min(100, (n / total) * 100)) : 0;
}
function BudgetStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-ivory-50/70 p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`font-serif text-lg font-semibold ${tone}`}>{formatINR(value, { compact: true })}</p>
    </div>
  );
}
function MiniCount({ label, value, tone }: { label: string; value: number; tone: "sage" | "amber" | "rose" }) {
  const cls = tone === "sage" ? "text-sage-text" : tone === "amber" ? "text-amberc-text" : "text-rose-text";
  return (
    <div className="rounded-xl border border-gold-50 bg-ivory-50/60 p-3 text-center">
      <p className={`font-serif text-2xl font-semibold ${cls}`}>{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
    </span>
  );
}

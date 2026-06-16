import {
  WeddingData,
  EventData,
  GuestData,
  VendorData,
  PaymentData,
  TimelineTaskData,
  Priority,
} from "./types";
import { daysBetween, timeToMinutes, minutesBetween } from "./utils";

// ----- Vendor category -> Budget category mapping -----
const VENDOR_TO_BUDGET: Record<string, string> = {
  Venue: "Venue",
  Catering: "Catering",
  Decor: "Decor",
  Photography: "Photography",
  Entertainment: "Entertainment",
  Choreographer: "Entertainment",
  "Mehendi artist": "Entertainment",
  Hospitality: "Hospitality",
  Transport: "Transport",
  Makeup: "Outfits",
  Priest: "Miscellaneous",
  Other: "Miscellaneous",
};

export function budgetCategoryForVendor(v: VendorData): string {
  return VENDOR_TO_BUDGET[v.category] ?? "Miscellaneous";
}

export function budgetCategoryForPayment(p: PaymentData, vendors: VendorData[]): string {
  if (p.category) return p.category;
  if (p.vendorId) {
    const v = vendors.find((x) => x.id === p.vendorId);
    if (v) return budgetCategoryForVendor(v);
  }
  return "Miscellaneous";
}

// ----- Tasks -----
export function isOverdue(t: { status: string; dueDate: string | null }): boolean {
  if (t.status === "done" || !t.dueDate) return false;
  return new Date(t.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
}

export function resolvedTaskStatus(t: TimelineTaskData): "todo" | "inprogress" | "done" | "overdue" {
  if (t.status === "done") return "done";
  if (isOverdue(t)) return "overdue";
  return t.status;
}

export function planningProgress(w: WeddingData): number {
  const tasks = w.timelineTasks;
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

export function planningStatusLabel(pct: number): string {
  if (pct >= 80) return "Almost there";
  if (pct >= 50) return "On track";
  if (pct >= 25) return "Getting started";
  return "Just beginning";
}

export function timelineSummary(w: WeddingData) {
  const tasks = w.timelineTasks;
  const completed = tasks.filter((t) => t.status === "done").length;
  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const upcomingThisMonth = tasks.filter(
    (t) =>
      t.status !== "done" &&
      t.dueDate &&
      new Date(t.dueDate) >= now &&
      new Date(t.dueDate) <= monthEnd
  ).length;
  const overdueOrHigh = tasks.filter(
    (t) => isOverdue(t) || (t.status !== "done" && t.priority === "High")
  ).length;
  return { completed, total: tasks.length, upcomingThisMonth, overdueOrHigh };
}

export function phaseProgress(w: WeddingData, phase: string): number {
  const tasks = w.timelineTasks.filter((t) => t.phase === phase);
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);
}

// ----- Guests -----
export function guestSummary(w: WeddingData) {
  const total = w.guests.length;
  const accepted = w.guests.filter((g) => g.rsvpStatus === "Accepted").length;
  const pending = w.guests.filter((g) => g.rsvpStatus === "Pending").length;
  const declined = w.guests.filter((g) => g.rsvpStatus === "Declined").length;
  return { total, accepted, pending, declined };
}

export function guestSegments(w: WeddingData) {
  const bySide: Record<string, number> = {};
  const bySegment: Record<string, number> = {};
  for (const g of w.guests) {
    bySide[g.side] = (bySide[g.side] ?? 0) + 1;
    bySegment[g.segment] = (bySegment[g.segment] ?? 0) + 1;
  }
  return { bySide, bySegment };
}

export function eventGuestCounts(w: WeddingData, eventId: string) {
  const invited = w.guests.filter((g) => g.eventIds.includes(eventId));
  const expected = invited.filter((g) => g.rsvpStatus === "Accepted");
  return { invited: invited.length, expected: expected.length };
}

// ----- Events -----
export function eventProgress(e: EventData): number {
  if (e.checklist.length === 0) return 0;
  const done = e.checklist.filter((c) => c.status === "done").length;
  return Math.round((done / e.checklist.length) * 100);
}

export function eventPendingTasks(e: EventData): number {
  return e.checklist.filter((c) => c.status !== "done").length;
}

export function eventSortKey(e: EventData): number {
  const d = e.date ? new Date(e.date).getTime() : Number.MAX_SAFE_INTEGER / 2;
  const t = e.startTime ? timeToMinutes(e.startTime) : 0;
  return d + t * 60 * 1000;
}

export function sortedEvents(w: WeddingData): EventData[] {
  return [...w.events].sort((a, b) => eventSortKey(a) - eventSortKey(b));
}

export function eventVendors(w: WeddingData, eventId: string): VendorData[] {
  return w.vendors.filter((v) => v.eventIds.includes(eventId));
}

// ----- Vendors / Payments -----
export function paidForVendor(w: WeddingData, vendorId: string): number {
  return w.payments
    .filter((p) => p.vendorId === vendorId && p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);
}

export function vendorBalance(w: WeddingData, v: VendorData): number {
  return Math.max(0, v.totalAgreed - paidForVendor(w, v.id));
}

export function vendorSummary(w: WeddingData) {
  const total = w.vendors.length;
  const confirmed = w.vendors.filter((v) => v.contractStatus === "Confirmed").length;
  const pendingReview = w.vendors.filter((v) =>
    ["Pending", "In review", "Shortlisted"].includes(v.contractStatus)
  ).length;
  const paymentFollowUps = w.vendors.filter((v) =>
    ["Advance due", "Overdue", "Partial paid", "Unpaid"].includes(v.paymentStatus) &&
    v.totalAgreed > 0
  ).length;
  return { total, confirmed, pendingReview, paymentFollowUps };
}

export function paymentPriority(dueDate: string | null): Priority {
  if (!dueDate) return "Low";
  const days = daysBetween(new Date(), new Date(dueDate));
  if (days <= 7) return "High";
  if (days <= 15) return "Medium";
  return "Low";
}

export function upcomingPayments(w: WeddingData) {
  return w.payments
    .filter((p) => p.status !== "Paid")
    .map((p) => ({
      ...p,
      vendorName: w.vendors.find((v) => v.id === p.vendorId)?.name ?? "—",
      priority: paymentPriority(p.dueDate),
      overdue: isOverdue({ status: p.status, dueDate: p.dueDate }),
    }))
    .sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    });
}

export function paidPayments(w: WeddingData) {
  return w.payments
    .filter((p) => p.status === "Paid")
    .map((p) => ({ ...p, vendorName: w.vendors.find((v) => v.id === p.vendorId)?.name ?? "—" }))
    .sort((a, b) => {
      const ad = a.paidDate ? new Date(a.paidDate).getTime() : 0;
      const bd = b.paidDate ? new Date(b.paidDate).getTime() : 0;
      return bd - ad;
    });
}

export function vendorWiseDues(w: WeddingData) {
  return w.vendors
    .filter((v) => v.totalAgreed > 0)
    .map((v) => {
      const paid = paidForVendor(w, v.id);
      const balance = Math.max(0, v.totalAgreed - paid);
      const unpaidDue = w.payments
        .filter((p) => p.vendorId === v.id && p.status !== "Paid" && p.dueDate)
        .map((p) => p.dueDate!)
        .sort()[0];
      return {
        vendorId: v.id,
        vendor: v.name,
        category: v.category,
        committed: v.totalAgreed,
        paid,
        balance,
        nextDue: unpaidDue ?? v.nextDueDate ?? null,
      };
    })
    .sort((a, b) => b.balance - a.balance);
}

export function pendingBalancesByType(w: WeddingData) {
  const unpaid = w.payments.filter((p) => p.status !== "Paid");
  const groups = { Deposits: 0, Installments: 0, "Final settlements": 0 };
  for (const p of unpaid) {
    const t = (p.purpose + " " + p.category).toLowerCase();
    if (t.includes("deposit") || t.includes("advance")) groups.Deposits += p.amount;
    else if (t.includes("final") || t.includes("settlement") || t.includes("balance"))
      groups["Final settlements"] += p.amount;
    else groups.Installments += p.amount;
  }
  const total = groups.Deposits + groups.Installments + groups["Final settlements"];
  return { groups, total };
}

// ----- Budget -----
export function budgetCategoryStats(w: WeddingData) {
  return w.budgetCategories
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((c) => {
      const vendorsInCat = w.vendors.filter((v) => budgetCategoryForVendor(v) === c.name);
      const vendorActual = vendorsInCat.reduce((s, v) => s + v.totalAgreed, 0);
      const standalonePaid = w.payments
        .filter(
          (p) =>
            !p.vendorId &&
            budgetCategoryForPayment(p, w.vendors) === c.name
        )
        .reduce((s, p) => s + p.amount, 0);
      const actual = vendorActual + standalonePaid;
      const paid = w.payments
        .filter((p) => p.status === "Paid" && budgetCategoryForPayment(p, w.vendors) === c.name)
        .reduce((s, p) => s + p.amount, 0);
      const pending = Math.max(0, actual - paid);
      const over = actual > c.estimatedAmount && c.estimatedAmount > 0;
      const overBy = over ? actual - c.estimatedAmount : 0;
      const primaryVendor = vendorsInCat.sort((a, b) => b.totalAgreed - a.totalAgreed)[0] ?? null;
      return {
        id: c.id,
        name: c.name,
        estimated: c.estimatedAmount,
        actual,
        paid,
        pending,
        over,
        overBy,
        primaryVendor: primaryVendor ? { id: primaryVendor.id, name: primaryVendor.name } : null,
        vendors: vendorsInCat.map((v) => ({ id: v.id, name: v.name, amount: v.totalAgreed })),
      };
    });
}

export function budgetSummary(w: WeddingData) {
  const spent = w.payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const committed = w.vendors
    .filter((v) => v.contractStatus === "Confirmed")
    .reduce((s, v) => s + vendorBalance(w, v), 0);
  const totalBudget = w.totalBudget;
  const remaining = totalBudget - spent - committed;
  const totalEstimated = w.budgetCategories.reduce((s, c) => s + c.estimatedAmount, 0);
  return { totalBudget, spent, committed, remaining, totalEstimated };
}

export function overBudgetAlerts(w: WeddingData) {
  return budgetCategoryStats(w)
    .filter((c) => c.over)
    .map((c) => ({ id: c.id, name: c.name, overBy: c.overBy }))
    .sort((a, b) => b.overBy - a.overBy);
}

// ----- Countdown -----
export function countdownDays(w: WeddingData): number | null {
  if (!w.startDate) return null;
  return daysBetween(new Date(), new Date(w.startDate));
}

// ----- Master timeline blocks -----
export interface ScheduleBlock {
  id: string;
  eventId: string;
  eventName: string;
  eventType: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isSub: boolean;
}

export function scheduleBlocks(w: WeddingData): ScheduleBlock[] {
  const blocks: ScheduleBlock[] = [];
  for (const e of w.events) {
    if (!e.date) continue;
    if (e.subEvents.length > 0) {
      for (const s of e.subEvents) {
        blocks.push({
          id: s.id,
          eventId: e.id,
          eventName: e.name,
          eventType: e.type,
          title: s.title,
          date: e.date,
          startTime: s.startTime,
          endTime: s.endTime,
          isSub: true,
        });
      }
    } else if (e.startTime) {
      blocks.push({
        id: e.id,
        eventId: e.id,
        eventName: e.name,
        eventType: e.type,
        title: e.name,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime ?? e.startTime,
        isSub: false,
      });
    }
  }
  return blocks.sort((a, b) => {
    const d = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (d !== 0) return d;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
}

export function scheduleOverview(w: WeddingData) {
  const mainEvents = w.events.filter((e) => e.date && e.startTime).length;
  const subEvents = w.events.reduce((s, e) => s + e.subEvents.length, 0);
  const blocks = scheduleBlocks(w);
  let totalMinutes = 0;
  for (const b of blocks) {
    if (!b.isSub) totalMinutes += Math.max(0, minutesBetween(b.startTime, b.endTime));
  }
  // if events have no subevents counted above, use event durations
  return {
    totalEvents: mainEvents,
    mainEvents,
    subEvents,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
  };
}

// ----- Attention items (dashboard) -----
export interface AttentionItem {
  id: string;
  title: string;
  category: string;
  dueDate: string | null;
  priority: Priority;
  href: string;
}

export function attentionItems(w: WeddingData): AttentionItem[] {
  const items: AttentionItem[] = [];

  // Overdue / high priority timeline tasks
  for (const t of w.timelineTasks) {
    if (isOverdue(t)) {
      items.push({
        id: "task-" + t.id,
        title: t.text,
        category: t.category,
        dueDate: t.dueDate,
        priority: "High",
        href: "/app/timeline",
      });
    } else if (t.status !== "done" && t.priority === "High" && t.dueDate) {
      items.push({
        id: "task-" + t.id,
        title: t.text,
        category: t.category,
        dueDate: t.dueDate,
        priority: "High",
        href: "/app/timeline",
      });
    }
  }

  // Payments due soon / overdue
  for (const p of upcomingPayments(w)) {
    if (p.overdue || p.priority === "High") {
      items.push({
        id: "pay-" + p.id,
        title: `Payment due to ${p.vendorName}${p.purpose ? " — " + p.purpose : ""}`,
        category: "Payments",
        dueDate: p.dueDate,
        priority: p.overdue ? "High" : p.priority,
        href: "/app/payments",
      });
    }
  }

  // Over-budget categories
  for (const c of overBudgetAlerts(w)) {
    items.push({
      id: "budget-" + c.id,
      title: `Review over-budget category: ${c.name}`,
      category: "Budget",
      dueDate: null,
      priority: "Medium",
      href: "/app/budget",
    });
  }

  // Vendors needing confirmation
  for (const v of w.vendors) {
    if (["Pending", "In review"].includes(v.contractStatus)) {
      items.push({
        id: "vendor-" + v.id,
        title: `Confirm ${v.category.toLowerCase()} vendor: ${v.name}`,
        category: "Vendors",
        dueDate: v.nextDueDate,
        priority: "Medium",
        href: "/app/vendors",
      });
    }
  }

  const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
  return items
    .sort((a, b) => {
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    })
    .slice(0, 8);
}

// ----- Notifications -----
export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  href: string;
  tone: "amber" | "rose" | "sage" | "slate";
}

export function notifications(w: WeddingData): NotificationItem[] {
  const list: NotificationItem[] = [];

  if (w.notifyPayments) {
    for (const p of upcomingPayments(w)) {
      if (p.overdue) {
        list.push({
          id: "n-pay-" + p.id,
          type: "Payment",
          title: `Payment overdue — ${p.vendorName}`,
          detail: p.purpose || "Vendor payment pending",
          href: "/app/payments",
          tone: "rose",
        });
      } else if (p.priority === "High") {
        list.push({
          id: "n-pay-" + p.id,
          type: "Payment",
          title: `Payment due soon — ${p.vendorName}`,
          detail: p.purpose || "Due within 7 days",
          href: "/app/payments",
          tone: "amber",
        });
      }
    }
  }

  if (w.notifyTasks) {
    const overdueTasks = w.timelineTasks.filter((t) => isOverdue(t));
    for (const t of overdueTasks.slice(0, 4)) {
      list.push({
        id: "n-task-" + t.id,
        type: "Task",
        title: "Task overdue",
        detail: t.text,
        href: "/app/timeline",
        tone: "rose",
      });
    }
  }

  if (w.notifyBudget) {
    for (const c of overBudgetAlerts(w)) {
      list.push({
        id: "n-budget-" + c.id,
        type: "Budget",
        title: `${c.name} is over budget`,
        detail: "Review category spending",
        href: "/app/budget",
        tone: "rose",
      });
    }
  }

  if (w.notifyRsvp) {
    const { pending } = guestSummary(w);
    if (pending > 0) {
      list.push({
        id: "n-rsvp",
        type: "RSVP",
        title: `${pending} RSVPs pending`,
        detail: "Follow up with guests",
        href: "/app/guests",
        tone: "amber",
      });
    }
  }

  // Event checklist incomplete
  for (const e of w.events) {
    const pendingCount = eventPendingTasks(e);
    if (pendingCount >= 5) {
      list.push({
        id: "n-event-" + e.id,
        type: "Event",
        title: `${e.name} checklist incomplete`,
        detail: `${pendingCount} pending items`,
        href: `/app/events/${e.id}`,
        tone: "slate",
      });
    }
  }

  return list;
}

// ----- Global search -----
export interface SearchResult {
  group: string;
  label: string;
  sublabel: string;
  href: string;
}

export function globalSearch(w: WeddingData, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  for (const e of w.events) {
    if (e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q)) {
      results.push({ group: "Events", label: e.name, sublabel: e.location || "Event", href: `/app/events/${e.id}` });
    }
    for (const c of e.checklist) {
      if (c.text.toLowerCase().includes(q)) {
        results.push({ group: "Tasks", label: c.text, sublabel: `${e.name} checklist`, href: `/app/events/${e.id}` });
      }
    }
  }
  for (const g of w.guests) {
    if (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.notes.toLowerCase().includes(q) ||
      g.eventIds.some((id) => w.events.find((e) => e.id === id)?.name.toLowerCase().includes(q))
    ) {
      results.push({ group: "Guests", label: g.name, sublabel: `${g.side} · ${g.rsvpStatus}`, href: `/app/guests` });
    }
  }
  for (const v of w.vendors) {
    if (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.contactPerson.toLowerCase().includes(q) ||
      v.eventIds.some((id) => w.events.find((e) => e.id === id)?.name.toLowerCase().includes(q))
    ) {
      results.push({ group: "Vendors", label: v.name, sublabel: v.category, href: `/app/vendors` });
    }
  }
  for (const p of w.payments) {
    const vn = w.vendors.find((x) => x.id === p.vendorId)?.name ?? "";
    if (p.purpose.toLowerCase().includes(q) || vn.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
      results.push({ group: "Payments", label: p.purpose || vn || "Payment", sublabel: vn, href: `/app/payments` });
    }
  }
  for (const t of w.timelineTasks) {
    if (t.text.toLowerCase().includes(q)) {
      results.push({ group: "Tasks", label: t.text, sublabel: t.phase, href: `/app/timeline` });
    }
  }
  for (const c of w.budgetCategories) {
    if (c.name.toLowerCase().includes(q)) {
      results.push({ group: "Budget", label: c.name, sublabel: "Budget category", href: `/app/budget` });
    }
  }

  return results.slice(0, 30);
}

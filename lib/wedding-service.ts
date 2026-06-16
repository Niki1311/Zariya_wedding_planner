import { prisma } from "./prisma";
import { WeddingData } from "./types";

const weddingInclude = {
  user: { select: { name: true, email: true } },
  events: { include: { checklist: true, subEvents: true, vendors: true, guests: true } },
  guests: { include: { events: true } },
  vendors: { include: { events: true } },
  payments: true,
  budgetCategories: true,
  timelineTasks: true,
  eventOrder: true,
} as const;

export async function getWeddingForUser(userId: string): Promise<WeddingData | null> {
  const w = await prisma.wedding.findUnique({
    where: { userId },
    include: weddingInclude,
  });
  if (!w) return null;
  return serializeWedding(w);
}

export async function getWeddingByIdRaw(weddingId: string) {
  return prisma.wedding.findUnique({ where: { id: weddingId } });
}

/** Ensures the wedding belongs to the user; returns wedding id or throws. */
export async function requireWeddingId(userId: string): Promise<string> {
  const w = await prisma.wedding.findUnique({ where: { userId }, select: { id: true } });
  if (!w) throw new Error("No wedding found for user");
  return w.id;
}

type WeddingWithRelations = NonNullable<
  Awaited<ReturnType<typeof prisma.wedding.findUnique>>
> & Record<string, any>;

export function serializeWedding(w: WeddingWithRelations): WeddingData {
  return {
    id: w.id,
    coupleNames: w.coupleNames,
    weddingName: w.weddingName,
    location: w.location,
    startDate: w.startDate ? w.startDate.toISOString() : null,
    endDate: w.endDate ? w.endDate.toISOString() : null,
    totalBudget: w.totalBudget,
    planningPhase: w.planningPhase,
    guideCompleted: w.guideCompleted,
    onboardingDone: w.onboardingDone,
    notifyPayments: w.notifyPayments,
    notifyTasks: w.notifyTasks,
    notifyRsvp: w.notifyRsvp,
    notifyBudget: w.notifyBudget,
    user: { name: w.user?.name ?? null, email: w.user?.email ?? "" },
    eventOrder: (w.eventOrder ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((e: any) => e.name),
    events: (w.events ?? []).map((e: any) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      isCeremony: e.isCeremony,
      date: e.date ? e.date.toISOString() : null,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      description: e.description,
      notes: e.notes,
      imageKey: e.imageKey,
      position: e.position,
      checklist: (e.checklist ?? [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((c: any) => ({ id: c.id, text: c.text, status: c.status, position: c.position })),
      subEvents: (e.subEvents ?? [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((s: any) => ({
          id: s.id,
          title: s.title,
          startTime: s.startTime,
          endTime: s.endTime,
          position: s.position,
        })),
      vendorIds: (e.vendors ?? []).map((v: any) => v.vendorId),
    })),
    guests: (w.guests ?? []).map((g: any) => ({
      id: g.id,
      name: g.name,
      phone: g.phone,
      email: g.email,
      side: g.side,
      segment: g.segment,
      rsvpStatus: g.rsvpStatus,
      notes: g.notes,
      eventIds: (g.events ?? []).map((ge: any) => ge.eventId),
    })),
    vendors: (w.vendors ?? []).map((v: any) => ({
      id: v.id,
      name: v.name,
      category: v.category,
      brand: v.brand,
      city: v.city,
      contactPerson: v.contactPerson,
      phone: v.phone,
      email: v.email,
      altContact: v.altContact,
      prefComm: v.prefComm,
      contractStatus: v.contractStatus,
      paymentStatus: v.paymentStatus,
      totalAgreed: v.totalAgreed,
      advanceAmount: v.advanceAmount,
      nextDueDate: v.nextDueDate ? v.nextDueDate.toISOString() : null,
      notes: v.notes,
      eventIds: (v.events ?? []).map((ve: any) => ve.eventId),
    })),
    payments: (w.payments ?? []).map((p: any) => ({
      id: p.id,
      vendorId: p.vendorId,
      category: p.category,
      purpose: p.purpose,
      amount: p.amount,
      dueDate: p.dueDate ? p.dueDate.toISOString() : null,
      paidDate: p.paidDate ? p.paidDate.toISOString() : null,
      method: p.method,
      status: p.status,
      notes: p.notes,
    })),
    budgetCategories: (w.budgetCategories ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      estimatedAmount: c.estimatedAmount,
      position: c.position,
    })),
    timelineTasks: (w.timelineTasks ?? []).map((t: any) => ({
      id: t.id,
      text: t.text,
      phase: t.phase,
      category: t.category,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      assignee: t.assignee,
      position: t.position,
    })),
  };
}

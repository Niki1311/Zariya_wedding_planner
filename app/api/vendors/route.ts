import { getAuthWeddingId, unauthorized, ok, str, num, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const eventIds: string[] = Array.isArray(b.eventIds) ? b.eventIds : [];
  const vendor = await prisma.vendor.create({
    data: {
      weddingId,
      name: str(b.name) || "New vendor",
      category: str(b.category) || "Other",
      brand: str(b.brand),
      city: str(b.city),
      contactPerson: str(b.contactPerson),
      phone: str(b.phone),
      email: str(b.email),
      altContact: str(b.altContact),
      prefComm: str(b.prefComm) || "Call",
      contractStatus: str(b.contractStatus) || "Not contacted",
      paymentStatus: str(b.paymentStatus) || "Unpaid",
      totalAgreed: num(b.totalAgreed),
      advanceAmount: num(b.advanceAmount),
      nextDueDate: toDate(b.nextDueDate),
      notes: str(b.notes),
      events: { create: eventIds.map((eventId) => ({ eventId })) },
    },
  });
  return ok({ id: vendor.id });
}

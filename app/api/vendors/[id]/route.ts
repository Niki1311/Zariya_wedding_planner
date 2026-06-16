import { getAuthWeddingId, unauthorized, notFound, ok, str, num, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, id: string) {
  return prisma.vendor.findFirst({ where: { id, weddingId }, select: { id: true } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "category", "brand", "city", "contactPerson", "phone", "email", "altContact", "prefComm", "contractStatus", "paymentStatus", "notes"]) {
    if (k in b) data[k] = str(b[k]);
  }
  if ("totalAgreed" in b) data.totalAgreed = num(b.totalAgreed);
  if ("advanceAmount" in b) data.advanceAmount = num(b.advanceAmount);
  if ("nextDueDate" in b) data.nextDueDate = toDate(b.nextDueDate);
  await prisma.vendor.update({ where: { id: params.id }, data });
  if (Array.isArray(b.eventIds)) {
    await prisma.vendorEvent.deleteMany({ where: { vendorId: params.id } });
    await prisma.vendorEvent.createMany({ data: b.eventIds.map((eventId: string) => ({ vendorId: params.id, eventId })) });
  }
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  await prisma.vendor.delete({ where: { id: params.id } });
  return ok();
}

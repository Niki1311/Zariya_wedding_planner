import { getAuthWeddingId, unauthorized, notFound, ok, str, num, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { recomputeVendorPaymentStatus } from "@/lib/payment-status";

async function owns(weddingId: string, id: string) {
  return prisma.payment.findFirst({ where: { id, weddingId } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const existing = await owns(weddingId, params.id);
  if (!existing) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if ("vendorId" in b) data.vendorId = b.vendorId || null;
  if ("category" in b) data.category = str(b.category);
  if ("purpose" in b) data.purpose = str(b.purpose);
  if ("amount" in b) data.amount = num(b.amount);
  if ("dueDate" in b) data.dueDate = toDate(b.dueDate);
  if ("method" in b) data.method = str(b.method);
  if ("notes" in b) data.notes = str(b.notes);
  if ("status" in b) {
    data.status = str(b.status);
    if (b.status === "Paid") data.paidDate = toDate(b.paidDate) ?? new Date();
    else data.paidDate = null;
  }
  if ("paidDate" in b && !("status" in b)) data.paidDate = toDate(b.paidDate);

  await prisma.payment.update({ where: { id: params.id }, data });
  await recomputeVendorPaymentStatus((data.vendorId as string) ?? existing.vendorId);
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const existing = await owns(weddingId, params.id);
  if (!existing) return notFound();
  await prisma.payment.delete({ where: { id: params.id } });
  await recomputeVendorPaymentStatus(existing.vendorId);
  return ok();
}

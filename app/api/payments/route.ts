import { getAuthWeddingId, unauthorized, ok, str, num, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { recomputeVendorPaymentStatus } from "@/lib/payment-status";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const status = str(b.status) || (b.paidDate ? "Paid" : "Due");
  const payment = await prisma.payment.create({
    data: {
      weddingId,
      vendorId: b.vendorId || null,
      category: str(b.category) || "Miscellaneous",
      purpose: str(b.purpose),
      amount: num(b.amount),
      dueDate: toDate(b.dueDate),
      paidDate: status === "Paid" ? toDate(b.paidDate) ?? new Date() : null,
      method: str(b.method),
      status,
      notes: str(b.notes),
    },
  });
  await recomputeVendorPaymentStatus(payment.vendorId);
  return ok({ id: payment.id });
}

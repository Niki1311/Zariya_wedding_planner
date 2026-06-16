import { prisma } from "./prisma";

/** Recompute and persist a vendor's payment status from its payment records. */
export async function recomputeVendorPaymentStatus(vendorId: string | null) {
  if (!vendorId) return;
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) return;
  const payments = await prisma.payment.findMany({ where: { vendorId } });
  const paid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const now = new Date();
  const hasOverdue = payments.some(
    (p) => p.status !== "Paid" && p.dueDate && p.dueDate < now
  );

  let status = vendor.paymentStatus;
  if (vendor.totalAgreed > 0 && paid >= vendor.totalAgreed) status = "Paid";
  else if (paid > 0) status = "Partial paid";
  else if (hasOverdue) status = "Overdue";
  else if (["Paid", "Partial paid"].includes(vendor.paymentStatus)) status = "Unpaid";

  if (status !== vendor.paymentStatus) {
    await prisma.vendor.update({ where: { id: vendorId }, data: { paymentStatus: status } });
  }
}

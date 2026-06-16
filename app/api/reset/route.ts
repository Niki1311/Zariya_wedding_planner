import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized, notFound, ok } from "@/lib/api";

export async function POST() {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const wedding = await prisma.wedding.findUnique({ where: { userId } });
  if (!wedding) return notFound();

  // Clear all workspace data; cascading deletes handle children.
  await prisma.event.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.guest.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.vendor.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.payment.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.budgetCategory.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.timelineTask.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.eventTypeOrder.deleteMany({ where: { weddingId: wedding.id } });

  await prisma.wedding.update({
    where: { id: wedding.id },
    data: {
      coupleNames: "",
      weddingName: "",
      location: "",
      startDate: null,
      endDate: null,
      totalBudget: 0,
      planningPhase: "6 months before",
      onboardingDone: false,
      guideCompleted: false,
    },
  });

  return ok();
}

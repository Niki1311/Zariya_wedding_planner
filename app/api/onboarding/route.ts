import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized, notFound, ok, toDate, str, num } from "@/lib/api";
import { createDefaultTimelineTasks, createDefaultBudgetCategories, createEventWithDefaults, syncEventOrder } from "@/lib/factory";
import { typeFromName } from "@/lib/defaults";

export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const wedding = await prisma.wedding.findUnique({ where: { userId } });
  if (!wedding) return notFound();

  const b = await req.json();
  const events: string[] = Array.isArray(b.events) ? b.events.filter(Boolean) : [];

  // Update core wedding details
  await prisma.wedding.update({
    where: { id: wedding.id },
    data: {
      coupleNames: str(b.coupleNames),
      weddingName: str(b.weddingName) || `${str(b.coupleNames)}'s Wedding`,
      location: str(b.location),
      startDate: toDate(b.startDate),
      endDate: toDate(b.endDate) ?? toDate(b.startDate),
      totalBudget: num(b.totalBudget),
      planningPhase: str(b.planningPhase) || "6 months before",
      onboardingDone: true,
    },
  });

  // Fresh-start: clear any existing generated content then create defaults
  await prisma.event.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.timelineTask.deleteMany({ where: { weddingId: wedding.id } });
  await prisma.budgetCategory.deleteMany({ where: { weddingId: wedding.id } });

  let pos = 0;
  for (const name of events) {
    await createEventWithDefaults(wedding.id, {
      name,
      type: typeFromName(name),
      position: pos++,
      withRunOfShow: true,
    });
  }
  await syncEventOrder(wedding.id, events);
  await createDefaultTimelineTasks(wedding.id);
  await createDefaultBudgetCategories(wedding.id);

  return ok();
}

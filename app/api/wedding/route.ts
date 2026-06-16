import { currentUserId } from "@/lib/auth";
import { getWeddingForUser } from "@/lib/wedding-service";
import { prisma } from "@/lib/prisma";
import { unauthorized, notFound, ok, toDate, str, num } from "@/lib/api";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const w = await getWeddingForUser(userId);
  if (!w) return notFound();
  return ok(w);
}

export async function PATCH(req: Request) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();
  const w = await prisma.wedding.findUnique({ where: { userId }, select: { id: true } });
  if (!w) return notFound();
  const b = await req.json();

  const data: Record<string, unknown> = {};
  if ("coupleNames" in b) data.coupleNames = str(b.coupleNames);
  if ("weddingName" in b) data.weddingName = str(b.weddingName);
  if ("location" in b) data.location = str(b.location);
  if ("startDate" in b) data.startDate = toDate(b.startDate);
  if ("endDate" in b) data.endDate = toDate(b.endDate);
  if ("totalBudget" in b) data.totalBudget = num(b.totalBudget);
  if ("planningPhase" in b) data.planningPhase = str(b.planningPhase);
  if ("guideCompleted" in b) data.guideCompleted = !!b.guideCompleted;
  if ("onboardingDone" in b) data.onboardingDone = !!b.onboardingDone;
  if ("notifyPayments" in b) data.notifyPayments = !!b.notifyPayments;
  if ("notifyTasks" in b) data.notifyTasks = !!b.notifyTasks;
  if ("notifyRsvp" in b) data.notifyRsvp = !!b.notifyRsvp;
  if ("notifyBudget" in b) data.notifyBudget = !!b.notifyBudget;

  await prisma.wedding.update({ where: { id: w.id }, data });
  return ok();
}

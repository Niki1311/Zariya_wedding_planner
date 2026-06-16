import { getAuthWeddingId, unauthorized, notFound, ok, str, num } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, id: string) {
  return prisma.budgetCategory.findFirst({ where: { id, weddingId }, select: { id: true } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if ("name" in b) data.name = str(b.name);
  if ("estimatedAmount" in b) data.estimatedAmount = num(b.estimatedAmount);
  if ("position" in b) data.position = num(b.position);
  await prisma.budgetCategory.update({ where: { id: params.id }, data });
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  await prisma.budgetCategory.delete({ where: { id: params.id } });
  return ok();
}

import { getAuthWeddingId, unauthorized, notFound, ok, str, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, id: string) {
  return prisma.timelineTask.findFirst({ where: { id, weddingId }, select: { id: true } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["text", "phase", "category", "status", "priority"]) {
    if (k in b) data[k] = str(b[k]);
  }
  if ("dueDate" in b) data.dueDate = toDate(b.dueDate);
  if ("assignee" in b) data.assignee = b.assignee ? str(b.assignee) : null;
  await prisma.timelineTask.update({ where: { id: params.id }, data });
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  await prisma.timelineTask.delete({ where: { id: params.id } });
  return ok();
}

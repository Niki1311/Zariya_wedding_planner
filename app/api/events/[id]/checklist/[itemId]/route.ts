import { getAuthWeddingId, unauthorized, notFound, ok, str } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, eventId: string, itemId: string) {
  const item = await prisma.eventChecklistItem.findUnique({ where: { id: itemId }, include: { event: true } });
  if (!item || item.eventId !== eventId || item.event.weddingId !== weddingId) return null;
  return item;
}

export async function PATCH(req: Request, { params }: { params: { id: string; itemId: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id, params.itemId))) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if ("text" in b) data.text = str(b.text);
  if ("status" in b) data.status = str(b.status);
  await prisma.eventChecklistItem.update({ where: { id: params.itemId }, data });
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string; itemId: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id, params.itemId))) return notFound();
  await prisma.eventChecklistItem.delete({ where: { id: params.itemId } });
  return ok();
}

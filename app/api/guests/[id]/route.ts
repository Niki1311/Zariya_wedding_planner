import { getAuthWeddingId, unauthorized, notFound, ok, str } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, id: string) {
  return prisma.guest.findFirst({ where: { id, weddingId }, select: { id: true } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "phone", "email", "side", "segment", "rsvpStatus", "notes"]) {
    if (k in b) data[k] = str(b[k]);
  }
  await prisma.guest.update({ where: { id: params.id }, data });
  if (Array.isArray(b.eventIds)) {
    await prisma.guestEvent.deleteMany({ where: { guestId: params.id } });
    await prisma.guestEvent.createMany({ data: b.eventIds.map((eventId: string) => ({ guestId: params.id, eventId })) });
  }
  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  if (!(await owns(weddingId, params.id))) return notFound();
  await prisma.guest.delete({ where: { id: params.id } });
  return ok();
}

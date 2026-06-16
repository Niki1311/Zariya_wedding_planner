import { getAuthWeddingId, unauthorized, notFound, ok, toDate, str, num } from "@/lib/api";
import { prisma } from "@/lib/prisma";

async function owns(weddingId: string, id: string) {
  return prisma.event.findFirst({ where: { id, weddingId } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const event = await owns(weddingId, params.id);
  if (!event) return notFound();
  const b = await req.json();

  const data: Record<string, unknown> = {};
  if ("name" in b) data.name = str(b.name);
  if ("date" in b) data.date = toDate(b.date);
  if ("startTime" in b) data.startTime = b.startTime || null;
  if ("endTime" in b) data.endTime = b.endTime || null;
  if ("location" in b) data.location = str(b.location);
  if ("description" in b) data.description = str(b.description);
  if ("notes" in b) data.notes = str(b.notes);
  if ("position" in b) data.position = num(b.position);

  await prisma.event.update({ where: { id: params.id }, data });

  // Replace vendor links
  if (Array.isArray(b.vendorIds)) {
    await prisma.vendorEvent.deleteMany({ where: { eventId: params.id } });
    await prisma.vendorEvent.createMany({
      data: b.vendorIds.map((vendorId: string) => ({ vendorId, eventId: params.id })),
    });
  }

  // Replace sub-events (run-of-show / timeline builder)
  if (Array.isArray(b.subEvents)) {
    await prisma.subEvent.deleteMany({ where: { eventId: params.id } });
    await prisma.subEvent.createMany({
      data: b.subEvents.map((s: any, i: number) => ({
        eventId: params.id,
        title: str(s.title),
        startTime: str(s.startTime),
        endTime: str(s.endTime),
        position: i,
      })),
    });
  }

  return ok();
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const event = await owns(weddingId, params.id);
  if (!event) return notFound();
  await prisma.event.delete({ where: { id: params.id } });
  return ok();
}

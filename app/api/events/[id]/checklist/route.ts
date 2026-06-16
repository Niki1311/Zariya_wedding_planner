import { getAuthWeddingId, unauthorized, notFound, ok, str } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const event = await prisma.event.findFirst({ where: { id: params.id, weddingId } });
  if (!event) return notFound();
  const b = await req.json();
  const count = await prisma.eventChecklistItem.count({ where: { eventId: params.id } });
  const item = await prisma.eventChecklistItem.create({
    data: { eventId: params.id, text: str(b.text) || "New item", status: "todo", position: count },
  });
  return ok({ id: item.id });
}

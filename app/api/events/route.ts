import { getAuthWeddingId, unauthorized, ok, str } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createEventWithDefaults, syncEventOrder } from "@/lib/factory";
import { typeFromName } from "@/lib/defaults";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const name = str(b.name).trim();
  if (!name) return ok({ error: "Event name required" });

  const count = await prisma.event.count({ where: { weddingId } });
  const event = await createEventWithDefaults(weddingId, {
    name,
    type: typeFromName(name),
    position: count,
    withRunOfShow: true,
  });

  // Keep the event-type order list in sync (used by Settings / option lists)
  const order = await prisma.eventTypeOrder.findMany({ where: { weddingId }, orderBy: { position: "asc" } });
  const names = order.map((o) => o.name);
  if (!names.includes(name)) {
    names.push(name);
    await syncEventOrder(weddingId, names);
  }

  return ok({ id: event.id });
}

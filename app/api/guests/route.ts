import { getAuthWeddingId, unauthorized, ok, str } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const eventIds: string[] = Array.isArray(b.eventIds) ? b.eventIds : [];
  const guest = await prisma.guest.create({
    data: {
      weddingId,
      name: str(b.name) || "New guest",
      phone: str(b.phone),
      email: str(b.email),
      side: str(b.side) || "Bride side",
      segment: str(b.segment) || "Family",
      rsvpStatus: str(b.rsvpStatus) || "Pending",
      notes: str(b.notes),
      events: { create: eventIds.map((eventId) => ({ eventId })) },
    },
  });
  return ok({ id: guest.id });
}

import { getAuthWeddingId, unauthorized, ok, str, num } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const count = await prisma.budgetCategory.count({ where: { weddingId } });
  const cat = await prisma.budgetCategory.create({
    data: { weddingId, name: str(b.name) || "New category", estimatedAmount: num(b.estimatedAmount), position: count },
  });
  return ok({ id: cat.id });
}

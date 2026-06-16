import { getAuthWeddingId, unauthorized, ok, str, toDate } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const weddingId = await getAuthWeddingId();
  if (!weddingId) return unauthorized();
  const b = await req.json();
  const phase = str(b.phase) || "6 months before";
  const count = await prisma.timelineTask.count({ where: { weddingId, phase } });
  const task = await prisma.timelineTask.create({
    data: {
      weddingId,
      text: str(b.text) || "New task",
      phase,
      category: str(b.category) || "General",
      status: str(b.status) || "todo",
      priority: str(b.priority) || "Medium",
      dueDate: toDate(b.dueDate),
      assignee: b.assignee ? str(b.assignee) : null,
      position: count,
    },
  });
  return ok({ id: task.id });
}

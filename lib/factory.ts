import { prisma } from "./prisma";
import {
  checklistForType,
  runOfShowForType,
  PLANNING_CHECKLIST,
  CEREMONY_TYPES,
  typeFromName,
  EVENT_IMAGE_KEYS,
} from "./defaults";
import { BUDGET_CATEGORY_NAMES } from "./types";

export async function createDefaultTimelineTasks(weddingId: string) {
  const data: {
    weddingId: string;
    text: string;
    phase: string;
    category: string;
    position: number;
  }[] = [];
  for (const [phase, tasks] of Object.entries(PLANNING_CHECKLIST)) {
    tasks.forEach(([text, category], i) => {
      data.push({ weddingId, text, phase, category, position: i });
    });
  }
  await prisma.timelineTask.createMany({ data });
}

export async function createDefaultBudgetCategories(weddingId: string, estimates?: Record<string, number>) {
  await prisma.budgetCategory.createMany({
    data: BUDGET_CATEGORY_NAMES.map((name, i) => ({
      weddingId,
      name,
      position: i,
      estimatedAmount: estimates?.[name] ?? 0,
    })),
  });
}

export interface NewEventInput {
  name: string;
  type?: string;
  position?: number;
  date?: Date | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string;
  description?: string;
  notes?: string;
  withRunOfShow?: boolean;
}

export async function createEventWithDefaults(weddingId: string, input: NewEventInput) {
  const type = input.type ?? typeFromName(input.name);
  const checklist = checklistForType(type);
  const ros = input.withRunOfShow ? runOfShowForType(type) : [];

  const event = await prisma.event.create({
    data: {
      weddingId,
      name: input.name,
      type,
      isCeremony: CEREMONY_TYPES.includes(type),
      imageKey: EVENT_IMAGE_KEYS[type] ?? null,
      position: input.position ?? 0,
      date: input.date ?? null,
      startTime: input.startTime ?? null,
      endTime: input.endTime ?? null,
      location: input.location ?? "",
      description: input.description ?? "",
      notes: input.notes ?? "",
      checklist: {
        create: checklist.map((text, i) => ({ text, position: i, status: "todo" })),
      },
      subEvents: {
        create: ros.map((s, i) => ({
          title: s.title,
          startTime: s.startTime,
          endTime: s.endTime,
          position: i,
        })),
      },
    },
  });
  return event;
}

export async function syncEventOrder(weddingId: string, names: string[]) {
  await prisma.eventTypeOrder.deleteMany({ where: { weddingId } });
  await prisma.eventTypeOrder.createMany({
    data: names.map((name, i) => ({ weddingId, name, position: i })),
  });
}

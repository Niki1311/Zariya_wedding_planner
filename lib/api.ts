import { NextResponse } from "next/server";
import { currentUserId } from "./auth";
import { prisma } from "./prisma";

export async function getAuthWeddingId(): Promise<string | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const w = await prisma.wedding.findUnique({ where: { userId }, select: { id: true } });
  return w?.id ?? null;
}

export const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
export const notFound = () => NextResponse.json({ error: "Not found" }, { status: 404 });
export const badRequest = (msg: string) => NextResponse.json({ error: msg }, { status: 400 });
export const ok = (data?: unknown) => NextResponse.json(data ?? { ok: true });

export function toDate(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export function num(v: unknown, fallback = 0): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return typeof n === "number" && !isNaN(n) ? n : fallback;
}

export function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

/** Verify an entity row belongs to the authenticated wedding. */
export async function ownsEvent(weddingId: string, id: string) {
  return !!(await prisma.event.findFirst({ where: { id, weddingId }, select: { id: true } }));
}

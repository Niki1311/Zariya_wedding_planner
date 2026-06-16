import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian-style currency formatting (lakh/crore grouping), e.g. ₹17,50,000 */
export function formatINR(amount: number | null | undefined, opts?: { compact?: boolean }): string {
  const n = Math.round(amount ?? 0);
  if (opts?.compact) {
    const abs = Math.abs(n);
    if (abs >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
    if (abs >= 100000) return `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")} L`;
    if (abs >= 1000) return `₹${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return "₹" + n.toLocaleString("en-IN");
}

export function formatDate(date: string | Date | null | undefined, fmt: "short" | "long" | "weekday" = "short"): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  if (fmt === "long") {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  if (fmt === "weekday") {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Convert "HH:mm" (24h) into "h:mm AM/PM" */
export function formatTime(t: string | null | undefined): string {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function formatTimeRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "Time not set";
  if (start && end) return `${formatTime(start)}–${formatTime(end)}`;
  return formatTime(start || end);
}

/** Minutes between two "HH:mm" times (handles same-day only) */
export function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.setHours(0, 0, 0, 0) - new Date(from).setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function pluralize(n: number, word: string, plural?: string): string {
  return `${n} ${n === 1 ? word : plural ?? word + "s"}`;
}

export function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

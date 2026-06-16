"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding } from "@/lib/store";
import { planningProgress, resolvedTaskStatus } from "@/lib/selectors";
import { TimelineTaskData } from "@/lib/types";
import { Card, SectionTitle, ProgressRing, Chip } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/FilterTabs";
import { Modal } from "@/components/ui/Modal";
import { formatDate, cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";

const STATUS_COLOR: Record<string, string> = { done: "bg-sage-text", inprogress: "bg-amberc-ring", overdue: "bg-rose-text", todo: "bg-gold-400" };
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ymd(d: Date) { return d.toISOString().slice(0, 10); }

export default function CalendarPage() {
  const w = useWedding();
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(() => {
    const due = w.timelineTasks.filter((t) => t.dueDate).map((t) => new Date(t.dueDate!).getTime());
    const base = due.length ? new Date(Math.min(...due, Date.now())) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [dayModal, setDayModal] = useState<string | null>(null);

  const byDate = w.timelineTasks.reduce<Record<string, TimelineTaskData[]>>((acc, t) => {
    if (t.dueDate) (acc[t.dueDate.slice(0, 10)] ??= []).push(t);
    return acc;
  }, {});

  const upcoming = w.timelineTasks
    .filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 6);

  // build grid
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const days: Date[] = [];
  if (view === "month") {
    const start = new Date(monthStart);
    start.setDate(1 - monthStart.getDay());
    for (let i = 0; i < 42; i++) { days.push(new Date(start)); start.setDate(start.getDate() + 1); }
  } else {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) { days.push(new Date(start)); start.setDate(start.getDate() + 1); }
  }

  const title = view === "month" ? cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "This week";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/app/timeline" className="flex items-center gap-1 hover:text-gold-700"><ArrowLeft className="h-4 w-4" /> Timeline</Link>
        <span>/</span><span className="text-ink">Full calendar</span>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold">Full timeline</h1>
        <SegmentedControl options={[{ value: "month", label: "Month" }, { value: "week", label: "Week" }]} value={view} onChange={setView} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">{title}</h2>
            {view === "month" && (
              <div className="flex gap-1">
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-lg border border-gold-100 p-1.5 hover:bg-ivory-100"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCursor(new Date())} className="rounded-lg border border-gold-100 px-3 py-1.5 text-xs hover:bg-ivory-100">Today</button>
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-lg border border-gold-100 p-1.5 hover:bg-ivory-100"><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {DOW.map((d) => <div key={d} className="px-1 py-1 text-center text-xs font-medium text-ink-muted">{d}</div>)}
            {days.map((d, i) => {
              const key = ymd(d);
              const dayTasks = byDate[key] ?? [];
              const inMonth = view === "week" || d.getMonth() === cursor.getMonth();
              const isToday = key === ymd(new Date());
              return (
                <button
                  key={i}
                  onClick={() => dayTasks.length && setDayModal(key)}
                  className={cn(
                    "min-h-[5rem] rounded-lg border p-1.5 text-left align-top transition",
                    inMonth ? "border-gold-50 bg-white" : "border-transparent bg-ivory-100/40 text-ink-muted",
                    isToday && "ring-2 ring-gold-300",
                    dayTasks.length && "hover:border-gold-200"
                  )}
                >
                  <span className={cn("text-xs font-medium", isToday && "text-gold-700")}>{d.getDate()}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div key={t.id} className="flex items-center gap-1 truncate text-[0.65rem] text-ink-light">
                        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_COLOR[resolvedTaskStatus(t)])} />
                        <span className="truncate">{t.text}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && <span className="text-[0.6rem] font-medium text-gold-600">+{dayTasks.length - 2} more</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="text-center">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">Overall progress</h3>
            <div className="flex justify-center"><ProgressRing value={planningProgress(w)} size={88} stroke={8} /></div>
          </Card>
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Upcoming deadlines</h3>
            <div className="space-y-2">
              {upcoming.map((t) => (
                <div key={t.id} className="flex items-start gap-2">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full", STATUS_COLOR[resolvedTaskStatus(t)])} />
                  <div><p className="text-sm font-medium text-ink">{t.text}</p><p className="text-xs text-ink-muted">{formatDate(t.dueDate)}</p></div>
                </div>
              ))}
              {upcoming.length === 0 && <p className="text-sm text-ink-muted">No upcoming deadlines.</p>}
            </div>
          </Card>
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Legend</h3>
            <div className="space-y-1.5 text-sm">
              <Legend color="bg-gold-400" label="To do" />
              <Legend color="bg-amberc-ring" label="In progress" />
              <Legend color="bg-sage-text" label="Done" />
              <Legend color="bg-rose-text" label="Overdue" />
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!dayModal} onClose={() => setDayModal(null)} title={dayModal ? formatDate(dayModal, "long") : ""} subtitle="Tasks due on this day">
        <div className="space-y-2">
          {(dayModal ? byDate[dayModal] ?? [] : []).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-gold-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR[resolvedTaskStatus(t)])} />
                <span className="text-sm">{t.text}</span>
              </div>
              <Chip tone="slate">{t.phase}</Chip>
            </div>
          ))}
        </div>
        <Link href="/app/timeline" className="mt-4 block text-center text-sm font-medium text-gold-700 hover:underline">Open timeline</Link>
      </Modal>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", color)} /> {label}</span>;
}

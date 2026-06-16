"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding } from "@/lib/store";
import { scheduleBlocks, scheduleOverview, ScheduleBlock } from "@/lib/selectors";
import { Card, SectionTitle, Chip, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/FilterTabs";
import { formatDate, formatTime, formatTimeRange, timeToMinutes, cn } from "@/lib/utils";
import { Printer, CalendarRange, List, Clock, Layers } from "lucide-react";

const TYPE_TONE: Record<string, string> = {
  haldi: "bg-amberc-bg border-amberc-ring/50 text-amberc-text",
  mehendi: "bg-sage-bg border-sage-ring/50 text-sage-text",
  sangeet: "bg-gold-50 border-gold-200 text-gold-700",
  wedding: "bg-rose-bg border-rose-ring/50 text-rose-text",
  reception: "bg-slatec-bg border-slatec-ring/50 text-slatec-text",
  custom: "bg-ivory-200 border-gold-200 text-ink-light",
};

// lay overlapping blocks into columns
function layout(blocks: ScheduleBlock[]) {
  const sorted = [...blocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const cols: ScheduleBlock[][] = [];
  const placement = new Map<string, { col: number; cols: number }>();
  for (const b of sorted) {
    let placed = -1;
    for (let c = 0; c < cols.length; c++) {
      const last = cols[c][cols[c].length - 1];
      if (timeToMinutes(last.endTime) <= timeToMinutes(b.startTime)) { cols[c].push(b); placed = c; break; }
    }
    if (placed === -1) { cols.push([b]); placed = cols.length - 1; }
    placement.set(b.id, { col: placed, cols: 0 });
  }
  const total = Math.max(1, cols.length);
  sorted.forEach((b) => { const p = placement.get(b.id)!; p.cols = total; });
  return { sorted, placement, totalCols: total };
}

export default function SchedulePage() {
  const w = useWedding();
  const [view, setView] = useState("calendar");
  const blocks = scheduleBlocks(w);
  const overview = scheduleOverview(w);

  const dates = Array.from(new Set(blocks.map((b) => b.date))).sort();
  const PX = 1.1;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Master wedding timeline</h1>
          <p className="text-sm text-ink-muted">Your complete wedding-day schedule at a glance.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <SegmentedControl
            options={[{ value: "calendar", label: "Calendar", icon: <CalendarRange className="h-4 w-4" /> }, { value: "list", label: "List", icon: <List className="h-4 w-4" /> }]}
            value={view}
            onChange={setView}
          />
          <Button variant="ghost" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <EmptyState title="No schedule yet" message="Add dates, times and run-of-show to your events to build the wedding-day timeline." action={<Link href="/app/events"><Button>Go to events</Button></Link>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
          <div>
            {view === "calendar" ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dayBlocks = blocks.filter((b) => b.date === date);
                  const minT = Math.min(...dayBlocks.map((b) => timeToMinutes(b.startTime)));
                  const maxT = Math.max(...dayBlocks.map((b) => timeToMinutes(b.endTime)));
                  const height = Math.max(120, (maxT - minT) * PX + 20);
                  const { sorted, placement } = layout(dayBlocks);
                  return (
                    <div key={date} className="min-w-[15rem] flex-1">
                      <div className="mb-2 rounded-xl bg-ivory-200/60 px-3 py-2 text-center">
                        <p className="font-serif font-semibold">{formatDate(date, "weekday")}</p>
                      </div>
                      <div className="card-base relative p-2" style={{ height }}>
                        <div className="relative h-full">
                          {sorted.map((b) => {
                            const p = placement.get(b.id)!;
                            const top = (timeToMinutes(b.startTime) - minT) * PX;
                            const h = Math.max(26, (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)) * PX);
                            const wPct = 100 / p.cols;
                            return (
                              <Link
                                key={b.id}
                                href={`/app/events/${b.eventId}`}
                                className={cn("absolute overflow-hidden rounded-lg border px-2 py-1 text-xs transition hover:shadow-soft", TYPE_TONE[b.eventType] ?? TYPE_TONE.custom)}
                                style={{ top, height: h, left: `${p.col * wPct}%`, width: `calc(${wPct}% - 4px)` }}
                              >
                                <p className="truncate font-medium">{b.title}</p>
                                <p className="truncate text-[0.65rem] opacity-80">{formatTime(b.startTime)}{!b.isSub ? "" : ` · ${b.eventName}`}</p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="print-clean">
                {dates.map((date) => (
                  <div key={date} className="mb-5 last:mb-0">
                    <h3 className="mb-2 border-b border-gold-100 pb-1 font-serif text-lg font-semibold">{formatDate(date, "long")}</h3>
                    <div className="space-y-1.5">
                      {blocks.filter((b) => b.date === date).map((b) => (
                        <div key={b.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-ivory-50">
                          <span className="w-32 shrink-0 text-sm font-medium text-gold-700">{formatTimeRange(b.startTime, b.endTime)}</span>
                          <span className="text-sm text-ink">{b.title}</span>
                          {b.isSub && <Chip tone="slate">{b.eventName}</Chip>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>

          <div className="space-y-4 no-print">
            <Card>
              <SectionTitle title="Schedule overview" icon={<Layers className="h-5 w-5" />} className="mb-3" />
              <div className="space-y-2 text-sm">
                <Row label="Total events" value={overview.totalEvents} />
                <Row label="Main events" value={overview.mainEvents} />
                <Row label="Sub-events" value={overview.subEvents} />
                <Row label="Total duration" value={`${overview.totalHours} hrs`} />
              </div>
            </Card>
            <Card>
              <SectionTitle title="Legend" className="mb-3" />
              <div className="space-y-1.5 text-sm">
                {Object.entries(TYPE_TONE).filter(([k]) => k !== "custom").map(([k, cls]) => (
                  <span key={k} className="flex items-center gap-2 capitalize">
                    <span className={cn("h-3 w-3 rounded border", cls)} /> {k}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between"><span className="text-ink-muted">{label}</span><span className="font-medium">{value}</span></div>;
}

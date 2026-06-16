"use client";

import { useState } from "react";
import Link from "next/link";
import { useWedding, useStore } from "@/lib/store";
import { timelineSummary, phaseProgress, planningProgress, isOverdue, resolvedTaskStatus } from "@/lib/selectors";
import { PLANNING_PHASES } from "@/lib/types";
import { PageTitle, Card, StatCard, ProgressRing, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput, Select } from "@/components/ui/fields";
import { TaskRow } from "@/components/timeline/TaskRow";
import { FadeIn } from "@/components/ui/motion";
import { CheckCircle2, CalendarClock, AlertTriangle, Plus, CalendarRange, ListChecks } from "lucide-react";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In progress" },
  { value: "done", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

export default function TimelinePage() {
  const w = useWedding();
  const mutate = useStore((s) => s.mutate);
  const summary = timelineSummary(w);
  const overallProgress = planningProgress(w);

  const [phase, setPhase] = useState<string>(w.planningPhase || "All phases");
  const [filter, setFilter] = useState("all");
  const [sortDue, setSortDue] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [nt, setNt] = useState({ text: "", phase: w.planningPhase || "6 months before", category: "General", priority: "Medium", dueDate: "" });
  const [saving, setSaving] = useState(false);

  let tasks = w.timelineTasks.filter((t) => (phase === "All phases" ? true : t.phase === phase));
  tasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    if (filter === "overdue") return isOverdue(t);
    return t.status === filter;
  });
  if (sortDue) tasks = [...tasks].sort((a, b) => (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity));
  else tasks = [...tasks].sort((a, b) => a.position - b.position);

  const upcoming = w.timelineTasks
    .filter((t) => t.status !== "done" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  async function addTask() {
    if (!nt.text.trim()) return;
    setSaving(true);
    await mutate("POST", "/api/timeline-tasks", { ...nt, dueDate: nt.dueDate || null });
    setSaving(false);
    setAddOpen(false);
    setNt({ text: "", phase: phase === "All phases" ? "6 months before" : phase, category: "General", priority: "Medium", dueDate: "" });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Wedding timeline"
        subtitle="Stay on track with what needs to happen and when."
        action={
          <div className="flex gap-2">
            <Link href="/app/timeline/calendar"><Button variant="ghost" icon={<CalendarRange className="h-4 w-4" />}>Full calendar</Button></Link>
            <Button onClick={() => setAddOpen(true)} icon={<Plus className="h-4 w-4" />}>Add task</Button>
          </div>
        }
      />

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Tasks completed" value={`${summary.completed} / ${summary.total}`} icon={<CheckCircle2 className="h-5 w-5" />} tone="sage" />
          <StatCard label="Upcoming this month" value={summary.upcomingThisMonth} icon={<CalendarClock className="h-5 w-5" />} tone="amber" />
          <StatCard label="Overdue / high priority" value={summary.overdueOrHigh} icon={<AlertTriangle className="h-5 w-5" />} tone="rose" />
        </div>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[14rem_1fr_15rem]">
        {/* Phase sidebar */}
        <Card className="h-fit">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Planning phases</h3>
          <div className="space-y-1">
            <PhaseBtn label="All phases" active={phase === "All phases"} onClick={() => setPhase("All phases")} pct={overallProgress} />
            {PLANNING_PHASES.map((p) => (
              <PhaseBtn key={p} label={p} active={phase === p} onClick={() => setPhase(p)} pct={phaseProgress(w, p)} />
            ))}
          </div>
        </Card>

        {/* Task list */}
        <div>
          <Card className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterTabs options={STATUS_FILTERS} value={filter} onChange={setFilter} size="sm" />
              <button onClick={() => setSortDue(!sortDue)} className={`rounded-full border px-3 py-1 text-xs transition ${sortDue ? "border-gold-400 bg-gold-50 text-gold-700" : "border-gold-200/70 text-ink-muted hover:bg-ivory-100"}`}>
                Sort by due date
              </button>
            </div>
          </Card>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <EmptyState title="No tasks here" message="Adjust filters or add a custom task." icon={<ListChecks className="h-8 w-8" />} action={<Button onClick={() => setAddOpen(true)} icon={<Plus className="h-4 w-4" />}>Add task</Button>} />
            ) : (
              tasks.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <Card className="text-center">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Phase progress</h3>
            <div className="flex justify-center">
              <ProgressRing value={phase === "All phases" ? overallProgress : phaseProgress(w, phase)} size={96} stroke={8} />
            </div>
            <p className="mt-2 text-sm text-ink-muted">{phase}</p>
          </Card>
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">What&apos;s next</h3>
            <div className="space-y-2.5">
              {upcoming.map((t) => (
                <div key={t.id} className="border-l-2 border-gold-300 pl-2.5">
                  <p className="text-sm font-medium text-ink">{t.text}</p>
                  <p className="text-xs text-ink-muted">{t.phase}</p>
                </div>
              ))}
              {upcoming.length === 0 && <p className="text-sm text-ink-muted">Nothing scheduled.</p>}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add custom task"
        footer={<><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={addTask} loading={saving}>Add task</Button></>}>
        <div className="space-y-4">
          <Field label="Task" required><TextInput value={nt.text} onChange={(e) => setNt({ ...nt, text: e.target.value })} placeholder="e.g. Confirm florist sample" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phase"><Select value={nt.phase} onChange={(e) => setNt({ ...nt, phase: e.target.value })} options={PLANNING_PHASES as unknown as string[]} /></Field>
            <Field label="Priority"><Select value={nt.priority} onChange={(e) => setNt({ ...nt, priority: e.target.value })} options={["High", "Medium", "Low"]} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category"><TextInput value={nt.category} onChange={(e) => setNt({ ...nt, category: e.target.value })} /></Field>
            <Field label="Due date"><TextInput type="date" value={nt.dueDate} onChange={(e) => setNt({ ...nt, dueDate: e.target.value })} /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PhaseBtn({ label, active, onClick, pct }: { label: string; active: boolean; onClick: () => void; pct: number }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${active ? "bg-gradient-to-r from-gold-50 to-ivory-100 font-medium text-gold-700" : "text-ink-light hover:bg-ivory-100"}`}>
      <span className="truncate">{label}</span>
      <span className="ml-2 text-xs text-ink-muted">{pct}%</span>
    </button>
  );
}

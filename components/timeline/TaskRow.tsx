"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TimelineTaskData } from "@/lib/types";
import { resolvedTaskStatus } from "@/lib/selectors";
import { Chip, PriorityChip } from "@/components/ui/primitives";
import { Check, Circle, Clock, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const NEXT: Record<string, string> = { todo: "inprogress", inprogress: "done", done: "todo" };

export function TaskRow({ task }: { task: TimelineTaskData }) {
  const mutate = useStore((s) => s.mutate);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const status = resolvedTaskStatus(task);

  async function patch(data: Record<string, unknown>) {
    await mutate("PATCH", `/api/timeline-tasks/${task.id}`, data);
  }
  async function saveText() {
    if (text.trim() && text !== task.text) await patch({ text: text.trim() });
    setEditing(false);
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gold-50 bg-white px-3 py-2.5 transition hover:border-gold-200">
      <button
        onClick={() => patch({ status: NEXT[task.status] })}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
          task.status === "done" ? "border-sage-ring bg-sage-text text-white" : task.status === "inprogress" ? "border-amberc-ring bg-amberc-bg text-amberc-text" : "border-gold-300 bg-white text-transparent"
        )}
      >
        {task.status === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : task.status === "inprogress" ? <Clock className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)} onBlur={saveText} onKeyDown={(e) => { if (e.key === "Enter") saveText(); if (e.key === "Escape") setEditing(false); }} className="w-full rounded border border-gold-300 bg-white px-2 py-0.5 text-sm outline-none" />
        ) : (
          <button onClick={() => { setEditing(true); setText(task.text); }} className={cn("block max-w-full truncate text-left text-sm", task.status === "done" ? "text-ink-muted line-through" : "text-ink")}>
            {task.text}
          </button>
        )}
        <div className="mt-0.5 flex items-center gap-2">
          <Chip tone="slate">{task.category}</Chip>
          {task.dueDate && <span className="text-xs text-ink-muted">Due {formatDate(task.dueDate)}</span>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "overdue" && <Chip tone="rose">Overdue</Chip>}
        <select value={task.priority} onChange={(e) => patch({ priority: e.target.value })} className="hidden rounded-md border border-gold-100 bg-white px-1.5 py-0.5 text-xs sm:block">
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        <input type="date" value={task.dueDate ? task.dueDate.slice(0, 10) : ""} onChange={(e) => patch({ dueDate: e.target.value || null })} className="hidden rounded-md border border-gold-100 bg-white px-1.5 py-0.5 text-xs md:block" />
        <button onClick={() => mutate("DELETE", `/api/timeline-tasks/${task.id}`)} className="rounded-md p-1.5 text-ink-muted opacity-0 transition hover:bg-rose-bg hover:text-rose-text group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

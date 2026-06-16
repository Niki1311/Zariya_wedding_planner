"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChecklistItem } from "@/lib/types";
import { Check, Minus, Plus, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const NEXT: Record<string, string> = { todo: "inprogress", inprogress: "done", done: "todo" };

export function EventChecklist({ eventId, items }: { eventId: string; items: ChecklistItem[] }) {
  const mutate = useStore((s) => s.mutate);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  async function cycle(item: ChecklistItem) {
    await mutate("PATCH", `/api/events/${eventId}/checklist/${item.id}`, { status: NEXT[item.status] });
  }
  async function setStatus(item: ChecklistItem, status: string) {
    await mutate("PATCH", `/api/events/${eventId}/checklist/${item.id}`, { status });
  }
  async function saveEdit(item: ChecklistItem) {
    if (editText.trim() && editText !== item.text) {
      await mutate("PATCH", `/api/events/${eventId}/checklist/${item.id}`, { text: editText.trim() });
    }
    setEditingId(null);
  }
  async function del(item: ChecklistItem) {
    await mutate("DELETE", `/api/events/${eventId}/checklist/${item.id}`);
  }
  async function add() {
    if (!newText.trim()) return;
    await mutate("POST", `/api/events/${eventId}/checklist`, { text: newText.trim() });
    setNewText("");
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-ivory-50">
          <button
            onClick={() => cycle(item)}
            className={cn(
              "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
              item.status === "done" ? "border-sage-ring bg-sage-text text-white" : item.status === "inprogress" ? "border-amberc-ring bg-amberc-bg text-amberc-text" : "border-gold-300 bg-white text-transparent"
            )}
            title="Click to change status"
          >
            {item.status === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : item.status === "inprogress" ? <Clock className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
          </button>

          {editingId === item.id ? (
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => saveEdit(item)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(item); if (e.key === "Escape") setEditingId(null); }}
              className="flex-1 rounded border border-gold-300 bg-white px-2 py-0.5 text-sm outline-none"
            />
          ) : (
            <button
              onClick={() => { setEditingId(item.id); setEditText(item.text); }}
              className={cn("flex-1 text-left text-sm", item.status === "done" ? "text-ink-muted line-through" : "text-ink")}
            >
              {item.text}
            </button>
          )}

          <select
            value={item.status}
            onChange={(e) => setStatus(item, e.target.value)}
            className="rounded-md border border-gold-100 bg-white px-1.5 py-0.5 text-xs text-ink-muted opacity-0 transition focus:opacity-100 group-hover:opacity-100"
          >
            <option value="todo">To do</option>
            <option value="inprogress">In progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={() => del(item)} className="rounded-md p-1 text-ink-muted opacity-0 transition hover:bg-rose-bg hover:text-rose-text group-hover:opacity-100" title="Delete">
            <Minus className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-1">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a checklist item…"
          className="flex-1 rounded-lg border border-gold-200/70 bg-ivory-50 px-3 py-1.5 text-sm outline-none focus:border-gold-400"
        />
        <button onClick={add} className="grid h-8 w-8 place-items-center rounded-lg bg-gold-50 text-gold-700 hover:bg-gold-100"><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

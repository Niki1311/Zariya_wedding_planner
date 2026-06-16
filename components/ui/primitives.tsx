import { cn } from "@/lib/utils";
import { GoldDivider } from "./Motifs";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return <Tag className={cn("card-base p-5", className)}>{children}</Tag>;
}

export function SectionTitle({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-gold-500">{icon}</span>}
        <div>
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight md:text-[2.1rem]">
          {title}
          {icon && <span className="text-gold-500">{icon}</span>}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

type Tone = "sage" | "amber" | "rose" | "slate" | "gold";

const TONE_CLASSES: Record<Tone, string> = {
  sage: "bg-sage-bg text-sage-text ring-sage-ring/40",
  amber: "bg-amberc-bg text-amberc-text ring-amberc-ring/40",
  rose: "bg-rose-bg text-rose-text ring-rose-ring/40",
  slate: "bg-slatec-bg text-slatec-text ring-slatec-ring/40",
  gold: "bg-gold-50 text-gold-700 ring-gold-200/50",
};

export function Chip({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// Maps common status strings to a tone + label.
export function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["done", "accepted", "confirmed", "paid"].includes(s)) return "sage";
  if (["inprogress", "in progress", "pending", "partial paid", "advance due", "deposit paid", "in review", "shortlisted"].includes(s))
    return "amber";
  if (["overdue", "declined", "cancelled", "unpaid", "due"].includes(s)) return "rose";
  return "slate";
}

const STATUS_LABEL: Record<string, string> = {
  todo: "To do",
  inprogress: "In progress",
  done: "Done",
  overdue: "Overdue",
};

export function StatusChip({ status, className }: { status: string; className?: string }) {
  const label = STATUS_LABEL[status.toLowerCase()] ?? status;
  return (
    <Chip tone={statusTone(status)} className={className}>
      {label}
    </Chip>
  );
}

export function PriorityChip({ priority }: { priority: string }) {
  const tone: Tone = priority === "High" ? "rose" : priority === "Medium" ? "amber" : "slate";
  return <Chip tone={tone}>{priority}</Chip>;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "gold",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("card-base flex items-center gap-4 p-4", className)}>
      {icon && (
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset", TONE_CLASSES[tone])}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="font-serif text-2xl font-semibold leading-tight text-ink">{value}</p>
        {sub && <p className="text-xs text-ink-muted">{sub}</p>}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "gold",
}: {
  value: number;
  className?: string;
  tone?: "gold" | "sage" | "rose";
}) {
  const color =
    tone === "sage" ? "bg-sage-text" : tone === "rose" ? "bg-rose-text" : "bg-gradient-to-r from-gold-400 to-gold-600";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-ivory-300/70", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  tone = "gold",
  label,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "gold" | "sage" | "rose";
  label?: React.ReactNode;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c - (v / 100) * c;
  const color = tone === "sage" ? "#4B7B4A" : tone === "rose" ? "#A8473F" : "#C49A4A";
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFE5D3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s ease-out" }}
        />
      </svg>
      <span className="absolute font-serif text-sm font-semibold text-ink">
        {label ?? `${Math.round(v)}%`}
      </span>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold-200/80 bg-ivory-50/60 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-gold-400">{icon}</div>}
      <GoldDivider className="mb-3" />
      <h4 className="text-lg font-semibold">{title}</h4>
      {message && <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

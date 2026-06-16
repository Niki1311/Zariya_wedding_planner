import { cn } from "@/lib/utils";

/** Low-opacity decorative corner mandala/arch flourish for backgrounds. */
export function CornerMotif({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("pointer-events-none select-none text-gold-400", flip && "scale-x-[-1]", className)}
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.5">
        <path d="M0 40 C60 40 90 20 110 -10" />
        <path d="M0 70 C80 70 120 40 150 -10" />
        <path d="M0 100 C100 100 150 60 190 0" />
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 0.5;
          return (
            <line key={i} x1="30" y1="30" x2={30 + Math.cos(a) * 26} y2={30 + Math.sin(a) * 26} />
          );
        })}
        <circle cx="30" cy="30" r="6" />
        <circle cx="30" cy="30" r="12" opacity="0.6" />
        <path d="M70 18 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/** A thin gold divider with a centered lotus dot — used under section titles. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-gold-500", className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-300" />
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M8 2 l1.4 4.6 4.6 1.4 -4.6 1.4 -1.4 4.6 -1.4 -4.6 -4.6 -1.4 4.6 -1.4z" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-300" />
    </div>
  );
}

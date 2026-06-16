import { cn } from "@/lib/utils";

/** The lotus-in-arch brand mark, recreated as SVG so it scales crisply anywhere. */
export function LotusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 96" className={cn("h-10 w-auto", className)} fill="none" aria-hidden>
      <defs>
        <linearGradient id="zg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DDBA6C" />
          <stop offset="55%" stopColor="#C49A4A" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <g stroke="url(#zg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Arch */}
        <path d="M14 90 V44 C14 26 22 14 32 6 C42 14 50 26 50 44 V90" />
        {/* top sparkle */}
        <path d="M32 12 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 z" fill="url(#zg)" stroke="none" />
        {/* Lotus */}
        <path d="M32 64 C32 56 28 50 22 47 C24 55 27 60 32 64 Z" fill="url(#zg)" stroke="none" opacity="0.9" />
        <path d="M32 64 C32 56 36 50 42 47 C40 55 37 60 32 64 Z" fill="url(#zg)" stroke="none" opacity="0.9" />
        <path d="M32 64 C30 55 30 49 32 42 C34 49 34 55 32 64 Z" fill="url(#zg)" stroke="none" />
        <path d="M32 64 C32 58 25 54 17 54 C22 60 27 63 32 64 Z" fill="url(#zg)" stroke="none" opacity="0.75" />
        <path d="M32 64 C32 58 39 54 47 54 C42 60 37 63 32 64 Z" fill="url(#zg)" stroke="none" opacity="0.75" />
        {/* base flourish */}
        <path d="M22 78 H42" opacity="0.6" />
        <circle cx="32" cy="84" r="1.4" fill="url(#zg)" stroke="none" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  showTagline = false,
  size = "md",
  orientation = "horizontal",
}: {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
}) {
  const text = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-2xl";
  const mark = size === "lg" ? "h-12" : size === "sm" ? "h-7" : "h-9";
  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col items-center gap-1", className)}>
        <LotusMark className={mark} />
        <span className={cn("zariya-wordmark leading-none", text)}>Zariya</span>
        {showTagline && (
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-600">
            Wedding Planning Platform
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LotusMark className={mark} />
      <div className="flex flex-col leading-none">
        <span className={cn("zariya-wordmark", text)}>Zariya</span>
        {showTagline && (
          <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.28em] text-gold-600">
            Wedding Planning Platform
          </span>
        )}
      </div>
    </div>
  );
}

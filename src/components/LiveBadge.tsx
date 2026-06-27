// Small pulsing "AO VIVO" badge + live clock.
// Used on match cards and the match detail hero whenever
// `status === 'in_progress'`.

import { cn } from "@/lib/utils";

export function LiveBadge({
  clock,
  className,
  compact = false,
}: {
  clock?: string | null;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive border border-destructive/40",
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        "font-semibold uppercase tracking-widest",
        className,
      )}
      aria-label={clock ? `Ao vivo, ${clock}` : "Ao vivo"}
    >
      <span className="relative inline-flex size-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full size-1.5 bg-destructive" />
      </span>
      Ao vivo
      {clock ? <span className="ml-0.5 tabular-nums normal-case tracking-normal">{clock}</span> : null}
    </span>
  );
}

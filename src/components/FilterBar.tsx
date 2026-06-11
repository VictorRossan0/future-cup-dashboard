import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const filterInputClass =
  "bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 grid gap-3",
        className ?? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}

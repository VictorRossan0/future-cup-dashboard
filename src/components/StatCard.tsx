import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  variant?: "default" | "gold" | "green" | "info";
}

export function StatCard({ icon: Icon, label, value, hint, variant = "default" }: StatCardProps) {
  const iconBg = {
    default: "bg-secondary text-secondary-foreground",
    gold: "bg-gradient-gold text-gold-foreground",
    green: "bg-gradient-green text-primary-foreground",
    info: "bg-info/20 text-info",
  }[variant];

  return (
    <div className="group rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-primary/40 transition-colors shadow-elegant min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", iconBg)}>
          <Icon className="size-5" />
        </div>
        {hint && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-right leading-tight max-w-[60%] break-words">
            {hint}
          </span>
        )}
      </div>
      <div className="mt-4 min-w-0">
        <div className="font-display text-2xl sm:text-3xl font-bold break-words">{value}</div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 break-words">{label}</div>
      </div>
    </div>
  );
}

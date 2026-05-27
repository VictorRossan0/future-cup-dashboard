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
    <div className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors shadow-elegant">
      <div className="flex items-start justify-between">
        <div className={cn("size-10 rounded-xl grid place-items-center", iconBg)}>
          <Icon className="size-5" />
        </div>
        {hint && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-4">
        <div className="font-display text-3xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

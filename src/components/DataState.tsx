import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Database } from "lucide-react";

export function LoadingGrid({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 flex items-start gap-3">
      <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive">
        {message ?? "Não foi possível carregar os dados agora. Exibindo dados locais como fallback."}
      </p>
    </div>
  );
}

export function EmptyState({ title = "Sem dados", description }: { title?: string; description?: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 px-4 py-8 text-center">
      <Database className="size-6 text-muted-foreground mx-auto mb-2" />
      <p className="font-medium">{title}</p>
      {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
    </div>
  );
}

export function SourceBadge({ source }: { source: "supabase" | "mock" }) {
  const isLive = source === "supabase";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest border ${
      isLive ? "border-primary/40 text-primary bg-primary/10" : "border-gold/40 text-gold bg-gold/10"
    }`}>
      <span className={`size-1.5 rounded-full ${isLive ? "bg-primary" : "bg-gold"}`} />
      {isLive ? "Supabase" : "Mock"}
    </span>
  );
}

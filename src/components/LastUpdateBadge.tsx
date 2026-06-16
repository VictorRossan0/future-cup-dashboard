import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";
import { useMatches } from "@/hooks/useCopa";

function formatRelative(diffMs: number) {
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "agora mesmo";
  if (m < 60) return `há ${m} ${m === 1 ? "minuto" : "minutos"}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} ${h === 1 ? "hora" : "horas"}`;
  const d = Math.floor(h / 24);
  return `há ${d} ${d === 1 ? "dia" : "dias"}`;
}

function formatAbsolute(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function LastUpdateBadge() {
  const matchesQ = useMatches();
  const ts = matchesQ.dataUpdatedAt;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!ts) return null;

  const diff = now - ts;
  const minutes = diff / 60000;

  let tone: "ok" | "warn" | "alert";
  let label: string;
  let Icon = CheckCircle2;

  if (minutes < 30) {
    tone = "ok";
    label = "Dados atualizados";
  } else if (minutes < 120) {
    tone = "warn";
    label = "Atenção · sincronização recente";
    Icon = AlertTriangle;
  } else {
    tone = "alert";
    label = "Atualização pendente";
    Icon = AlertCircle;
  }

  const toneStyles =
    tone === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
        : "border-red-500/30 bg-red-500/10 text-red-400";

  const dotColor =
    tone === "ok" ? "bg-emerald-500" : tone === "warn" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="w-full">
      <div
        className={`flex w-full flex-col gap-2 rounded-2xl border ${toneStyles} px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex size-2.5 shrink-0">
            <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60 animate-ping`} />
            <span className={`relative inline-flex rounded-full size-2.5 ${dotColor}`} />
          </span>
          <Icon className="size-4 shrink-0" />
          <span className="font-medium text-sm truncate">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-right">
          <RefreshCw className="size-3.5 shrink-0" />
          <span className="truncate">
            <span className="font-medium text-foreground">{formatRelative(diff)}</span>
            <span className="mx-1.5 opacity-60">·</span>
            <span>{formatAbsolute(ts)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

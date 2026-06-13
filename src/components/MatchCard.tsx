import type { Match } from "@/types";
import { getTeam } from "@/data/teams";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function MatchCard({ match }: { match: Match }) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  const date = new Date(match.date);
  const statusClass = {
    "Agendado": "bg-secondary text-secondary-foreground",
    "Encerrado": "bg-muted text-muted-foreground",
    "Ao vivo": "bg-destructive/20 text-destructive border border-destructive/40 animate-pulse",
  }[match.status];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-3 min-w-0">
        <span>Grupo {match.group} · {match.phase}</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] shrink-0",
            statusClass
          )}
        >
          {match.status}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col items-center text-center">
          <span className="text-3xl">{home?.flag}</span>
          <span className="font-display font-semibold mt-1 text-sm">{home?.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{home?.code}</span>
        </div>
        <div className="text-center">
          {match.status !== "Agendado" && match.homeScore !== undefined ? (
            <div className="font-display text-3xl font-bold tabular-nums">
              {match.homeScore} <span className="text-muted-foreground">·</span> {match.awayScore}
            </div>
          ) : (
            <div className="font-display text-xl font-bold text-muted-foreground">VS</div>
          )}
          <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
            {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <span className="text-3xl">{away?.flag}</span>
          <span className="font-display font-semibold mt-1 text-sm">{away?.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{away?.code}</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3" />
          {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        <span className="inline-flex items-center gap-1 truncate">
          <MapPin className="size-3" />
          {match.stadium}, {match.city}
        </span>
      </div>
    </div>
  );
}

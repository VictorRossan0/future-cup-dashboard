import type { VMatchesFull } from "@/types/views";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { TeamFlag } from "@/components/TeamFlag";

export function MatchCardView({ match }: { match: VMatchesFull }) {
  const status = match.status ?? "scheduled";
  const isFinished = status === "finished" || status === "completed";
  const statusClass =
    {
      scheduled: "bg-secondary text-secondary-foreground",
      confirmed: "bg-secondary text-secondary-foreground",
      pending: "bg-muted text-muted-foreground",
      finished: "bg-muted text-muted-foreground",
      completed: "bg-muted text-muted-foreground",
      current: "bg-destructive/20 text-destructive border border-destructive/40 animate-pulse",
    }[status] ?? "bg-secondary text-secondary-foreground";

  const home = match.home_team_name ?? match.home_display_name ?? "A definir";
  const away = match.away_team_name ?? match.away_display_name ?? "A definir";
  const homePlaceholder = !match.home_team_name && !!match.home_display_name;
  const awayPlaceholder = !match.away_team_name && !!match.away_display_name;

  const time = match.match_time?.slice(0, 5) ?? "Horário a confirmar";
  const dateStr = match.match_date
    ? new Date(match.match_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "Data a confirmar";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        <span>
          #{match.match_number} · {t.stage(match.stage)}
          {match.group_code ? ` · Grupo ${match.group_code}` : ""}
        </span>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px]", statusClass)}>{t.status(status)}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div className="min-w-0 flex flex-col items-center text-center gap-1">
          <TeamFlag teamCode={match.home_team_code} teamName={match.home_team_name} size={32} />
          <span className="font-display font-semibold text-sm max-w-full truncate" title={home}>
            {" "}
            {home}{" "}
          </span>
          {match.home_team_code && (
            <span className="text-[10px] font-mono text-muted-foreground">{match.home_team_code}</span>
          )}
          {homePlaceholder && <span className="text-[9px] text-muted-foreground italic">placeholder</span>}
        </div>
        <div className="text-center shrink-0 w-[64px]">
          {isFinished && match.home_score != null ? (
            <div className="font-display text-3xl font-bold tabular-nums">
              {match.home_score} <span className="text-muted-foreground">·</span> {match.away_score}
            </div>
          ) : (
            <div className="font-display text-xl font-bold text-muted-foreground">VS</div>
          )}
          <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">{time}</div>
        </div>
        <div className="min-w-0 flex flex-col items-center text-center gap-1">
          <TeamFlag teamCode={match.away_team_code} teamName={match.away_team_name} size={32} />
          <span className="font-display font-semibold text-sm max-w-full truncate" title={away}>
            {" "}
            {away}{" "}
          </span>
          {match.away_team_code && (
            <span className="text-[10px] font-mono text-muted-foreground">{match.away_team_code}</span>
          )}
          {awayPlaceholder && <span className="text-[9px] text-muted-foreground italic">placeholder</span>}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3" />
          {dateStr}
        </span>
        <span className="inline-flex items-center gap-1 truncate">
          <MapPin className="size-3" />
          {[match.stadium, match.city, match.country].filter(Boolean).join(", ") || "Local a confirmar"}
        </span>
      </div>
    </div>
  );
}

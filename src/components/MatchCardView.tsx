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

  const time = match.match_time?.slice(0, 5) ?? "Horário a confirmar";

  const dateStr = match.match_date
    ? new Date(match.match_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "Data a confirmar";

  const location = [match.stadium, match.city, match.country].filter(Boolean).join(", ") || "Local a confirmar";

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-4 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 overflow-hidden">
        <span className="flex-1 min-w-0 truncate text-[9px] uppercase tracking-widest text-muted-foreground">
          #{match.match_number} · {t.stage(match.stage)}
          {match.group_code ? ` · Grupo ${match.group_code}` : ""}
        </span>

        <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-[9px]", statusClass)}>{t.status(status)}</span>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-[1fr_44px_1fr] sm:grid-cols-[1fr_56px_1fr] items-center gap-1 w-full">
        {/* Home */}
        <div className="min-w-0 flex flex-col items-center text-center">
          <TeamFlag teamCode={match.home_team_code} teamName={match.home_team_name} size={20} />

          <span className="mt-1 text-[11px] sm:text-xs font-semibold leading-tight w-full break-words" title={home}>
            {home}
          </span>

          {match.home_team_code && (
            <span className="text-[9px] text-muted-foreground truncate w-full">{match.home_team_code}</span>
          )}
        </div>

        {/* Center */}
        <div className="w-[44px] sm:w-[56px] text-center shrink-0">
          {isFinished && match.home_score != null ? (
            <div className="font-display text-base sm:text-lg font-bold">
              {match.home_score}
              <span className="mx-1 text-muted-foreground">·</span>
              {match.away_score}
            </div>
          ) : (
            <div className="font-display text-base sm:text-lg font-bold text-muted-foreground">VS</div>
          )}

          <div className="text-[9px] text-muted-foreground truncate">{time}</div>
        </div>

        {/* Away */}
        <div className="min-w-0 flex flex-col items-center text-center">
          <TeamFlag teamCode={match.away_team_code} teamName={match.away_team_name} size={20} />

          <span className="mt-1 text-[11px] sm:text-xs font-semibold leading-tight w-full break-words" title={away}>
            {away}
          </span>

          {match.away_team_code && (
            <span className="text-[9px] text-muted-foreground truncate w-full">{match.away_team_code}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2 text-[11px] text-muted-foreground min-w-0">
        <div className="flex items-center gap-1 min-w-0">
          <Calendar className="size-3 shrink-0" />
          <span className="truncate">{dateStr}</span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </div>
  );
}

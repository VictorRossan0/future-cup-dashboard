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
    <div className="w-full max-w-full overflow-hidden rounded-2xl border-4 border-red-500 bg-red-500 p-3 sm:p-4 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 text-[9px] uppercase tracking-widest text-muted-foreground overflow-hidden">
        <span className="truncate flex-1">
          #{match.match_number} · {t.stage(match.stage)}
          {match.group_code ? ` · Grupo ${match.group_code}` : ""}
        </span>

        <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-[9px]", statusClass)}>{t.status(status)}</span>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-[1fr_50px_1fr] items-center gap-1 w-full">
        <div className="min-w-0 flex flex-col items-center text-center">
          <TeamFlag teamCode={match.home_team_code} teamName={match.home_team_name} size={22} />

          <span className="mt-1 text-xs font-semibold truncate w-full" title={home}>
            {home}
          </span>

          {match.home_team_code && <span className="text-[9px] text-muted-foreground">{match.home_team_code}</span>}
        </div>

        <div className="w-[50px] text-center shrink-0">
          {isFinished && match.home_score != null ? (
            <div className="font-display text-lg font-bold">
              {match.home_score}
              <span className="mx-1 text-muted-foreground">·</span>
              {match.away_score}
            </div>
          ) : (
            <div className="font-display text-lg font-bold text-muted-foreground">VS</div>
          )}

          <div className="text-[9px] text-muted-foreground">{time}</div>
        </div>

        <div className="min-w-0 flex flex-col items-center text-center">
          <TeamFlag teamCode={match.away_team_code} teamName={match.away_team_name} size={22} />

          <span className="mt-1 text-xs font-semibold truncate w-full" title={away}>
            {away}
          </span>

          {match.away_team_code && <span className="text-[9px] text-muted-foreground">{match.away_team_code}</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="size-3 shrink-0" />
          <span>{dateStr}</span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </div>
  );
}

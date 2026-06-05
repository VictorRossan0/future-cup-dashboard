import { Link } from "@tanstack/react-router";
import type { VTeamsFull } from "@/types/views";
import { TeamFlag } from "@/components/TeamFlag";

export function TeamCardView({ team }: { team: VTeamsFull }) {
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-glow">
      <div className="h-20 bg-gradient-hero relative flex items-center justify-center gap-3">
        <TeamFlag teamCode={team.team_code} teamName={team.team_name} size={36} />
        <span className="font-display font-bold text-3xl text-gold">{team.team_code}</span>
        {team.group_code && (
          <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest bg-background/60 backdrop-blur px-2 py-0.5 rounded-full">
            Grupo {team.group_code}
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display font-bold text-lg leading-tight truncate flex items-center gap-2">
              <TeamFlag teamCode={team.team_code} teamName={team.team_name} size={20} />
              <span className="truncate">{team.team_name}</span>
            </h3>
            <span className="text-xs font-mono text-gold shrink-0">{team.team_code}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{team.confederation ?? "—"}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Técnico</div>
            <div className="truncate">{team.coach_name ?? "—"}</div>
            {team.coach_nationality && (
              <div className="text-[10px] text-muted-foreground truncate">
                {team.coach_nationality}{team.coach_age ? ` · ${team.coach_age} anos` : ""}
              </div>
            )}
          </div>
          <div>
            <div className="text-muted-foreground">Elenco</div>
            <div className="font-semibold text-gold">{team.total_players ?? 0} jogadores</div>
            <div className="text-[10px] text-muted-foreground">
              GOL {team.goalkeeper_count ?? 0} · DEF {team.defender_count ?? 0} · MEI {team.midfielder_count ?? 0} · ATA {team.forward_count ?? 0}
            </div>
          </div>
        </div>
        <Link
          to="/selecoes/$id"
          params={{ id: team.team_id }}
          className="block text-center text-sm font-medium bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg py-2 transition-colors"
        >
          Ver elenco
        </Link>
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { Team } from "@/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-glow">
      <div className="h-20 bg-gradient-hero relative flex items-center justify-center text-5xl">
        <span>{team.flag ?? "🏳️"}</span>
        <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest bg-background/60 backdrop-blur px-2 py-0.5 rounded-full">
          Grupo {team.group}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display font-bold text-lg leading-tight">{team.name}</h3>
            <span className="text-xs font-mono text-gold">{team.code}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{team.confederation}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Técnico</div>
            <div className="truncate">{team.coach}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Ranking FIFA</div>
            <div className="font-semibold text-gold">#{team.ranking}</div>
          </div>
        </div>
        <Link
          to="/selecoes/$id"
          params={{ id: team.id }}
          className="block text-center text-sm font-medium bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg py-2 transition-colors"
        >
          Ver elenco
        </Link>
      </div>
    </div>
  );
}

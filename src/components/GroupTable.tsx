import type { GroupStanding } from "@/data/groups";
import { getTeam } from "@/data/teams";
import { cn } from "@/lib/utils";

const statusStyles = {
  advanced: { dot: "bg-primary", label: "Classificado" },
  thirdContender: { dot: "bg-gold", label: "Melhor 3º" },
  eliminated: { dot: "bg-muted-foreground/40", label: "Eliminado" },
  playing: { dot: "bg-info", label: "Em jogo" },
};

export function GroupTable({ letter, teams }: { letter: string; teams: GroupStanding[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gradient-hero flex items-center justify-between">
        <h3 className="font-display font-bold">Grupo {letter}</h3>
        <span className="text-[10px] uppercase tracking-widest text-gold">Fase de Grupos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Seleção</th>
              <th className="px-2 py-2">J</th>
              <th className="px-2 py-2">V</th>
              <th className="px-2 py-2">E</th>
              <th className="px-2 py-2">D</th>
              <th className="px-2 py-2">GP</th>
              <th className="px-2 py-2">GC</th>
              <th className="px-2 py-2">SG</th>
              <th className="px-2 py-2 text-gold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((row, i) => {
              const team = getTeam(row.teamId);
              const st = statusStyles[row.status];
              return (
                <tr key={row.teamId} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", st.dot)} title={st.label} />
                      <span className="text-muted-foreground text-xs">{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{team?.flag}</span>
                      <div>
                        <div className="font-medium">{team?.name}</div>
                        <div className="text-[10px] text-muted-foreground">{st.label}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.played}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.wins}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.draws}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.losses}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goalsAgainst}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-gold tabular-nums">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

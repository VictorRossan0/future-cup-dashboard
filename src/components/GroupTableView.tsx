import type { VGroupsStandings } from "@/types/views";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const statusStyles: Record<string, { dot: string; label: string }> = {
  advanced:       { dot: "bg-primary", label: "Classificado" },
  qualified:      { dot: "bg-primary", label: "Classificado" },
  thirdContender: { dot: "bg-gold", label: "Melhor 3º" },
  best_third:     { dot: "bg-gold", label: "Melhor 3º" },
  eliminated:     { dot: "bg-muted-foreground/40", label: "Eliminado" },
  playing:        { dot: "bg-info", label: "Em jogo" },
};

export function GroupTableView({ letter, rows }: { letter: string; rows: VGroupsStandings[] }) {
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
            {rows.map((row, i) => {
              const st = statusStyles[row.qualification_status ?? ""] ?? statusStyles.playing;
              const sg = row.goal_difference ?? 0;
              return (
                <tr key={`${row.team_id ?? row.team_name}-${i}`} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", st.dot)} title={st.label} />
                      <span className="text-muted-foreground text-xs">{row.position ?? i + 1}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{row.team_name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {row.team_code ?? ""} {row.coach_name ? `· ${row.coach_name}` : ""} · {t.qualif(row.qualification_status ?? "playing")}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.played ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.wins ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.draws ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.losses ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goals_for ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goals_against ?? 0}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{sg > 0 ? `+${sg}` : sg}</td>
                  <td className="px-2 py-2.5 text-center font-bold text-gold tabular-nums">{row.points ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { VGroupsStandings } from "@/types/views";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { TeamFlag } from "@/components/TeamFlag";

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
      {/* Horizontal scroll wrapper — prevents table from breaking mobile layout */}
      <div className="overflow-x-auto -mx-0">
        <table className="w-full text-sm" style={{ minWidth: "340px" }}>
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-2 sm:px-3 py-2 w-6">#</th>
              <th className="text-left px-1 sm:px-3 py-2">Seleção</th>
              <th className="px-1 sm:px-2 py-2 text-center w-6">J</th>
              <th className="px-1 sm:px-2 py-2 text-center w-6">V</th>
              <th className="px-1 sm:px-2 py-2 text-center w-6">E</th>
              <th className="px-1 sm:px-2 py-2 text-center w-6">D</th>
              <th className="px-1 sm:px-2 py-2 text-center w-7">GP</th>
              <th className="px-1 sm:px-2 py-2 text-center w-7">GC</th>
              <th className="px-1 sm:px-2 py-2 text-center w-8">SG</th>
              <th className="px-1 sm:px-2 py-2 text-center text-gold w-8">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const st = statusStyles[row.qualification_status ?? ""] ?? statusStyles.playing;
              const sg = row.goal_difference ?? 0;
              return (
                <tr
                  key={`${row.team_id ?? row.team_name}-${i}`}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-2 sm:px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("size-2 rounded-full shrink-0", st.dot)} title={st.label} />
                      <span className="text-muted-foreground text-xs">{row.position ?? i + 1}</span>
                    </div>
                  </td>
                  <td className="px-1 sm:px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamFlag teamCode={row.team_code} teamName={row.team_name} size={18} />
                      <div className="min-w-0">
                        <div className="font-medium truncate text-xs sm:text-sm">{row.team_name}</div>
                        <div className="text-[9px] text-muted-foreground truncate hidden sm:block">
                          {row.team_code ?? ""} {row.coach_name ? `· ${row.coach_name}` : ""} · {t.qualif(row.qualification_status ?? "playing")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.played ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.wins ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.draws ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.losses ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.goals_for ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{row.goals_against ?? 0}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center tabular-nums text-xs">{sg > 0 ? `+${sg}` : sg}</td>
                  <td className="px-1 sm:px-2 py-2.5 text-center font-bold text-gold tabular-nums text-xs">{row.points ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

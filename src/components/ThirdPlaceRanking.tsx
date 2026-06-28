import { useMemo } from "react";
import { useGroupsStandings } from "@/hooks/useCopa";
import { computeThirdPlaceRanking } from "@/lib/thirdPlace";
import { TeamFlag } from "@/components/TeamFlag";
import { cn } from "@/lib/utils";

export function ThirdPlaceRanking() {
  const q = useGroupsStandings();
  const rows = q.data?.data ?? [];

  const { rows: ranking, allGroupsFinished, groupsConsidered } = useMemo(
    () => computeThirdPlaceRanking(rows),
    [rows],
  );

  if (ranking.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gradient-hero flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-base sm:text-lg font-bold truncate">
            Ranking dos 3ºs colocados
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Os 8 melhores entre os 12 grupos avançam aos 16-avos.
            {!allGroupsFinished && ` Prévia parcial (${groupsConsidered}/12 grupos).`}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-[9px] uppercase tracking-widest px-2 py-1 rounded-full",
            allGroupsFinished
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-gold/15 text-gold border border-gold/30",
          )}
        >
          {allGroupsFinished ? "Oficial" : "Projeção"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "480px" }}>
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-3 py-2 w-10">#</th>
              <th className="text-left px-3 py-2">Seleção</th>
              <th className="px-2 py-2 text-center w-10">Gr.</th>
              <th className="px-2 py-2 text-center w-9">Pts</th>
              <th className="px-2 py-2 text-center w-9">SG</th>
              <th className="px-2 py-2 text-center w-9">GP</th>
              <th className="px-2 py-2 text-center w-14">Status</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => {
              const sg = r.goal_difference ?? 0;
              return (
                <tr
                  key={`${r.team_id ?? r.team_name}`}
                  className={cn(
                    "border-t border-border transition-colors",
                    r.qualifies ? "bg-primary/5" : "opacity-70",
                  )}
                >
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center size-6 rounded-full text-[10px] font-bold tabular-nums",
                        r.qualifies
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.ranking}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamFlag teamCode={r.team_code} teamName={r.team_name} size={18} />
                      <span className="font-medium truncate text-xs sm:text-sm">{r.team_name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs tabular-nums">{r.group_code}</td>
                  <td className="px-2 py-2.5 text-center text-xs font-bold text-gold tabular-nums">
                    {r.points ?? 0}
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs tabular-nums">
                    {sg > 0 ? `+${sg}` : sg}
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs tabular-nums">{r.goals_for ?? 0}</td>
                  <td className="px-2 py-2.5 text-center">
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full whitespace-nowrap",
                        r.qualifies
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground border border-border",
                      )}
                    >
                      {r.qualifies ? "Avança" : "Fora"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!allGroupsFinished && (
        <div className="px-4 py-2 border-t border-border bg-secondary/30 text-[11px] text-muted-foreground">
          Critérios FIFA: pontos → saldo de gols → gols marcados → fair play.
          Atualiza em tempo real conforme os jogos terminam.
        </div>
      )}
    </section>
  );
}

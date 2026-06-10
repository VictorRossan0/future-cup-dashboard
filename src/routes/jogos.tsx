import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MatchCardView } from "@/components/MatchCardView";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { useMatches } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/jogos")({
  head: () => ({
    meta: [
      { title: "Jogos · Copa 2026 Intelligence" },
      { name: "description", content: "Calendário completo dos 104 jogos da Copa 2026 com filtros por fase, grupo, seleção, estádio e data." },
    ],
  }),
  component: JogosPage,
});

function JogosPage() {
  const q = useMatches();
  const all = q.data?.data ?? [];

  const [stage, setStage] = useState("all");
  const [group, setGroup] = useState("all");
  const [team, setTeam] = useState("all");
  const [stadium, setStadium] = useState("all");
  const [date, setDate] = useState("");

  const opts = useMemo(() => {
    const stages = Array.from(new Set(all.map((m) => m.stage).filter(Boolean)));
    const groups = Array.from(new Set(all.map((m) => m.group_code).filter(Boolean))) as string[];
    const teams = Array.from(new Map(
      all.flatMap((m) => [
        m.home_team_id ? [m.home_team_id, m.home_team_name ?? m.home_display_name ?? ""] as const : null,
        m.away_team_id ? [m.away_team_id, m.away_team_name ?? m.away_display_name ?? ""] as const : null,
      ]).filter(Boolean) as [string, string][]
    ).entries()).sort((a, b) => a[1].localeCompare(b[1]));
    const stadiums = Array.from(new Set(all.map((m) => m.stadium).filter(Boolean))) as string[];
    return { stages, groups, teams, stadiums };
  }, [all]);

  const filtered = useMemo(() => all.filter((m) => {
    if (stage !== "all" && m.stage !== stage) return false;
    if (group !== "all" && m.group_code !== group) return false;
    if (team !== "all" && m.home_team_id !== team && m.away_team_id !== team) return false;
    if (stadium !== "all" && m.stadium !== stadium) return false;
    if (date && m.match_date !== date) return false;
    return true;
  }), [all, stage, group, team, stadium, date]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <PageHeader
          kicker="Calendário"
          title="Jogos"
          description="Filtre por fase, grupo, seleção, estádio ou data."
          right={q.data && <SourceBadge source={q.data.source} />}
        />

        <FilterBar className="grid-cols-2 md:grid-cols-5">
          <select className={filterInputClass} value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="all">Todas as fases</option>
            {opts.stages.map((s) => <option key={s} value={s}>{t.stage(s)}</option>)}
          </select>
          <select className={filterInputClass} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Todos os grupos</option>
            {opts.groups.map((g) => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
          <select className={filterInputClass} value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">Todas as seleções</option>
            {opts.teams.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <select className={filterInputClass} value={stadium} onChange={(e) => setStadium(e.target.value)}>
            <option value="all">Todos os estádios</option>
            {opts.stadiums.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" className={filterInputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </FilterBar>

        <div className="text-sm text-muted-foreground">{filtered.length} jogo(s) encontrados</div>

        {q.isLoading ? (
          <LoadingGrid count={9} />
        ) : q.isError ? (
          <ErrorState />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhum jogo encontrado" description="Ajuste os filtros ou aguarde a base ser populada." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => <MatchCardView key={`${m.match_number}-${m.match_id ?? ""}`} match={m} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MatchCard } from "@/components/MatchCard";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { matches } from "@/data/matches";
import { teams } from "@/data/teams";
import { stadiums, groupLetters } from "@/data/competition";

export const Route = createFileRoute("/jogos")({
  head: () => ({
    meta: [
      { title: "Jogos · Copa 2026 Data Hub" },
      { name: "description", content: "Calendário interativo de jogos da Copa 2026 com filtros por grupo, seleção, estádio e data." },
    ],
  }),
  component: JogosPage,
});

function JogosPage() {
  const [group, setGroup] = useState<string>("all");
  const [team, setTeam] = useState<string>("all");
  const [stadium, setStadium] = useState<string>("all");
  const [date, setDate] = useState<string>("");

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (group !== "all" && m.group !== group) return false;
      if (team !== "all" && m.homeTeamId !== team && m.awayTeamId !== team) return false;
      if (stadium !== "all" && m.stadium !== stadium) return false;
      if (date && !m.date.startsWith(date)) return false;
      return true;
    });
  }, [group, team, stadium, date]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <PageHeader
          kicker="Calendário"
          title="Jogos"
          description="Filtre por grupo, seleção, estádio ou data."
        />

        <FilterBar>
          <select className={filterInputClass} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Todos os grupos</option>
            {groupLetters.map((g) => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
          <select className={filterInputClass} value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">Todas as seleções</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className={filterInputClass} value={stadium} onChange={(e) => setStadium(e.target.value)}>
            <option value="all">Todos os estádios</option>
            {stadiums.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <input type="date" className={filterInputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </FilterBar>

        <div className="text-sm text-muted-foreground">{filtered.length} jogo(s) encontrados</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => <MatchCard key={m.id} match={m} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum jogo encontrado com esses filtros.</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

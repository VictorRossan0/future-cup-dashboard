import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PlayerCard } from "@/components/PlayerCard";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { getTeam } from "@/data/teams";
import { positionList } from "@/data/players";
import type { Player } from "@/types";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/selecoes/$id")({
  loader: ({ params }) => {
    const team = getTeam(params.id);
    if (!team) throw notFound();
    return { team };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.team.name ?? "Seleção"} · Copa 2026 Data Hub` },
      { name: "description", content: `Elenco fictício, técnico e formação tática provável de ${loaderData?.team.name ?? "seleção"}.` },
    ],
  }),
  component: TeamDetail,
  notFoundComponent: () => (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Seleção não encontrada</h1>
        <Link to="/selecoes" className="inline-block mt-4 text-primary hover:underline">Voltar às seleções</Link>
      </div>
    </AppLayout>
  ),
  errorComponent: () => (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Erro ao carregar</h1>
        <Link to="/selecoes" className="inline-block mt-4 text-primary hover:underline">Voltar às seleções</Link>
      </div>
    </AppLayout>
  ),
});

function TeamDetail() {
  const { team } = Route.useLoaderData();
  const [posFilter, setPosFilter] = useState<string>("all");
  const [sort, setSort] = useState<"number" | "age" | "height" | "club">("number");

  const players: Player[] = team.players ?? [];

  const filtered = useMemo(() => {
    const list = posFilter === "all" ? players : players.filter((p) => p.position === posFilter);
    return [...list].sort((a, b) => {
      if (sort === "number") return a.number - b.number;
      if (sort === "age") return a.age - b.age;
      if (sort === "height") return b.height - a.height;
      return a.club.localeCompare(b.club);
    });
  }, [players, posFilter, sort]);

  return (
    <AppLayout>
      <section className="bg-gradient-hero border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link to="/selecoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
          <div className="mt-4 flex items-start gap-5">
            <span className="text-6xl sm:text-7xl">{team.flag}</span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Grupo {team.group} · {team.confederation}</div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold mt-1">{team.name}</h1>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span><span className="text-muted-foreground">Código:</span> <span className="font-mono text-gold">{team.code}</span></span>
                <span><span className="text-muted-foreground">Técnico:</span> {team.coach}</span>
                <span><span className="text-muted-foreground">Ranking:</span> <span className="text-gold font-semibold">#{team.ranking}</span></span>
                {team.formation && <span><span className="text-muted-foreground">Formação:</span> {team.formation}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {players.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Elenco detalhado disponível em breve para esta seleção (dados resumidos no protótipo).
          </div>
        ) : (
          <>
            <FilterBar className="grid-cols-1 sm:grid-cols-2">
              <select className={filterInputClass} value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
                <option value="all">Todas posições</option>
                {positionList.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className={filterInputClass} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="number">Ordenar: nº camisa</option>
                <option value="age">Ordenar: idade</option>
                <option value="height">Ordenar: altura</option>
                <option value="club">Ordenar: clube</option>
              </select>
            </FilterBar>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((p) => <PlayerCard key={p.id} player={p} />)}
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}

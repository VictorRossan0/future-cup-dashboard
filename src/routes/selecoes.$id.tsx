import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getTeam } from "@/data/teams";
import type { Player } from "@/data/teams";
import { ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

const positions: Player["position"][] = ["Goleiro", "Defensor", "Meio-campista", "Atacante"];

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

  const inputClass = "bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";

  return (
    <AppLayout>
      {/* Hero */}
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

      {/* Roster */}
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {players.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Elenco detalhado disponível em breve para esta seleção (dados resumidos no protótipo).
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select className={`${inputClass} sm:col-span-2`} value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
                <option value="all">Todas posições</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className={`${inputClass} sm:col-span-2`} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="number">Ordenar: nº camisa</option>
                <option value="age">Ordenar: idade</option>
                <option value="height">Ordenar: altura</option>
                <option value="club">Ordenar: clube</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((p) => <PlayerCard key={p.id} player={p} />)}
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const statusColor = {
    "Titular provável": "text-primary",
    "Reserva": "text-muted-foreground",
    "Dúvida": "text-warning",
  }[player.status];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-xl bg-gradient-green grid place-items-center font-display font-bold text-xl text-primary-foreground shrink-0">
          {player.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{player.name}</h3>
            {player.captain && <Star className="size-3.5 text-gold fill-gold" />}
          </div>
          <div className="text-xs text-muted-foreground">{player.position}</div>
          <div className={cn("text-[10px] uppercase tracking-widest mt-1", statusColor)}>{player.status}</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
        <div><div className="text-muted-foreground text-[10px]">Idade</div><div className="tabular-nums">{player.age}</div></div>
        <div><div className="text-muted-foreground text-[10px]">Altura</div><div className="tabular-nums">{player.height.toFixed(2)}m</div></div>
        <div><div className="text-muted-foreground text-[10px]">Peso</div><div className="tabular-nums">{player.weight}kg</div></div>
      </div>
      <div className="mt-2 text-xs">
        <div className="text-muted-foreground text-[10px]">Clube</div>
        <div className="truncate">{player.club} <span className="text-muted-foreground">· {player.league} ({player.clubCountry})</span></div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PlayerCardView } from "@/components/PlayerCardView";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { useTeams, usePlayers } from "@/hooks/useCopa";
import { ArrowLeft, Search } from "lucide-react";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/selecoes/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Seleção ${params.id} · Copa 2026 Data Hub` },
      { name: "description", content: `Elenco, técnico e estatísticas da seleção.` },
    ],
  }),
  component: TeamDetail,
});

const POSITIONS = ["goalkeeper", "defender", "midfielder", "forward"] as const;

function TeamDetail() {
  const { id } = Route.useParams();
  const teamsQ = useTeams();
  const playersQ = usePlayers({ team_id: id });

  const team = teamsQ.data?.data.find((tt) => tt.team_id === id);

  const [posFilter, setPosFilter] = useState<string>("all");
  const [clubFilter, setClubFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"number" | "age" | "height" | "club">("number");
  const PAGE_SIZE = 24;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [posFilter, clubFilter, search, sort, id]);

  const players = playersQ.data?.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const c = clubFilter.toLowerCase();
    const list = players.filter((p) => {
      if (posFilter !== "all" && p.position !== posFilter) return false;
      if (c && !(p.club ?? "").toLowerCase().includes(c)) return false;
      if (q && !p.player_name.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "number") return (a.jersey_number ?? 99) - (b.jersey_number ?? 99);
      if (sort === "age") return (a.age ?? 0) - (b.age ?? 0);
      if (sort === "height") return (b.height_cm ?? 0) - (a.height_cm ?? 0);
      return (a.club ?? "").localeCompare(b.club ?? "");
    });
  }, [players, posFilter, clubFilter, search, sort]);

  return (
    <AppLayout>
      <section className="bg-gradient-hero border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <Link to="/selecoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
          {teamsQ.isLoading ? (
            <div className="mt-4 h-24 animate-pulse bg-card/40 rounded-xl" />
          ) : !team ? (
            <div className="mt-4">
              <h1 className="font-display text-3xl font-bold">Seleção não encontrada</h1>
              <p className="text-sm text-muted-foreground mt-1">ID: {id}</p>
            </div>
          ) : (
            <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gold">
                  {team.group_code ? `Grupo ${team.group_code} · ` : ""}{team.confederation ?? ""}
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-bold mt-1">{team.team_name}</h1>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span><span className="text-muted-foreground">Código:</span> <span className="font-mono text-gold">{team.team_code}</span></span>
                  <span><span className="text-muted-foreground">Técnico:</span> {team.coach_name ?? "—"}</span>
                  {team.coach_nationality && <span><span className="text-muted-foreground">Nacionalidade:</span> {team.coach_nationality}</span>}
                  {team.coach_age != null && <span><span className="text-muted-foreground">Idade:</span> {team.coach_age}</span>}
                  <span><span className="text-muted-foreground">Status do elenco:</span> {team.squad_status ?? "—"}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Elenco: {team.total_players ?? 0} · GOL {team.goalkeeper_count ?? 0} · DEF {team.defender_count ?? 0} · MEI {team.midfielder_count ?? 0} · ATA {team.forward_count ?? 0}
                </div>
              </div>
              {playersQ.data && <SourceBadge source={playersQ.data.source} />}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <FilterBar className="grid-cols-1 sm:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar jogador..."
              className={`${filterInputClass} pl-9 w-full`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={filterInputClass} value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
            <option value="all">Todas posições</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{t.position(p)}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filtrar por clube..."
            className={filterInputClass}
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
          />
          <select className={filterInputClass} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="number">Ordenar: nº camisa</option>
            <option value="age">Ordenar: idade</option>
            <option value="height">Ordenar: altura</option>
            <option value="club">Ordenar: clube</option>
          </select>
        </FilterBar>

        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />

        {playersQ.isLoading ? (
          <LoadingGrid count={9} />
        ) : playersQ.isError ? (
          <ErrorState />
        ) : filtered.length === 0 ? (
          <EmptyState title="Sem jogadores" description="Nenhum jogador cadastrado ou os filtros excluíram todos." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => (
              <PlayerCardView key={p.player_id} player={p} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

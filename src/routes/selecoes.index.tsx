import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TeamCardView } from "@/components/TeamCardView";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { useTeams } from "@/hooks/useCopa";
import { Search } from "lucide-react";

export const Route = createFileRoute("/selecoes/")({
  head: () => ({
    meta: [
      { title: "Seleções · Copa 2026 Data Hub" },
      { name: "description", content: "As 48 seleções da Copa do Mundo 2026 com técnico, grupo, confederação e status do elenco." },
    ],
  }),
  component: SelecoesPage,
});

function SelecoesPage() {
  const q = useTeams();
  const all = q.data?.data ?? [];

  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [conf, setConf] = useState("all");

  const opts = useMemo(() => {
    const groups = Array.from(new Set(all.map((t) => t.group_code).filter(Boolean))) as string[];
    const confs = Array.from(new Set(all.map((t) => t.confederation).filter(Boolean))) as string[];
    return { groups: groups.sort(), confs: confs.sort() };
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return all.filter((t) => {
      if (group !== "all" && t.group_code !== group) return false;
      if (conf !== "all" && t.confederation !== conf) return false;
      if (q && !t.team_name.toLowerCase().includes(q) && !(t.team_code ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, search, group, conf]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <PageHeader
          kicker="48 seleções"
          title="Seleções"
          description='Explore as seleções participantes. Clique em "Ver elenco" para detalhes.'
          right={q.data && <SourceBadge source={q.data.source} />}
        />

        <FilterBar className="grid-cols-1 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar seleção..."
              className={`${filterInputClass} pl-9 w-full`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={filterInputClass} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Todos os grupos</option>
            {opts.groups.map((g) => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
          <select className={filterInputClass} value={conf} onChange={(e) => setConf(e.target.value)}>
            <option value="all">Todas as confederações</option>
            {opts.confs.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterBar>

        {q.isLoading ? (
          <LoadingGrid count={8} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        ) : q.isError ? (
          <ErrorState />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nenhuma seleção encontrada" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t) => <TeamCardView key={t.team_id} team={t} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

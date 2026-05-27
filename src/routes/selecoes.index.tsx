import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TeamCard } from "@/components/TeamCard";
import { PageHeader } from "@/components/PageHeader";
import { FilterBar, filterInputClass } from "@/components/FilterBar";
import { teams } from "@/data/teams";
import { groupLetters, confederations } from "@/data/competition";
import { Search } from "lucide-react";

export const Route = createFileRoute("/selecoes/")({
  head: () => ({
    meta: [
      { title: "Seleções · Copa 2026 Data Hub" },
      { name: "description", content: "As 48 seleções da Copa do Mundo 2026 com busca, filtros por grupo e confederação." },
    ],
  }),
  component: SelecoesPage,
});

function SelecoesPage() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [conf, setConf] = useState("all");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return teams.filter((t) => {
      if (group !== "all" && t.group !== group) return false;
      if (conf !== "all" && t.confederation !== conf) return false;
      if (ql && !t.name.toLowerCase().includes(ql) && !t.code.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [q, group, conf]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <PageHeader
          kicker="48 seleções"
          title="Seleções"
          description='Explore as seleções participantes. Clique em "Ver elenco" para detalhes.'
        />

        <FilterBar className="grid-cols-1 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar seleção..."
              className={`${filterInputClass} pl-9 w-full`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className={filterInputClass} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="all">Todos os grupos</option>
            {groupLetters.map((g) => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
          <select className={filterInputClass} value={conf} onChange={(e) => setConf(e.target.value)}>
            <option value="all">Todas as confederações</option>
            {confederations.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterBar>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t) => <TeamCard key={t.id} team={t} />)}
        </div>
      </div>
    </AppLayout>
  );
}

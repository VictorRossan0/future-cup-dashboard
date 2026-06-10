import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GroupTableView } from "@/components/GroupTableView";
import { PageHeader } from "@/components/PageHeader";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { useGroupsStandings } from "@/hooks/useCopa";
import { Info } from "lucide-react";

export const Route = createFileRoute("/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos e Classificação · Copa 2026 Intelligence" },
      { name: "description", content: "Classificação dos 12 grupos da Copa 2026 com pontos, vitórias, saldo de gols e status de classificação." },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  const q = useGroupsStandings();
  const rows = q.data?.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const row of rows) {
      const arr = map.get(row.group_code) ?? [];
      arr.push(row);
      map.set(row.group_code, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rows]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <PageHeader
          kicker="Fase de Grupos"
          title="Grupos e Classificação"
          description={
            <>
              12 grupos com 4 seleções cada. Os <span className="text-primary font-medium">dois primeiros</span> avançam direto e os <span className="text-gold font-medium">8 melhores terceiros</span> também se classificam.
            </>
          }
          right={q.data && <SourceBadge source={q.data.source} />}
        />

        <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 flex items-start gap-3">
          <Info className="size-4 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            A classificação inicial está zerada porque a Copa ainda não começou.
          </p>
        </div>

        {q.isLoading ? (
          <LoadingGrid count={6} className="md:grid-cols-2 lg:grid-cols-2" />
        ) : q.isError ? (
          <ErrorState />
        ) : grouped.length === 0 ? (
          <EmptyState title="Sem grupos cadastrados" description="Popule v_groups_standings para visualizar a classificação." />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {grouped.map(([letter, rs]) => <GroupTableView key={letter} letter={letter} rows={rs} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

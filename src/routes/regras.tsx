import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { FormatOverview } from "@/components/FormatOverview";
import { useRules } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/regras")({
  head: () => ({
    meta: [
      { title: "Regras e Formato · Copa 2026 Intelligence" },
      { name: "description", content: "Formato da competição, fase de grupos, critérios de classificação, mata-mata, arbitragem, VAR e regras anti-cera." },
    ],
  }),
  component: RegrasPage,
});

function RegrasPage() {
  const q = useRules();
  const rules = q.data?.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof rules>();
    for (const r of rules) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return Array.from(map.entries());
  }, [rules]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <PageHeader
          kicker="Regulamento"
          title="Regras e Formato"
          description="Regras oficiais da Copa do Mundo FIFA 2026, organizadas por categoria."
          right={q.data && <SourceBadge source={q.data.source} />}
        />

        {q.isLoading ? (
          <LoadingGrid count={6} />
        ) : q.isError ? (
          <ErrorState />
        ) : grouped.length === 0 ? (
          <EmptyState title="Sem regras cadastradas" description="Popule v_rules_ordered para visualizar as regras." />
        ) : (
          <>
            <FormatOverview rules={rules} />

            {grouped.map(([cat, list]) => (
            <section key={cat}>
              <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                <BookOpen className="size-5 text-info" /> {t.ruleCat(cat)}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((r, i) => (
                  <div key={r.rule_id ?? `${cat}-${i}`} className="rounded-2xl border border-border bg-card p-5">
                    {r.title && <h3 className="font-semibold">{r.title}</h3>}
                    {r.description && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{r.description}</p>}
                  </div>
                ))}
              </div>
            </section>
            ))}
          </>
        )}
      </div>
    </AppLayout>
  );
}

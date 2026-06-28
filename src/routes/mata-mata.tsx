import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MatchCardView } from "@/components/MatchCardView";
import { PageHeader } from "@/components/PageHeader";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { ThirdPlaceRanking } from "@/components/ThirdPlaceRanking";
import { useMatches } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";

const KNOCKOUT_STAGES = ["round_of_32", "round_of_16", "quarter_final", "semi_final", "third_place", "final"] as const;

export const Route = createFileRoute("/mata-mata")({
  head: () => ({
    meta: [
      { title: "Mata-mata · Copa 2026 Intelligence" },
      {
        name: "description",
        content: "Chaveamento e jogos do mata-mata da Copa 2026: 32 avos, oitavas, quartas, semifinais e final.",
      },
    ],
  }),
  component: MataMataPage,
});

function MataMataPage() {
  const q = useMatches();
  const all = q.data?.data ?? [];

  const byStage = useMemo(() => {
    const map = new Map<string, typeof all>();
    for (const s of KNOCKOUT_STAGES) map.set(s, []);
    for (const m of all) {
      if (KNOCKOUT_STAGES.includes(m.stage as (typeof KNOCKOUT_STAGES)[number])) {
        map.get(m.stage)!.push(m);
      }
    }
    return map;
  }, [all]);

  const hasAny = Array.from(byStage.values()).some((arr) => arr.length > 0);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <PageHeader
          kicker="Eliminatórias"
          title="Mata-mata"
          description="Fases eliminatórias da Copa 2026, do Round of 32 até a Final."
          right={q.data && <SourceBadge source={q.data.source} />}
        />

        <ThirdPlaceRanking />

        {q.isLoading ? (
          <LoadingGrid count={6} />
        ) : q.isError ? (
          <ErrorState />
        ) : !hasAny ? (
          <EmptyState
            title="Sem jogos de mata-mata"
            description="Os confrontos eliminatórios serão exibidos assim que estiverem disponíveis na base."
          />
        ) : (
          KNOCKOUT_STAGES.map((stage) => {
            const list = byStage.get(stage) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={stage}>
                <h2 className="font-display text-xl font-bold mb-3">{t.stage(stage)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {list.map((m) => (
                    <MatchCardView key={`${m.match_number}-${m.match_id ?? stage}`} match={m} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { LoadingGrid, ErrorState, EmptyState, SourceBadge } from "@/components/DataState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/TeamFlag";
import {
  Users, Trophy, Medal, Star, Sparkles, TrendingDown, ShieldAlert,
  BarChart3, ArrowRight,
} from "lucide-react";
import { useAiSimulationsFull, useAiSimulationConsensus } from "@/hooks/useCopa";
import type {
  VAiSimulationsFull, AiConsensusItem, VAiSimulationConsensus,
} from "@/types/views";

export const Route = createFileRoute("/consenso")({
  head: () => ({
    meta: [
      { title: "Consenso das IAs · Copa 2026 Intelligence" },
      { name: "description", content: "Ranking visual do consenso entre IAs sobre campeão, vice, artilheiro e melhor jovem da Copa do Mundo FIFA 2026." },
      { property: "og:title", content: "Consenso das IAs · Copa 2026 Intelligence" },
      { property: "og:description", content: "Quem é favorito segundo o cruzamento das previsões de múltiplas IAs." },
    ],
  }),
  component: ConsensoPage,
});

const asArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const pct = (n?: number | null) =>
  typeof n === "number" && isFinite(n) ? `${Math.round(n * 100)}%` : "—";

function computePlayerConsensus(
  sims: VAiSimulationsFull[],
  nameKey: keyof VAiSimulationsFull,
  teamKey: keyof VAiSimulationsFull,
  codeKey: keyof VAiSimulationsFull,
): AiConsensusItem[] {
  const map = new Map<string, AiConsensusItem>();
  for (const s of sims) {
    const name = s[nameKey] as string | null | undefined;
    if (!name) continue;
    const key = name.trim().toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.votes += 1;
      if (s.provider && !existing.providers.includes(s.provider)) existing.providers.push(s.provider);
    } else {
      map.set(key, {
        team: name,
        team_code: (s[teamKey] as string | null) ?? null,
        group_code: (s[codeKey] as string | null) ?? null,
        votes: 1,
        providers: s.provider ? [s.provider] : [],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.votes - a.votes);
}

function computeBestPlayerConsensus(sims: VAiSimulationsFull[]): AiConsensusItem[] {
  return computePlayerConsensus(sims, "best_player_name", "best_player_team", "best_player_team_code");
}

function ConsensoPage() {
  const simsQ = useAiSimulationsFull();
  const consQ = useAiSimulationConsensus();

  const sims = simsQ.data?.data ?? [];
  const consensus: VAiSimulationConsensus | null = consQ.data?.data ?? null;
  const source = simsQ.data?.source ?? "supabase";
  const total = consensus?.total_simulations ?? sims.length;

  const topScorer = computePlayerConsensus(sims, "top_scorer_player", "top_scorer_team", "top_scorer_team_code");
  const bestYoung = computePlayerConsensus(sims, "best_young_player_name", "best_young_player_team", "best_young_player_team_code");
  const bestPlayer = computeBestPlayerConsensus(sims);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-elegant">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-gradient-gold opacity-20 blur-3xl pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-gold">Consenso · IA cruzada</div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 flex items-center gap-3">
                <span className="size-11 shrink-0 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant">
                  <Users className="size-5" />
                </span>
                <span className="truncate">Consenso das IAs</span>
              </h1>
              <p className="text-muted-foreground mt-3">
                Ranking visual de quem cada modelo aposta como favorito. Quanto maior a barra,
                maior o número de IAs que concordam com a previsão.
              </p>
            </div>
            <SourceBadge source={source} />
          </div>
          <div className="relative mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5">
              <BarChart3 className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">{total}</span>
              <span className="text-muted-foreground">simulações analisadas</span>
            </span>
            <Link
              to="/simulacoes"
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Ver simulações individuais <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>

        {(simsQ.isError || consQ.isError) && <ErrorState />}

        {simsQ.isLoading ? (
          <LoadingGrid count={4} />
        ) : sims.length === 0 ? (
          <EmptyState title="Sem simulações" description="Nenhuma simulação disponível ainda." />
        ) : (
          <>
            {/* DESTAQUES — 4 cards principais */}
            <section className="grid gap-4 sm:grid-cols-2">
              <HighlightCard
                label="Campeão mais votado"
                icon={<Trophy className="size-5" />}
                tone="gold"
                pick={consensus?.champion_consensus?.[0]}
                total={total}
              />
              <HighlightCard
                label="Vice mais votado"
                icon={<Medal className="size-5" />}
                tone="primary"
                pick={consensus?.runner_up_consensus?.[0]}
                total={total}
              />
              <HighlightCard
                label="Artilheiro mais votado"
                icon={<Star className="size-5" />}
                tone="gold"
                pick={topScorer[0]}
                total={total}
                isPlayer
              />
              <HighlightCard
                label="Melhor jovem mais votado"
                icon={<Sparkles className="size-5" />}
                tone="primary"
                pick={bestYoung[0]}
                total={total}
                isPlayer
              />
            </section>

            {/* RANKINGS COMPLETOS */}
            <section className="grid gap-4 lg:grid-cols-2">
              <RankingCard
                title="Campeão"
                icon={<Trophy className="size-4" />}
                tone="gold"
                items={consensus?.champion_consensus}
                total={total}
              />
              <RankingCard
                title="Vice-campeão"
                icon={<Medal className="size-4" />}
                tone="primary"
                items={consensus?.runner_up_consensus}
                total={total}
              />
              <RankingCard
                title="Artilheiro"
                icon={<Star className="size-4" />}
                tone="gold"
                items={topScorer}
                total={total}
                isPlayer
              />
              <RankingCard
                title="Melhor jovem"
                icon={<Sparkles className="size-4" />}
                tone="primary"
                items={bestYoung}
                total={total}
                isPlayer
              />
              {bestPlayer.length > 0 && (
                <RankingCard
                  title="Melhor jogador"
                  icon={<Star className="size-4" />}
                  tone="gold"
                  items={bestPlayer}
                  total={total}
                  isPlayer
                />
              )}
              <RankingCard
                title="Surpresa"
                icon={<Sparkles className="size-4" />}
                tone="gold"
                items={consensus?.surprise_consensus}
                total={total}
              />
              <RankingCard
                title="Decepção"
                icon={<TrendingDown className="size-4" />}
                tone="destructive"
                items={consensus?.disappointment_consensus}
                total={total}
              />
              <RankingCard
                title="Grupo da morte"
                icon={<ShieldAlert className="size-4" />}
                tone="warn"
                items={consensus?.group_of_death_consensus}
                total={total}
                isGroup
              />
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}

// --- components -----------------------------------------------------------

type Tone = "gold" | "primary" | "destructive" | "warn";

function toneBg(tone: Tone) {
  return {
    gold: "bg-gradient-gold text-gold-foreground",
    primary: "bg-gradient-green text-primary-foreground",
    destructive: "bg-destructive/15 text-destructive",
    warn: "bg-info/15 text-info",
  }[tone];
}

function toneBar(tone: Tone) {
  return {
    gold: "bg-gradient-gold",
    primary: "bg-primary",
    destructive: "bg-destructive",
    warn: "bg-info",
  }[tone];
}

function HighlightCard({
  label, icon, tone, pick, total, isPlayer,
}: {
  label: string; icon: React.ReactNode; tone: Tone;
  pick?: AiConsensusItem | null; total: number; isPlayer?: boolean;
}) {
  const share = pick && total > 0 ? Math.round((pick.votes / total) * 100) : 0;
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className={`size-8 shrink-0 rounded-xl grid place-items-center ${toneBg(tone)}`}>{icon}</span>
          <span className="truncate">{label}</span>
        </div>

        {pick ? (
          <>
            <div className="mt-4 flex items-center gap-2 min-w-0">
              {!isPlayer && pick.team_code && (
                <TeamFlag teamCode={pick.team_code} teamName={pick.team} size={28} />
              )}
              <div className="font-display text-2xl sm:text-3xl font-bold truncate">
                {pick.team ?? "—"}
              </div>
            </div>
            {isPlayer && pick.team_code && (
              <div className="mt-1 text-xs text-muted-foreground">{pick.team_code}</div>
            )}

            <div className="mt-4 flex items-baseline justify-between gap-2">
              <span className="font-display text-3xl font-extrabold text-foreground">{share}%</span>
              <span className="text-xs text-muted-foreground">{pick.votes} de {total} IAs</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full ${toneBar(tone)}`} style={{ width: `${share}%` }} />
            </div>

            {asArray(pick.providers).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pick.providers.map((p) => (
                  <Badge key={p} variant="outline" className="rounded-full text-[10px]">{p}</Badge>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">—</div>
        )}
      </CardContent>
    </Card>
  );
}

function RankingCard({
  title, icon, tone, items, total, isGroup, isPlayer,
}: {
  title: string; icon: React.ReactNode; tone: Tone;
  items?: AiConsensusItem[] | null; total: number;
  isGroup?: boolean; isPlayer?: boolean;
}) {
  const list = asArray(items);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={`size-7 shrink-0 rounded-lg grid place-items-center ${toneBg(tone)}`}>{icon}</span>
          <span className="truncate">{title}</span>
          <Badge variant="outline" className="ml-auto shrink-0 text-[10px] rounded-full">
            {list.length} opções
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados disponíveis.</p>
        ) : (
          list.map((it, i) => (
            <RankingRow
              key={`${it.team}-${i}`}
              rank={i + 1}
              item={it}
              total={total}
              tone={tone}
              isGroup={isGroup}
              isPlayer={isPlayer}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function RankingRow({
  rank, item, total, tone, isGroup, isPlayer,
}: {
  rank: number; item: AiConsensusItem; total: number; tone: Tone;
  isGroup?: boolean; isPlayer?: boolean;
}) {
  const share = total > 0 ? Math.round((item.votes / total) * 100) : 0;
  const isTop = rank === 1;
  const label = isGroup ? `Grupo ${item.group_code ?? "?"}` : (item.team ?? "—");
  const showFlag = !isGroup && !isPlayer;

  return (
    <div className={`rounded-lg border p-3 transition-colors ${
      isTop ? "border-gold/40 bg-gold/5" : "border-border bg-secondary/30"
    }`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <span className={`size-6 shrink-0 rounded-md grid place-items-center text-[11px] font-bold ${
          isTop ? "bg-gradient-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
        }`}>
          {rank}
        </span>
        <div className="min-w-0 flex items-center gap-1.5">
          {showFlag && <TeamFlag teamCode={item.team_code} teamName={item.team} size={18} />}
          <span className="truncate text-sm font-medium">{label}</span>
          {isPlayer && item.team_code && (
            <span className="text-[10px] text-muted-foreground shrink-0">· {item.team_code}</span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-sm font-bold">{share}%</div>
          <div className="text-[10px] text-muted-foreground">{item.votes}/{total}</div>
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${isTop ? toneBar(tone) : "bg-primary/50"}`} style={{ width: `${share}%` }} />
      </div>
      {asArray(item.providers).length > 0 && (
        <div className="mt-1.5 text-[10px] text-muted-foreground truncate">
          {item.providers.join(" · ")}
        </div>
      )}
      {typeof item.avg_confidence === "number" && (
        <div className="text-[10px] text-muted-foreground">
          Confiança média: {pct(item.avg_confidence)}
        </div>
      )}
    </div>
  );
}

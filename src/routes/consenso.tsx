import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { LoadingGrid, ErrorState, EmptyState, SourceBadge } from "@/components/DataState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/TeamFlag";
import {
  Users, Trophy, Medal, Star, Sparkles, TrendingDown, ShieldAlert,
  BarChart3, ArrowRight, Brain, Crown, Activity, CheckCircle2,
  Database, Layers, Target,
} from "lucide-react";
import { useAiSimulationsFull, useAiSimulationConsensus } from "@/hooks/useCopa";
import type {
  VAiSimulationsFull, AiConsensusItem, VAiSimulationConsensus,
} from "@/types/views";

export const Route = createFileRoute("/consenso")({
  head: () => ({
    meta: [
      { title: "Consenso Global das IAs · Copa 2026 Intelligence" },
      { name: "description", content: "Resultado consolidado das previsões realizadas pelas principais Inteligências Artificiais para a Copa do Mundo FIFA 2026." },
      { property: "og:title", content: "Consenso Global das IAs · Copa 2026 Intelligence" },
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

function consensusBadge(item: AiConsensusItem | undefined, total: number, listLen: number) {
  if (!item || total <= 0) return null;
  const share = item.votes / total;
  if (item.votes === total && total > 1) return { label: "Unanimidade", tone: "gold" as const };
  if (share >= 0.6) return { label: "Maior Consenso", tone: "primary" as const };
  if (listLen >= 4 && share <= 0.35) return { label: "Dividido", tone: "warn" as const };
  if (share <= 0.2 && total >= 3) return { label: "Surpresa", tone: "destructive" as const };
  return null;
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

  const champions = asArray(consensus?.champion_consensus);
  const runnerUps = asArray(consensus?.runner_up_consensus);
  const championLeader = champions[0];
  const providers = Array.from(new Set(sims.map((s) => s.provider).filter(Boolean) as string[]));

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
        {/* HERO PREMIUM */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 p-6 sm:p-10 shadow-elegant">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-gradient-gold opacity-25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/30 opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                <Brain className="size-3.5" /> Inteligência Cruzada
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 flex items-start gap-3 sm:gap-4">
                <span className="size-12 sm:size-14 shrink-0 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant">
                  <Crown className="size-6 sm:size-7" />
                </span>
                <span className="leading-tight">Consenso Global das Inteligências Artificiais</span>
              </h1>
              <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
                Resultado consolidado das previsões realizadas pelas principais IAs para a
                Copa do Mundo FIFA 2026. Quanto maior a concordância entre os modelos,
                maior a representatividade do prognóstico.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5">
                  <Activity className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{total}</span>
                  <span className="text-muted-foreground">simulações</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5">
                  <Brain className="size-3.5 text-gold" />
                  <span className="font-semibold text-foreground">{providers.length}</span>
                  <span className="text-muted-foreground">IAs participantes</span>
                </span>
                <Link
                  to="/simulacoes"
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Ver simulações <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
            <SourceBadge source={source} />
          </div>
        </section>

        {(simsQ.isError || consQ.isError) && <ErrorState />}

        {simsQ.isLoading ? (
          <LoadingGrid count={4} />
        ) : sims.length === 0 ? (
          <EmptyState title="Sem simulações" description="Nenhuma simulação disponível ainda." />
        ) : (
          <>
            {/* DESTAQUES PRINCIPAIS */}
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Destaques"
                title="Previsões em destaque"
                description="Os nomes mais votados pelas IAs nas categorias-chave da Copa."
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <HighlightCard
                  label="Campeão mais votado"
                  icon={<Trophy className="size-5" />}
                  tone="gold"
                  pick={championLeader}
                  total={total}
                  featured
                />
                <HighlightCard
                  label="Vice mais votado"
                  icon={<Medal className="size-5" />}
                  tone="primary"
                  pick={runnerUps[0]}
                  total={total}
                />
                <HighlightCard
                  label="Melhor jogador"
                  icon={<Star className="size-5" />}
                  tone="primary"
                  pick={bestPlayer[0] ?? bestYoung[0]}
                  total={total}
                  isPlayer
                />
                <HighlightCard
                  label="Artilheiro mais votado"
                  icon={<Sparkles className="size-5" />}
                  tone="gold"
                  pick={topScorer[0]}
                  total={total}
                  isPlayer
                />
              </div>
            </section>

            {/* FAVORITOS AO TÍTULO — pódio */}
            {champions.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  eyebrow="Ranking"
                  title="Favoritos ao Título"
                  description="As seleções mais cotadas para erguer a taça segundo o cruzamento das IAs."
                />
                <Card className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    {champions.slice(0, 5).map((it, i) => (
                      <PodiumRow key={`${it.team}-${i}`} rank={i + 1} item={it} total={total} />
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* CONSENSO POR IA */}
            {champions.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  eyebrow="Concordância"
                  title="Consenso por IA"
                  description="Quantas Inteligências Artificiais apostam em cada candidato ao título."
                />
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {champions.map((it, i) => (
                        <div
                          key={`chip-${it.team}-${i}`}
                          className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                            i === 0
                              ? "border-gold/40 bg-gold/10 text-foreground"
                              : "border-border bg-secondary/40 text-foreground hover:bg-secondary/60"
                          }`}
                        >
                          <TeamFlag teamCode={it.team_code} teamName={it.team} size={16} />
                          <span className="font-medium">{it.team}</span>
                          <span className="rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold text-foreground/80">
                            {it.votes} {it.votes === 1 ? "IA" : "IAs"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* DISTRIBUIÇÕES (gráficos de barra) */}
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Distribuição"
                title="Visualização estatística"
                description="Como as previsões se distribuem entre os modelos."
              />
              <div className="grid gap-4 lg:grid-cols-3">
                <DistributionCard
                  title="Campeões previstos"
                  icon={<Trophy className="size-4" />}
                  tone="gold"
                  items={champions}
                  total={total}
                />
                <DistributionCard
                  title="Artilheiros previstos"
                  icon={<Star className="size-4" />}
                  tone="primary"
                  items={topScorer}
                  total={total}
                  isPlayer
                />
                <DistributionCard
                  title="Melhores jogadores"
                  icon={<Sparkles className="size-4" />}
                  tone="gold"
                  items={bestPlayer.length > 0 ? bestPlayer : bestYoung}
                  total={total}
                  isPlayer
                />
              </div>
            </section>

            {/* RANKINGS DETALHADOS */}
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Detalhe"
                title="Rankings completos"
                description="Consenso completo em todas as categorias avaliadas."
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <RankingCard
                  title="Vice-campeão"
                  icon={<Medal className="size-4" />}
                  tone="primary"
                  items={runnerUps}
                  total={total}
                />
                <RankingCard
                  title="Melhor jovem"
                  icon={<Sparkles className="size-4" />}
                  tone="primary"
                  items={bestYoung}
                  total={total}
                  isPlayer
                />
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
              </div>
            </section>

            {/* COMO O CONSENSO É CALCULADO */}
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Metodologia"
                title="Como o Consenso é Calculado"
                description="O consenso representa a consolidação das previsões realizadas por múltiplas Inteligências Artificiais. Quanto maior a frequência de uma previsão entre os modelos, maior sua representatividade dentro da plataforma."
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MethodStep
                  icon={<Database className="size-5" />}
                  step="01"
                  title="Simulações"
                  description="Cada IA gera previsões independentes sobre a Copa."
                />
                <MethodStep
                  icon={<Layers className="size-5" />}
                  step="02"
                  title="Frequência"
                  description="Cruzamos as escolhas e contamos quantas vezes cada nome aparece."
                />
                <MethodStep
                  icon={<Activity className="size-5" />}
                  step="03"
                  title="Consenso"
                  description="Quanto mais IAs convergem, maior o peso da previsão."
                />
                <MethodStep
                  icon={<Target className="size-5" />}
                  step="04"
                  title="Resultado Final"
                  description="Ranking consolidado pronto para leitura e divulgação."
                />
              </div>
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

function toneBadge(tone: Tone) {
  return {
    gold: "border-gold/40 bg-gold/15 text-gold",
    primary: "border-primary/40 bg-primary/15 text-primary",
    destructive: "border-destructive/40 bg-destructive/15 text-destructive",
    warn: "border-info/40 bg-info/15 text-info",
  }[tone];
}

function SectionHeader({
  eyebrow, title, description,
}: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] uppercase tracking-widest text-gold">{eyebrow}</div>
      <h2 className="font-display text-xl sm:text-2xl font-bold">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>
      )}
    </div>
  );
}

function HighlightCard({
  label, icon, tone, pick, total, isPlayer, featured,
}: {
  label: string; icon: React.ReactNode; tone: Tone;
  pick?: AiConsensusItem | null; total: number; isPlayer?: boolean; featured?: boolean;
}) {
  const share = pick && total > 0 ? Math.round((pick.votes / total) * 100) : 0;
  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        featured
          ? "border-gold/50 shadow-[0_0_0_1px_var(--gold)/20,0_18px_50px_-20px_color-mix(in_oklab,var(--gold)_45%,transparent)]"
          : ""
      }`}
    >
      {featured && (
        <>
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-gold opacity-15 blur-3xl pointer-events-none" />
          <Badge className="absolute top-3 right-3 bg-gradient-gold text-gold-foreground border-0 rounded-full text-[10px] uppercase tracking-wider px-2.5 py-0.5">
            <Crown className="size-3 mr-1" /> Favorito Geral
          </Badge>
        </>
      )}
      <CardContent className="p-5 sm:p-6 relative">
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
                {pick.providers.slice(0, 4).map((p) => (
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

function PodiumRow({ rank, item, total }: { rank: number; item: AiConsensusItem; total: number }) {
  const share = total > 0 ? Math.round((item.votes / total) * 100) : 0;
  const podiumTone =
    rank === 1 ? "bg-gradient-gold text-gold-foreground" :
    rank === 2 ? "bg-secondary text-secondary-foreground border border-border" :
    rank === 3 ? "bg-amber-900/30 text-amber-200 border border-amber-700/40" :
    "bg-secondary/50 text-muted-foreground";

  return (
    <div className={`rounded-xl border p-3 sm:p-4 ${
      rank === 1 ? "border-gold/40 bg-gold/5" : "border-border bg-secondary/30"
    }`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <span className={`size-9 sm:size-10 shrink-0 rounded-xl grid place-items-center text-sm font-extrabold font-display ${podiumTone}`}>
          {rank}
        </span>
        <div className="min-w-0 flex items-center gap-2.5">
          <TeamFlag teamCode={item.team_code} teamName={item.team} size={24} />
          <div className="min-w-0">
            <div className="truncate font-display font-bold text-base sm:text-lg">{item.team}</div>
            {asArray(item.providers).length > 0 && (
              <div className="text-[10px] text-muted-foreground truncate">
                {item.providers.slice(0, 3).join(" · ")}
                {item.providers.length > 3 ? ` +${item.providers.length - 3}` : ""}
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-xl sm:text-2xl font-extrabold">{share}%</div>
          <div className="text-[10px] text-muted-foreground">{item.votes}/{total} IAs</div>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${rank === 1 ? "bg-gradient-gold" : "bg-primary"}`}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  );
}

function DistributionCard({
  title, icon, tone, items, total, isPlayer,
}: {
  title: string; icon: React.ReactNode; tone: Tone;
  items: AiConsensusItem[]; total: number; isPlayer?: boolean;
}) {
  const list = asArray(items).slice(0, 6);
  const badge = consensusBadge(list[0], total, asArray(items).length);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={`size-7 shrink-0 rounded-lg grid place-items-center ${toneBg(tone)}`}>{icon}</span>
          <span className="truncate">{title}</span>
          {badge && (
            <Badge variant="outline" className={`ml-auto shrink-0 rounded-full text-[10px] ${toneBadge(badge.tone)}`}>
              {badge.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados disponíveis.</p>
        ) : (
          list.map((it, i) => {
            const share = total > 0 ? Math.round((it.votes / total) * 100) : 0;
            return (
              <div key={`${it.team}-${i}`} className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  {!isPlayer && <TeamFlag teamCode={it.team_code} teamName={it.team} size={14} />}
                  <span className="truncate font-medium">{it.team}</span>
                  <span className="ml-auto shrink-0 font-display font-bold">{share}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${i === 0 ? toneBar(tone) : "bg-primary/40"}`} style={{ width: `${share}%` }} />
                </div>
              </div>
            );
          })
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
  const badge = consensusBadge(list[0], total, list.length);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={`size-7 shrink-0 rounded-lg grid place-items-center ${toneBg(tone)}`}>{icon}</span>
          <span className="truncate">{title}</span>
          {badge ? (
            <Badge variant="outline" className={`ml-auto shrink-0 rounded-full text-[10px] ${toneBadge(badge.tone)}`}>
              {badge.label}
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-auto shrink-0 text-[10px] rounded-full">
              {list.length} opções
            </Badge>
          )}
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

function MethodStep({
  icon, step, title, description,
}: { icon: React.ReactNode; step: string; title: string; description: string }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="size-10 rounded-xl bg-gradient-gold text-gold-foreground grid place-items-center shadow-elegant">
            {icon}
          </span>
          <span className="font-display text-2xl font-extrabold text-muted-foreground/40">{step}</span>
        </div>
        <h3 className="mt-3 font-display text-base font-bold flex items-center gap-1.5">
          <CheckCircle2 className="size-4 text-primary" /> {title}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

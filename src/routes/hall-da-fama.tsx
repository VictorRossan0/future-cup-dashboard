import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Crown,
  Clock,
  Trophy,
  Medal,
  Award,
  Target,
  TrendingUp,
  Flame,
  Star,
  Goal,
  ListChecks,
  Sparkles,
  CircleDashed,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useHallOfFame } from "@/hooks/useHallOfFame";
import { initialsFor, stageLabel, type ProviderStats } from "@/lib/hallOfFame";

export const Route = createFileRoute("/hall-da-fama")({
  head: () => ({
    meta: [
      { title: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      {
        name: "description",
        content:
          "Ranking real de precisão, pódio e conquistas das IAs durante a Copa do Mundo FIFA 2026, calculado a partir dos resultados oficiais.",
      },
      { property: "og:title", content: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      {
        property: "og:description",
        content:
          "Ranking de precisão, pódio e conquistas das IAs durante a Copa do Mundo FIFA 2026.",
      },
    ],
    links: [{ rel: "canonical", href: "/hall-da-fama" }],
  }),
  component: HallDaFamaPage,
});

const CRITERIA = [
  { icon: Trophy, title: "Acerto do Vencedor", text: "3 pontos por partida cujo vencedor é previsto corretamente." },
  { icon: Goal, title: "Placar Exato", text: "+2 pontos de bônus quando a IA acerta o placar exato." },
  { icon: Target, title: "Erro Médio de Placar", text: "Menor diferença média entre placar previsto e placar real." },
  { icon: ListChecks, title: "Cobertura", text: "Total de partidas avaliadas — apenas jogos encerrados contam." },
  { icon: Star, title: "Fases Eliminatórias", text: "Desempenho ponderado por fase (grupos, mata-mata, final)." },
];

const TONE_BY_RANK = [
  "from-gold/40 to-gold/5",
  "from-zinc-300/30 to-zinc-300/5",
  "from-amber-700/30 to-amber-700/5",
  "from-emerald-500/25 to-emerald-500/5",
  "from-sky-500/25 to-sky-500/5",
  "from-violet-500/25 to-violet-500/5",
  "from-rose-500/25 to-rose-500/5",
  "from-cyan-500/25 to-cyan-500/5",
];

function HallDaFamaPage() {
  const { stats, podium, achievements, totalEvaluated, hasRealData, isLoading, isError, errorMessage, refetch, lastUpdated } = useHallOfFame();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-background to-background p-6 sm:p-12">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-4">
              <Crown className="size-3" /> Hall da Fama
            </div>
            <div className="flex items-start gap-4 mb-5">
              <div className="size-14 sm:size-16 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant shrink-0">
                <Trophy className="size-7 sm:size-8" />
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
                Hall da Fama das Inteligências Artificiais
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Ranking calculado em tempo real cruzando as previsões das IAs com os
              resultados oficiais publicados durante a Copa do Mundo FIFA 2026.
            </p>
          </div>
        </section>

        {/* STATUS */}
        <StatusCard
          hasRealData={hasRealData}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          totalEvaluated={totalEvaluated}
          lastUpdated={lastUpdated}
          onRefresh={refetch}
        />

        {/* PÓDIO */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Pódio"
            title="Pódio das IAs"
            subtitle={
              hasRealData
                ? "Os três modelos mais precisos até o momento."
                : "Aguardando as primeiras avaliações da Copa."
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end">
            <PodiumCard rank={2} stats={podium[1]} height="md:h-56" tone="from-zinc-300/30 to-zinc-300/5" Icon={Medal} iconClass="text-zinc-300" />
            <PodiumCard rank={1} stats={podium[0]} height="md:h-72" tone="from-gold/40 to-gold/5" Icon={Crown} iconClass="text-gold" featured />
            <PodiumCard rank={3} stats={podium[2]} height="md:h-48" tone="from-amber-700/30 to-amber-700/5" Icon={Award} iconClass="text-amber-600" />
          </div>
        </section>

        {/* RANKING */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Ranking"
            title="Ranking de Precisão"
            subtitle={
              hasRealData
                ? `Baseado em ${totalEvaluated} previsões avaliadas.`
                : "A tabela será preenchida assim que as primeiras partidas forem avaliadas."
            }
          />

          {stats.length === 0 ? (
            <EmptyState label="Nenhuma IA avaliada ainda" />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block rounded-2xl border border-border overflow-x-auto bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>IA</TableHead>
                      <TableHead className="text-right">Pontos</TableHead>
                      <TableHead className="text-right">Acertos</TableHead>
                      <TableHead className="text-right">Placar Exato</TableHead>
                      <TableHead className="text-right">Erro Médio</TableHead>
                      <TableHead className="w-48">Precisão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.map((s, idx) => (
                      <TableRow key={s.provider}>
                        <TableCell className="font-display font-bold">{idx + 1}º</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`size-9 rounded-xl grid place-items-center bg-gradient-to-br ${TONE_BY_RANK[idx] ?? TONE_BY_RANK[0]} border border-border text-xs font-bold shrink-0`}>
                              {initialsFor(s.provider)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{s.provider}</div>
                              <div className="text-xs text-muted-foreground">
                                {s.matchesPredicted} previsões
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-display font-bold">{s.totalPoints}</TableCell>
                        <TableCell className="text-right">{s.winnerHits}/{s.matchesPredicted}</TableCell>
                        <TableCell className="text-right">{s.exactScoreHits}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {s.avgScoreError != null ? s.avgScoreError.toFixed(2) : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={s.winnerAccuracy} className="h-2" />
                            <span className="text-xs font-medium tabular-nums w-12 text-right">
                              {s.winnerAccuracy.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="md:hidden grid gap-3">
                {stats.map((s, idx) => (
                  <Card key={s.provider}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`size-10 rounded-xl grid place-items-center bg-gradient-to-br ${TONE_BY_RANK[idx] ?? TONE_BY_RANK[0]} border border-border text-xs font-bold shrink-0`}>
                          {initialsFor(s.provider)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{s.provider}</div>
                          <div className="text-xs text-muted-foreground">{idx + 1}º lugar · {s.matchesPredicted} previsões</div>
                        </div>
                        <Badge className="bg-gold text-gold-foreground border-0 shrink-0">
                          {s.totalPoints} pts
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={s.winnerAccuracy} className="h-2" />
                        <span className="text-xs font-medium tabular-nums w-12 text-right">{s.winnerAccuracy.toFixed(1)}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <MiniStat label="Acertos" value={`${s.winnerHits}/${s.matchesPredicted}`} />
                        <MiniStat label="Placar Exato" value={String(s.exactScoreHits)} />
                        <MiniStat label="Erro Médio" value={s.avgScoreError != null ? s.avgScoreError.toFixed(2) : "—"} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>

        {/* PRECISÃO POR FASE */}
        {hasRealData && (
          <section className="space-y-5">
            <SectionHeader
              eyebrow="Por fase"
              title="Precisão por Fase da Copa"
              subtitle="Acertos do vencedor divididos por fase da competição."
            />
            <PhaseBreakdown stats={stats} />
          </section>
        )}

        {/* CONQUISTAS */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Conquistas"
            title="Conquistas e Recordes"
            subtitle={achievements.length ? "Destaques calculados a partir dos dados oficiais." : "As conquistas serão desbloqueadas com o avanço da Copa."}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(achievements.length ? achievements : PLACEHOLDER_ACHIEVEMENTS).map((a) => (
              <Card key={a.id} className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 size-28 rounded-full bg-gold/10 blur-2xl" />
                <CardContent className="p-5 space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-gold text-gold-foreground grid place-items-center shadow-elegant shrink-0">
                      <Award className="size-5" />
                    </div>
                    <div className="font-display font-bold truncate">{a.title}</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                  {a.provider ? (
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gold text-gold-foreground border-0">
                        <Crown className="size-3 mr-1" /> {a.provider}
                      </Badge>
                      {a.value && (
                        <span className="font-display font-bold text-sm">{a.value}</span>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                      <Sparkles className="size-3" /> Aguardando dados
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CRITÉRIOS */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Metodologia"
            title="Como a pontuação é calculada"
            subtitle="Critérios objetivos baseados nos resultados oficiais da FIFA."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITERIA.map((c) => (
              <Card key={c.title} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <c.icon className="size-5" />
                  </div>
                  <div className="font-display font-bold">{c.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

const PLACEHOLDER_ACHIEVEMENTS = [
  { id: "p1", title: "Maior Precisão", description: "Será entregue à IA com maior taxa de acerto do vencedor.", provider: null, value: undefined },
  { id: "p2", title: "Maior Sequência", description: "Maior série consecutiva de acertos.", provider: null, value: undefined },
  { id: "p3", title: "Mestre do Placar Exato", description: "Mais placares exatos previstos.", provider: null, value: undefined },
] as const;

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] uppercase tracking-widest text-gold">{eyebrow}</div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-sm">{value}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center space-y-2">
        <div className="size-12 rounded-2xl bg-muted text-muted-foreground grid place-items-center mx-auto">
          <CircleDashed className="size-5" />
        </div>
        <div className="font-medium">{label}</div>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Os dados aparecerão automaticamente após as primeiras partidas encerradas serem avaliadas.
        </p>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  hasRealData, isLoading, isError, errorMessage, totalEvaluated, lastUpdated, onRefresh,
}: {
  hasRealData: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  totalEvaluated: number;
  lastUpdated: number | null;
  onRefresh: () => void;
}) {
  const icon = isLoading ? Loader2 : isError ? AlertTriangle : hasRealData ? Trophy : Clock;
  const Icon = icon;
  const label = isLoading
    ? "Carregando métricas..."
    : isError
      ? "Falha ao carregar dados"
      : hasRealData
        ? `${totalEvaluated} previsões avaliadas`
        : "Aguardando início da Copa";
  const description = isError
    ? errorMessage
    : hasRealData
      ? "As métricas são recalculadas automaticamente após cada partida encerrada."
      : "As avaliações começam automaticamente após os primeiros resultados oficiais.";

  return (
    <Card className={`border-dashed ${isError ? "border-destructive/40" : "border-gold/40"} bg-gradient-to-br from-gold/5 to-transparent`}>
      <CardContent className="py-6 sm:py-8 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 sm:gap-6 items-center">
        <div className={`size-12 sm:size-14 rounded-2xl grid place-items-center shrink-0 ${isError ? "bg-destructive/20 text-destructive" : "bg-gradient-gold text-gold-foreground shadow-elegant"}`}>
          <Icon className={`size-6 ${isLoading ? "animate-spin" : ""}`} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</span>
            <Badge className={isError ? "bg-destructive text-destructive-foreground border-0" : "bg-gold text-gold-foreground hover:bg-gold/90 border-0"}>
              {label}
            </Badge>
            {lastUpdated && !isError && (
              <span className="text-[10px] text-muted-foreground">
                atualizado {new Date(lastUpdated).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh} className="shrink-0" aria-label="Atualizar">
          <RefreshCw className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function PodiumCard({
  rank, stats, height, tone, icon, featured,
}: {
  rank: number;
  stats: ProviderStats | undefined;
  height: string;
  tone: string;
  icon: string;
  featured?: boolean;
}) {
  return (
    <Card className={`relative overflow-hidden border ${featured ? "border-gold/60 shadow-elegant" : "border-border"}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${tone} pointer-events-none`} />
      <CardContent className={`relative p-6 flex flex-col items-center justify-end text-center gap-2 ${height} min-h-44`}>
        <div className="text-5xl sm:text-6xl leading-none">{icon}</div>
        {stats ? (
          <>
            <div className="font-display text-xl font-bold">{stats.provider}</div>
            <div className="text-2xl font-display font-bold text-gold">{stats.totalPoints} pts</div>
            <div className="text-xs text-muted-foreground">
              {stats.winnerHits}/{stats.matchesPredicted} acertos · {stats.winnerAccuracy.toFixed(1)}%
            </div>
          </>
        ) : (
          <>
            <div className="font-display text-lg font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground">Aguardando dados</div>
          </>
        )}
        {featured && stats && (
          <Badge className="bg-gold text-gold-foreground border-0">
            <Crown className="size-3 mr-1" /> Líder
          </Badge>
        )}
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{rank}º colocado</div>
      </CardContent>
    </Card>
  );
}

function PhaseBreakdown({ stats }: { stats: ProviderStats[] }) {
  const allStages = Array.from(
    new Set(stats.flatMap((s) => s.phases.map((p) => p.stage)))
  );
  if (!allStages.length) return null;
  return (
    <div className="rounded-2xl border border-border overflow-x-auto bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IA</TableHead>
            {allStages.map((st) => (
              <TableHead key={st} className="text-center">{stageLabel(st)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((s) => (
            <TableRow key={s.provider}>
              <TableCell className="font-medium whitespace-nowrap">{s.provider}</TableCell>
              {allStages.map((st) => {
                const ph = s.phases.find((p) => p.stage === st);
                if (!ph || ph.total === 0) {
                  return <TableCell key={st} className="text-center text-muted-foreground">—</TableCell>;
                }
                return (
                  <TableCell key={st} className="text-center">
                    <div className="font-display font-bold text-sm">
                      {ph.winnerHits}/{ph.total}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {ph.winnerAccuracy.toFixed(0)}%
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Countdown } from "@/components/Countdown";
import { MatchCardView } from "@/components/MatchCardView";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { DataQualityPanel } from "@/components/DataQualityPanel";
import { TeamFlag } from "@/components/TeamFlag";
import {
  useCompetitionDashboard,
  useMatches,
  useDataQualitySummary,
  useAiSimulationsFull,
  useAiSimulationConsensus,
} from "@/hooks/useCopa";
import {
  Trophy,
  Users,
  CalendarDays,
  Flag,
  Layers,
  MapPin,
  Brain,
  Sparkles,
  ArrowRight,
  Crown,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copa 2026 Intelligence — Dashboard" },
      {
        name: "description",
        content:
          "Copa do Mundo FIFA 2026 analisada por Inteligência Artificial: 48 seleções, 1248 jogadores, simulações e consenso entre modelos.",
      },
      { property: "og:title", content: "Copa 2026 Intelligence" },
      { property: "og:description", content: "Copa do Mundo FIFA 2026 analisada por Inteligência Artificial." },
    ],
  }),
  component: Index,
});

function Index() {
  const dash = useCompetitionDashboard();
  const matchesQ = useMatches();
  const qualityQ = useDataQualitySummary();
  const simsQ = useAiSimulationsFull();
  const consQ = useAiSimulationConsensus();
  const comp = dash.data?.data;

  const playersRow = (qualityQ.data?.data ?? []).find((r) => r.entity === "players");
  const playersTotal = Number(playersRow?.total ?? comp?.total_players ?? 0);
  const playersExpected = 1248;
  const playersCoverage = Math.min(100, Math.round((playersTotal / playersExpected) * 100));
  const playersHint =
    playersTotal >= playersExpected
      ? "Cobertura completa"
      : playersTotal === 0
        ? "Sem dados cadastrados"
        : `${playersCoverage}% · faltam ${playersExpected - playersTotal}`;

  const hosts = Array.isArray(comp?.host_countries)
    ? (comp!.host_countries as string[])
    : typeof comp?.host_countries === "string"
      ? (comp!.host_countries as string).split(",").map((s) => s.trim())
      : [];

  const upcoming = (matchesQ.data?.data ?? [])
    .filter((m) => m.status !== "finished" && m.status !== "completed")
    .slice(0, 6);

  const sims = simsQ.data?.data ?? [];
  const consensus = consQ.data?.data ?? null;
  const totalSims = consensus?.total_simulations ?? sims.length;
  const favorites = (consensus?.champion_consensus ?? []).slice(0, 3);

  return (
    <AppLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, oklch(0.72 0.17 152 / 0.28), transparent 55%), radial-gradient(circle at 85% 75%, oklch(0.82 0.14 85 / 0.22), transparent 55%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
              <Sparkles className="size-3" /> Powered by AI
            </span>
            {dash.data && <SourceBadge source={dash.data.source} />}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Copa 2026 <span className="bg-gradient-gold bg-clip-text text-transparent">Intelligence</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            A maior central de previsões da Copa do Mundo FIFA 2026 baseada em Inteligência Artificial.
          </p>

          {/* Quick indicators */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl">
            <HeroPill icon={<Users className="size-4" />} label="Seleções" value="48" />
            <HeroPill icon={<Trophy className="size-4" />} label="Jogadores" value="1248" />
            <HeroPill icon={<Brain className="size-4" />} label="Simulações de IA" value={String(totalSims || 8)} />
            <HeroPill icon={<Sparkles className="size-4 text-gold" />} label="Consenso" value="Inteligente" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/simulacoes" className="gap-2">
                <Brain className="size-4" /> Ver Simulações
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/simulacoes" className="gap-2">
                <Sparkles className="size-4" /> Ver Consenso <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {comp?.start_date && (
            <div className="mt-10 max-w-xl">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Contagem regressiva
              </div>
              <Countdown target={comp.start_date} />
            </div>
          )}
        </div>
      </section>

      {/* Favoritos ao Título */}
      {favorites.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
          <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
            <div>
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Crown className="size-5 text-gold" /> Favoritos ao Título
              </h2>
              <p className="text-sm text-muted-foreground">Consenso das IAs analisadas ({totalSims} simulações).</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/simulacoes" className="gap-1">
                Ver consenso completo <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {favorites.map((fav, i) => {
              const share = totalSims > 0 ? Math.round((fav.votes / totalSims) * 100) : 0;
              const isLeader = i === 0;
              const medal = [Crown, Medal, Medal][i];
              const Icon = medal;
              const toneBg = isLeader
                ? "bg-gradient-gold text-gold-foreground"
                : i === 1
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-secondary/60 text-secondary-foreground";
              return (
                <Card key={`${fav.team}-${i}`} className={isLeader ? "border-gold/40 shadow-glow" : ""}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${toneBg}`}
                      >
                        <Icon className="size-3" /> {i + 1}º favorito
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {fav.votes}/{totalSims}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <TeamFlag teamCode={fav.team_code} teamName={fav.team} size={36} />
                      <div className="min-w-0">
                        <div className="font-display text-lg font-bold truncate">{fav.team ?? "—"}</div>
                        {fav.team_code && <div className="text-[11px] text-muted-foreground">{fav.team_code}</div>}
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full ${isLeader ? "bg-gradient-gold" : "bg-primary"}`}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground">{share}% das previsões</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Stat cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {dash.isLoading ? (
          <LoadingGrid count={5} className="grid-cols-2 lg:grid-cols-5" />
        ) : dash.isError ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={Users} label="Seleções" value={comp?.total_teams ?? 48} variant="green" />
            <StatCard icon={Layers} label="Grupos" value={comp?.total_groups ?? 12} variant="info" />
            <StatCard icon={CalendarDays} label="Jogos" value={comp?.total_matches ?? 104} />
            <StatCard
              icon={Flag}
              label="Países-sede"
              value={hosts.length || 3}
              hint={hosts.join(" · ") || "USA · CAN · MEX"}
            />
            <StatCard
              icon={Trophy}
              label="Jogadores convocados"
              value={`${playersTotal}${playersExpected ? ` / ${playersExpected}` : ""}`}
              variant="gold"
              hint={playersHint}
            />
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <DataQualityPanel />
      </section>

      {/* <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-16 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-bold flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Próximos jogos
            </h2>

            <p className="text-sm text-muted-foreground">Calendário oficial da competição.</p>
          </div>

          {matchesQ.data && (
            <div className="self-start sm:self-auto">
              <SourceBadge source={matchesQ.data.source} />
            </div>
          )}
        </div>

        {matchesQ.isLoading ? (
          <LoadingGrid count={6} />
        ) : upcoming.length === 0 ? (
          <EmptyState
            title="Nenhum jogo disponível"
            description="Os jogos aparecerão aqui assim que a base for populada."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => (
              <MatchCardView key={`${m.match_number}-${m.match_id ?? m.stage}`} match={m} />
            ))}
          </div>
        )}
      </section> */}
    </AppLayout>
  );
}

function HeroPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} <span>{label}</span>
      </div>
      <div className="mt-1 font-display text-xl sm:text-2xl font-bold truncate">{value}</div>
    </div>
  );
}

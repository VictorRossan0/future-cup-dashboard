import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Countdown } from "@/components/Countdown";
import { MatchCardView } from "@/components/MatchCardView";
import { LoadingGrid, ErrorState, SourceBadge, EmptyState } from "@/components/DataState";
import { DataQualityPanel } from "@/components/DataQualityPanel";
import { useCompetitionDashboard, useMatches, useDataQualitySummary } from "@/hooks/useCopa";
import { Trophy, Users, CalendarDays, Flag, Layers, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copa 2026 Data Hub — Dashboard" },
      { name: "description", content: "Dashboard interativo da Copa do Mundo FIFA 2026: 48 seleções, 12 grupos, jogos, regras e elencos." },
    ],
  }),
  component: Index,
});

function Index() {
  const dash = useCompetitionDashboard();
  const matchesQ = useMatches();
  const qualityQ = useDataQualitySummary();
  const comp = dash.data?.data;

  const playersRow = (qualityQ.data?.data ?? []).find((r) => r.entity === "players");
  const playersTotal = Number(playersRow?.total ?? comp?.total_players ?? 0);
  const playersExpected = 1248;
  const playersCoverage = Math.min(100, Math.round((playersTotal / playersExpected) * 100));
  const playersHint = playersTotal >= playersExpected
    ? "Cobertura completa · 26 por seleção"
    : playersTotal === 0
      ? "Sem dados cadastrados"
      : `${playersCoverage}% · faltam ${playersExpected - playersTotal}`;

  const hosts = Array.isArray(comp?.host_countries)
    ? comp!.host_countries as string[]
    : typeof comp?.host_countries === "string"
      ? (comp!.host_countries as string).split(",").map((s) => s.trim())
      : [];

  const upcoming = (matchesQ.data?.data ?? [])
    .filter((m) => m.status !== "finished" && m.status !== "completed")
    .slice(0, 6);

  return (
    <AppLayout>
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.72 0.17 152 / 0.25), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.82 0.14 85 / 0.2), transparent 50%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">
          <div className="inline-flex items-center gap-2 mb-5">
            {dash.data && <SourceBadge source={dash.data.source} />}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Copa 2026 <span className="bg-gradient-gold bg-clip-text text-transparent">Data Hub</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            {comp?.name ?? "Copa do Mundo FIFA 2026"} · {comp?.year ?? 2026}
            {hosts.length > 0 ? ` · ${hosts.join(" · ")}` : ""}
          </p>

          {comp?.start_date && (
            <div className="mt-8 max-w-xl">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Contagem regressiva
              </div>
              <Countdown target={comp.start_date} />
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {dash.isLoading ? (
          <LoadingGrid count={5} className="grid-cols-2 lg:grid-cols-5" />
        ) : dash.isError ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={Users} label="Seleções" value={comp?.total_teams ?? 48} variant="green" />
            <StatCard icon={Layers} label="Grupos" value={comp?.total_groups ?? 12} variant="info" />
            <StatCard icon={CalendarDays} label="Jogos" value={comp?.total_matches ?? 104} />
            <StatCard icon={Flag} label="Países-sede" value={hosts.length || 3} hint={hosts.join(" · ") || "USA · CAN · MEX"} />
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

      <section className="max-w-6xl mx-auto px-6 pb-6">
        <DataQualityPanel />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <MapPin className="size-5 text-primary" /> Próximos jogos
            </h2>
            <p className="text-sm text-muted-foreground">Calendário oficial da competição.</p>
          </div>
          {matchesQ.data && <SourceBadge source={matchesQ.data.source} />}
        </div>
        {matchesQ.isLoading ? (
          <LoadingGrid count={6} />
        ) : upcoming.length === 0 ? (
          <EmptyState title="Nenhum jogo disponível" description="Os jogos aparecerão aqui assim que a base for populada." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((m) => <MatchCardView key={`${m.match_number}-${m.match_id ?? m.stage}`} match={m} />)}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

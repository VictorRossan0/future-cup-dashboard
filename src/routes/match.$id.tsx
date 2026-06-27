import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/TeamFlag";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MatchLineupView } from "@/components/MatchLineupView";
import { MatchAIPanel } from "@/components/MatchAIPanel";
import { LiveBadge } from "@/components/LiveBadge";
import { useMatches, useMatchLineups } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ClipboardList,
  BarChart3,
  Sparkles,
  Info,
  AlarmClock,
} from "lucide-react";
import type { VMatchesFull } from "@/types/views";

export const Route = createFileRoute("/match/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Partida #${params.id.slice(0, 8)} · Copa 2026 Intelligence` },
      {
        name: "description",
        content:
          "Detalhes da partida da Copa do Mundo FIFA 2026: escalações oficiais, formação tática, técnico e banco de reservas.",
      },
    ],
  }),
  component: MatchDetailPage,
});

function MatchDetailPage() {
  const { id } = Route.useParams();
  const matchesQ = useMatches();
  const match = useMemo(
    () => matchesQ.data?.data.find((m) => m.match_id === id),
    [matchesQ.data, id],
  );

  const lineupsQ = useMatchLineups(id);
  const rows = lineupsQ.data?.data ?? [];

  const homeRows = rows.filter(
    (r) => r.side === "home" || (match?.home_team_id && r.team_id === match.home_team_id),
  );
  const awayRows = rows.filter(
    (r) => r.side === "away" || (match?.away_team_id && r.team_id === match.away_team_id),
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/jogos"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para Jogos
          </Link>
          {match?.status === "in_progress" || match?.status === "current" ? (
            <LiveBadge clock={match.live_clock} />
          ) : match?.status ? (
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
              {t.status(match.status)}
            </Badge>
          ) : null}
        </div>

        {matchesQ.isLoading && (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Carregando partida…</p>
          </Card>
        )}

        {!matchesQ.isLoading && !match && (
          <Card className="p-10 text-center border-dashed">
            <Info className="size-8 mx-auto text-muted-foreground mb-2" />
            <h2 className="font-display text-xl font-bold">Partida não encontrada</h2>
            <p className="text-sm text-muted-foreground mt-1">
              O identificador informado não corresponde a nenhuma partida.
            </p>
          </Card>
        )}

        {match && (
          <>
            <Hero match={match} />

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto bg-secondary/50 p-1">
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2"
                >
                  <Trophy className="size-3.5" />
                  <span className="text-xs sm:text-sm">Resumo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="lineups"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2"
                >
                  <ClipboardList className="size-3.5" />
                  <span className="text-xs sm:text-sm">Escalações</span>
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  disabled
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2 opacity-60"
                >
                  <BarChart3 className="size-3.5" />
                  <span className="text-xs sm:text-sm">Estatísticas</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ia"
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2"
                >
                  <Sparkles className="size-3.5" />
                  <span className="text-xs sm:text-sm">IA</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4 space-y-4">
                <SummaryPanel match={match} />
              </TabsContent>

              <TabsContent value="lineups" className="mt-4 space-y-4">
                <LineupsSection
                  loading={lineupsQ.isLoading}
                  hasRows={rows.length > 0}
                  homeRows={homeRows}
                  awayRows={awayRows}
                  match={match}
                />
              </TabsContent>

              <TabsContent value="ia" className="mt-4 space-y-4">
                <MatchAIPanel match={match} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
}

// ---------------------------------------------------------------------------

function Hero({ match }: { match: VMatchesFull }) {
  const isFinished = match.status === "finished" || match.status === "completed";
  const isLive = match.status === "in_progress" || match.status === "current";
  const hasScore = match.home_score != null && match.away_score != null;
  return (
    <Card className="p-5 sm:p-7 bg-gradient-to-br from-card via-card to-secondary/30 border-primary/20 shadow-elegant">
      <div className="text-center text-[10px] uppercase tracking-widest text-gold mb-4 flex items-center justify-center gap-2">
        <span>
          {match.stage ? t.stage(match.stage) : "Partida"}
          {match.group_code ? ` · Grupo ${match.group_code}` : ""}
        </span>
        {isLive && <LiveBadge clock={match.live_clock} />}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
        <TeamSide
          code={match.home_team_code}
          name={match.home_team_name ?? match.home_display_name ?? "?"}
          align="left"
        />
        <div className="text-center min-w-[90px]">
          {hasScore ? (
            <div className={cn("font-display text-4xl sm:text-6xl font-black tabular-nums", isLive && "text-destructive")}>
              <span>{match.home_score}</span>
              <span className="text-muted-foreground/60 mx-2">×</span>
              <span>{match.away_score}</span>
            </div>
          ) : (
            <div className="font-display text-3xl sm:text-5xl font-black text-muted-foreground/70">
              VS
            </div>
          )}
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
            {isLive
              ? (match.live_clock ?? "Ao vivo")
              : isFinished
                ? "Encerrado"
                : match.match_time ? match.match_time.slice(0, 5) : "A definir"}
          </div>
        </div>
        <TeamSide
          code={match.away_team_code}
          name={match.away_team_name ?? match.away_display_name ?? "?"}
          align="right"
        />
      </div>
      <div className="mt-5 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-muted-foreground">
        <MetaItem icon={<Calendar className="size-3.5" />} label="Data" value={formatDate(match.match_date)} />
        <MetaItem
          icon={<Clock className="size-3.5" />}
          label="Horário"
          value={match.match_time ? match.match_time.slice(0, 5) : "—"}
        />
        <MetaItem
          icon={<MapPin className="size-3.5" />}
          label="Estádio"
          value={match.stadium ?? "—"}
        />
        <MetaItem
          icon={<MapPin className="size-3.5" />}
          label="Cidade"
          value={[match.city, match.country].filter(Boolean).join(", ") || "—"}
        />
      </div>
    </Card>
  );
}

function TeamSide({
  code,
  name,
  align,
}: {
  code?: string | null;
  name: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 min-w-0 ${
        align === "right" ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      <TeamFlag teamCode={code} teamName={name} size={56} />
      <div className="min-w-0 text-center sm:text-left">
        <div className="font-display text-sm sm:text-xl font-bold truncate">{name}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{code ?? ""}</div>
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground/80">
        {icon}
        {label}
      </div>
      <div className="text-xs font-semibold text-foreground truncate mt-0.5">{value}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function SummaryPanel({ match }: { match: VMatchesFull }) {
  const hasScore = match.home_score != null && match.away_score != null;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Card className="p-5 space-y-3">
        <h3 className="text-[10px] uppercase tracking-widest text-gold flex items-center gap-1.5">
          <Info className="size-3.5" /> Informações da Partida
        </h3>
        <dl className="text-sm space-y-2">
          <Row label="Data" value={formatDate(match.match_date)} />
          <Row label="Horário" value={match.match_time ? match.match_time.slice(0, 5) : "—"} />
          <Row label="Estádio" value={match.stadium ?? "—"} />
          <Row label="Cidade" value={[match.city, match.country].filter(Boolean).join(", ") || "—"} />
          <Row label="Fase" value={match.stage ? t.stage(match.stage) : "—"} />
          {match.group_code && <Row label="Grupo" value={`Grupo ${match.group_code}`} />}
        </dl>
      </Card>

      <Card className="p-5 flex flex-col items-center justify-center text-center">
        <h3 className="text-[10px] uppercase tracking-widest text-gold flex items-center gap-1.5 mb-3">
          <Trophy className="size-3.5" /> Resultado
        </h3>
        {hasScore ? (
          <>
            <div className="font-display text-5xl font-black tabular-nums">
              <span>{match.home_score}</span>
              <span className="text-muted-foreground/60 mx-2">×</span>
              <span>{match.away_score}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Placar final</div>
          </>
        ) : (
          <>
            <AlarmClock className="size-8 text-muted-foreground mb-2" />
            <div className="font-display text-lg font-bold">Partida ainda não iniciada</div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatDate(match.match_date)}
              {match.match_time && ` · ${match.match_time.slice(0, 5)}`}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-1.5 last:border-0">
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-right truncate">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------

function LineupsSection({
  loading,
  hasRows,
  homeRows,
  awayRows,
  match,
}: {
  loading: boolean;
  hasRows: boolean;
  homeRows: ReturnType<typeof useMatchLineups>["data"] extends infer T ? any : any;
  awayRows: any;
  match: VMatchesFull;
}) {
  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Carregando escalações…</p>
      </Card>
    );
  }
  if (!hasRows) {
    return (
      <Card className="p-8 sm:p-10 text-center border-dashed">
        <div className="grid place-items-center size-12 rounded-full bg-primary/10 border border-primary/30 text-primary mx-auto mb-3">
          <AlarmClock className="size-6" />
        </div>
        <h2 className="font-display text-xl font-bold">Escalação oficial ainda não divulgada</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          As escalações normalmente são publicadas entre 30 e 60 minutos antes da partida.
        </p>
      </Card>
    );
  }
  return (
    <div className="grid xl:grid-cols-2 gap-4 sm:gap-6">
      <MatchLineupView
        rows={homeRows}
        fallbackTeamCode={match.home_team_code ?? undefined}
        fallbackTeamName={match.home_team_name ?? undefined}
        tone="home"
      />
      <MatchLineupView
        rows={awayRows}
        fallbackTeamCode={match.away_team_code ?? undefined}
        fallbackTeamName={match.away_team_name ?? undefined}
        tone="away"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------

function formatDate(d?: string | null) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

// avoid unused
void useState;

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { TeamFlag } from "@/components/TeamFlag";
import { EmptyState, LoadingGrid, SourceBadge } from "@/components/DataState";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMatches, useMatchLineups } from "@/hooks/useCopa";
import { type VMatchLineup } from "@/services/copaService";
import type { VMatchesFull } from "@/types/views";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Crown, ShieldCheck, UserRound, ClipboardList, Users, ChevronRight, BarChart3, Trophy, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/escalacoes")({
  head: () => ({
    meta: [
      { title: "Escalações Oficiais · Copa 2026 Intelligence" },
      {
        name: "description",
        content:
          "Escalações oficiais, formação tática, técnico, capitão e banco de reservas das partidas da Copa do Mundo FIFA 2026.",
      },
    ],
  }),
  component: EscalacoesPage,
});

// ---------------------------------------------------------------------------

function EscalacoesPage() {
  const matchesQ = useMatches();
  const matches = matchesQ.data?.data ?? [];

  const [matchId, setMatchId] = useState<string | undefined>();
  const selected = useMemo(
    () => matches.find((m) => m.match_id === matchId) ?? matches[0],
    [matches, matchId],
  );
  const activeId = selected?.match_id;

  const lineupsQ = useMatchLineups(activeId);
  const rows = lineupsQ.data?.data ?? [];

  const homeRows = rows.filter((r) => r.side === "home" || r.team_id === selected?.home_team_id);
  const awayRows = rows.filter((r) => r.side === "away" || r.team_id === selected?.away_team_id);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <PageHeader
          kicker="Escalações Oficiais"
          title={
            <span className="inline-flex items-center gap-3">
              <ClipboardList className="size-7 text-primary" /> Campo Tático
            </span>
          }
          description="Formação tática, técnico, capitão titular e banco de reservas — direto dos dados oficiais da competição."
          right={matchesQ.data && <SourceBadge source={matchesQ.data.source} />}
        />

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
          {/* Lista de partidas */}
          <Card className="p-3 h-fit lg:sticky lg:top-4">
            <div className="px-2 py-1.5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold">
              <Users className="size-3.5" /> Partidas
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-1.5">
              {matchesQ.isLoading && <LoadingGrid count={4} className="!grid-cols-1" />}
              {!matchesQ.isLoading && matches.length === 0 && (
                <EmptyState title="Nenhuma partida disponível" />
              )}
              {matches.map((m) => (
                <MatchRow
                  key={m.match_id ?? `${m.match_number}`}
                  match={m}
                  active={m.match_id === activeId}
                  onSelect={() => setMatchId(m.match_id ?? undefined)}
                />
              ))}
            </div>
          </Card>

          {/* Detalhe + campo */}
          <div className="space-y-6 min-w-0">
            {selected && <MatchHeader match={selected} />}

            {selected && (
              <Tabs defaultValue="lineups" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto bg-secondary/50 p-1">
                  <TabsTrigger value="result" className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2">
                    <Trophy className="size-3.5" /> <span className="text-xs sm:text-sm">Resultado</span>
                  </TabsTrigger>
                  <TabsTrigger value="lineups" className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2">
                    <ClipboardList className="size-3.5" /> <span className="text-xs sm:text-sm">Escalações</span>
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 py-2">
                    <BarChart3 className="size-3.5" /> <span className="text-xs sm:text-sm">Estatísticas</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="result" className="mt-4">
                  <ResultPanel match={selected} />
                </TabsContent>

                <TabsContent value="lineups" className="mt-4 space-y-6">
                  {lineupsQ.isLoading && (
                    <Card className="p-6">
                      <p className="text-sm text-muted-foreground">Carregando escalações…</p>
                    </Card>
                  )}

                  {!lineupsQ.isLoading && rows.length === 0 && (
                    <Card className="p-8 text-center border-dashed">
                      <ClipboardList className="size-8 mx-auto text-muted-foreground mb-2" />
                      <h2 className="font-display text-xl font-bold">Escalação oficial ainda não divulgada</h2>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                        As escalações desta partida serão publicadas automaticamente assim que forem
                        divulgadas oficialmente pelas seleções.
                      </p>
                    </Card>
                  )}

                  {!lineupsQ.isLoading && rows.length > 0 && (
                    <div className="grid xl:grid-cols-2 gap-6">
                      <LineupColumn
                        rows={homeRows}
                        fallbackTeamCode={selected?.home_team_code ?? undefined}
                        fallbackTeamName={selected?.home_team_name ?? undefined}
                        tone="home"
                      />
                      <LineupColumn
                        rows={awayRows}
                        fallbackTeamCode={selected?.away_team_code ?? undefined}
                        fallbackTeamName={selected?.away_team_name ?? undefined}
                        tone="away"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <Card className="p-8 text-center border-dashed">
                    <BarChart3 className="size-8 mx-auto text-muted-foreground mb-2" />
                    <h2 className="font-display text-xl font-bold">Estatísticas em breve</h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                      Posse de bola, finalizações, faltas e cartões serão exibidos aqui assim que a
                      partida for disputada.
                    </p>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// ---------------------------------------------------------------------------
// Result panel

function ResultPanel({ match }: { match: VMatchesFull }) {
  const hasScore = match.home_score != null && match.away_score != null;
  return (
    <Card className="p-6 sm:p-8">
      {hasScore ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
          <div className="text-center">
            <TeamFlag teamCode={match.home_team_code} teamName={match.home_team_name} size={56} />
            <div className="mt-2 font-display font-bold truncate">{match.home_team_name}</div>
          </div>
          <div className="font-display text-5xl sm:text-6xl font-black tabular-nums text-center">
            <span>{match.home_score}</span>
            <span className="text-muted-foreground mx-2">×</span>
            <span>{match.away_score}</span>
          </div>
          <div className="text-center">
            <TeamFlag teamCode={match.away_team_code} teamName={match.away_team_name} size={56} />
            <div className="mt-2 font-display font-bold truncate">{match.away_team_name}</div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="size-8 mx-auto text-muted-foreground mb-2" />
          <h3 className="font-display text-xl font-bold">Partida ainda não disputada</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(match.match_date)}
            {match.match_time && ` · ${match.match_time.slice(0, 5)}`}
          </p>
        </div>
      )}
    </Card>
  );
}


// ---------------------------------------------------------------------------
// Match list row

function MatchRow({
  match,
  active,
  onSelect,
}: {
  match: VMatchesFull;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-lg border px-3 py-2.5 transition-all flex items-center gap-2 group",
        active
          ? "border-primary/60 bg-primary/10 shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/40",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-medium truncate">
          <TeamFlag teamCode={match.home_team_code} teamName={match.home_team_name} size={14} />
          <span className="truncate">{match.home_team_name ?? match.home_display_name ?? "?"}</span>
          <span className="text-muted-foreground mx-0.5">×</span>
          <span className="truncate">{match.away_team_name ?? match.away_display_name ?? "?"}</span>
          <TeamFlag teamCode={match.away_team_code} teamName={match.away_team_name} size={14} />
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
          <span>{formatDate(match.match_date)}</span>
          {match.match_time && <span>· {match.match_time.slice(0, 5)}</span>}
          {match.stage && <span>· {t.stage(match.stage)}</span>}
        </div>
      </div>
      <ChevronRight
        className={cn(
          "size-4 shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground",
        )}
      />
    </button>
  );
}

function MatchHeader({ match }: { match: VMatchesFull }) {
  return (
    <Card className="p-5 bg-gradient-to-br from-card via-card to-secondary/30 border-primary/20">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
        <TeamCorner
          code={match.home_team_code}
          name={match.home_team_name ?? match.home_display_name ?? "?"}
          align="left"
        />
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest text-gold">
            {match.stage ? t.stage(match.stage) : "Partida"}
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black mt-1">vs</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            {formatDate(match.match_date)}
            {match.match_time && ` · ${match.match_time.slice(0, 5)}`}
          </div>
          {match.stadium && (
            <div className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">
              {match.stadium}
              {match.city && ` — ${match.city}`}
            </div>
          )}
        </div>
        <TeamCorner
          code={match.away_team_code}
          name={match.away_team_name ?? match.away_display_name ?? "?"}
          align="right"
        />
      </div>
    </Card>
  );
}

function TeamCorner({
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
      className={cn(
        "flex items-center gap-2 sm:gap-3 min-w-0",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <TeamFlag teamCode={code} teamName={name} size={40} />
      <div className="min-w-0">
        <div className="font-display text-sm sm:text-lg font-bold truncate">{name}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{code ?? ""}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lineup column with field + bench

function LineupColumn({
  rows,
  fallbackTeamCode,
  fallbackTeamName,
  tone,
}: {
  rows: VMatchLineup[];
  fallbackTeamCode?: string;
  fallbackTeamName?: string;
  tone: "home" | "away";
}) {
  if (rows.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          title="Sem escalação"
          description={`Aguardando publicação oficial${fallbackTeamName ? ` de ${fallbackTeamName}` : ""}.`}
        />
      </Card>
    );
  }

  const meta = rows[0];
  const teamName = meta.team_name ?? fallbackTeamName ?? "Seleção";
  const teamCode = meta.team_code ?? fallbackTeamCode ?? null;
  const formation = (meta.formation ?? "").trim();
  const coach = meta.coach_name ?? null;

  const starters = rows.filter((r) => r.is_starter !== false);
  const bench = rows.filter((r) => r.is_starter === false);
  const captain =
    rows.find((r) => r.is_captain) ??
    rows.find((r) => r.player_id && r.player_id === meta.captain_player_id) ??
    null;

  return (
    <Card className="p-4 sm:p-5 space-y-4 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamFlag teamCode={teamCode} teamName={teamName} size={40} />
          <div className="min-w-0">
            <div className="font-display text-lg font-bold truncate">{teamName}</div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
              <span className="uppercase tracking-widest text-[9px]">Formação</span>
              {formation ? (
                <Badge variant="outline" className="border-primary/40 text-primary font-mono text-xs">
                  {formation}
                </Badge>
              ) : (
                <span className="italic text-muted-foreground/80">Aguardando confirmação oficial</span>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-[10px]",
            tone === "home" ? "border-primary/40 text-primary" : "border-gold/50 text-gold",
          )}
        >
          {tone === "home" ? "Mandante" : "Visitante"}
        </Badge>
      </div>

      {/* Coach card */}
      {coach && (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/10 px-3 py-2.5">
          <div className="grid place-items-center size-9 rounded-full bg-primary/15 text-primary border border-primary/30 shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Comissão Técnica</div>
            <div className="text-sm font-bold truncate">{coach}</div>
          </div>
        </div>
      )}

      {/* Field */}
      <Field formation={formation} starters={starters} captainId={captain?.player_id ?? null} />

      {/* Starters list */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-2">
          <Crown className="size-3.5" /> Titulares
          <span className="text-foreground/80">· {starters.length}</span>
        </div>
        {starters.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem titulares divulgados.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {[...starters]
              .sort((a, b) => {
                if (isGK(a.position) !== isGK(b.position)) return isGK(a.position) ? -1 : 1;
                return (a.jersey_number ?? 99) - (b.jersey_number ?? 99);
              })
              .map((p, i) => {
                const isCap = (captain?.player_id ?? null) && p.player_id === captain?.player_id;
                return (
                  <li
                    key={`s-${p.player_id ?? p.player_name}-${i}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs",
                      isCap
                        ? "border-gold/50 bg-gold/5"
                        : "border-border/60 bg-card hover:bg-secondary/30",
                    )}
                  >
                    <span className="grid place-items-center size-6 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono font-bold text-primary shrink-0">
                      <Hash className="size-2.5 -mr-0.5" />{p.jersey_number ?? "—"}
                    </span>
                    <span className="flex-1 truncate font-medium">{p.player_name ?? "—"}</span>
                    {isCap && (
                      <span className="grid place-items-center size-4 rounded-full bg-gold text-[8px] font-black text-slate-900 shrink-0" title="Capitão">C</span>
                    )}
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono shrink-0">
                      {shortPos(p.position)}
                    </Badge>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Bench */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          <UserRound className="size-3.5" /> Banco de Reservas
          <span className="text-foreground/80">· {bench.length}</span>
        </div>
        {bench.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem reservas divulgados.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {[...bench]
              .sort((a, b) => (a.jersey_number ?? 99) - (b.jersey_number ?? 99))
              .map((p, i) => (
                <li
                  key={`b-${p.player_id ?? p.player_name}-${i}`}
                  className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/30 px-2 py-1.5 text-xs"
                >
                  <span className="grid place-items-center size-6 rounded-full bg-background border border-border text-[10px] font-mono font-bold shrink-0">
                    {p.jersey_number ?? "—"}
                  </span>
                  <span className="flex-1 truncate font-medium">{p.player_name ?? "—"}</span>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground shrink-0">
                    {shortPos(p.position)}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tactical field

function parseFormation(formation: string): number[] {
  // "4-3-3" -> [4,3,3]; defenders first, attackers last (GK implicit)
  const parts = formation
    .split(/[-x:]/)
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return parts.length ? parts : [4, 4, 2];
}

function Field({
  formation,
  starters,
  captainId,
}: {
  formation: string;
  starters: VMatchLineup[];
  captainId: string | null;
}) {
  const lines = parseFormation(formation);
  const totalOutfield = lines.reduce((a, b) => a + b, 0);

  const sorted = [...starters].sort((a, b) => {
    const ag = isGK(a.position) ? 0 : 1;
    const bg = isGK(b.position) ? 0 : 1;
    if (ag !== bg) return ag - bg;
    const ar = (a.grid_row ?? 99) - (b.grid_row ?? 99);
    if (ar !== 0) return ar;
    return (a.grid_col ?? 99) - (b.grid_col ?? 99);
  });

  const gk = sorted.find((p) => isGK(p.position)) ?? null;
  const outfield = sorted.filter((p) => p !== gk).slice(0, totalOutfield);

  // Distribute outfielders into rows defined by `lines` (defenders -> attackers)
  const grouped: VMatchLineup[][] = [];
  let cursor = 0;
  for (const count of lines) {
    grouped.push(outfield.slice(cursor, cursor + count));
    cursor += count;
  }

  // Vertical positions: rows distributed from y=78% (defense) up to y=14% (attack)
  const rowCount = grouped.length;
  const yFor = (idx: number) => {
    if (rowCount === 1) return 50;
    const top = 14;
    const bottom = 78;
    return bottom - (idx * (bottom - top)) / (rowCount - 1);
  };

  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-elegant">
      {/* Pitch background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, hsl(142 60% 22%) 0 8%, hsl(142 55% 27%) 8% 16%)",
        }}
      />
      {/* Field lines */}
      <svg
        className="absolute inset-0 w-full h-full text-white/40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="0.6" fill="currentColor" />
        {/* Penalty boxes */}
        <rect x="25" y="2" width="50" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="38" y="2" width="24" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="25" y="84" width="50" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="38" y="92" width="24" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
      </svg>

      {/* Goalkeeper */}
      {gk && <PlayerDot player={gk} x={50} y={92} isCaptain={gk.player_id === captainId} />}

      {/* Rows from defense (closest to GK) up to attack */}
      {grouped.map((row, ri) => {
        const y = yFor(ri);
        return row.map((p, ci) => {
          const x = ((ci + 1) / (row.length + 1)) * 100;
          return (
            <PlayerDot
              key={`${ri}-${ci}-${p.player_id ?? p.player_name}`}
              player={p}
              x={x}
              y={y}
              isCaptain={p.player_id === captainId}
            />
          );
        });
      })}
    </div>
  );
}

function PlayerDot({
  player,
  x,
  y,
  isCaptain,
}: {
  player: VMatchLineup;
  x: number;
  y: number;
  isCaptain: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative">
        <div className="grid place-items-center size-9 sm:size-10 rounded-full bg-white text-slate-900 font-mono text-sm font-black border-2 border-emerald-300 shadow-md">
          {player.jersey_number ?? "—"}
        </div>
        {isCaptain && (
          <div
            className="absolute -top-1 -right-1 grid place-items-center size-4 rounded-full bg-gold text-[8px] font-black text-slate-900 border border-amber-900/60 shadow"
            title="Capitão"
          >
            C
          </div>
        )}
      </div>
      <div className="mt-1 max-w-[80px] truncate text-[10px] font-medium text-white bg-black/55 px-1.5 rounded">
        {lastName(player.player_name)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// helpers

function isGK(position?: string | null) {
  if (!position) return false;
  const p = position.toLowerCase();
  return p.startsWith("g") || p.includes("goal") || p.includes("gole");
}

function shortPos(p?: string | null) {
  if (!p) return "—";
  const v = p.toLowerCase();
  if (v.startsWith("g")) return "GOL";
  if (v.startsWith("d") || v.includes("zag") || v.includes("lat")) return "DEF";
  if (v.startsWith("m") || v.includes("mei")) return "MEI";
  if (v.startsWith("f") || v.startsWith("a") || v.includes("ata") || v.includes("forw")) return "ATA";
  return p.slice(0, 3).toUpperCase();
}

function lastName(name?: string | null) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1 ? parts[0] : parts[parts.length - 1];
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

// Avoid unused imports
void Link;
void Crown;

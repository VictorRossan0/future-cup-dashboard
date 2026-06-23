import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/TeamFlag";
import { useAiSimulationsFull } from "@/hooks/useCopa";
import type { VAiSimulationsFull, VMatchesFull, AiTeamPick, AiRankedTeam } from "@/types/views";
import {
  Sparkles,
  Trophy,
  Users,
  Target,
  Star,
  ScrollText,
  TrendingUp,
} from "lucide-react";

type Pick = "home" | "away" | "draw" | "unknown";

interface ProviderPick {
  provider: string;
  pick: Pick;
  homeScore: number;
  awayScore: number;
  confidence?: number | null;
}

const asArr = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);

function scoreTeam(sim: VAiSimulationsFull, code: string | null | undefined, groupCode: string | null | undefined): number {
  if (!code) return 0;
  const c = code.toUpperCase();
  let score = 0;
  if (sim.champion_team_code?.toUpperCase() === c) score += 6;
  if (sim.runner_up_team_code?.toUpperCase() === c) score += 4;
  asArr<AiTeamPick>(sim.semifinalists).forEach((t) => {
    if (t?.team_code?.toUpperCase() === c) score += 3;
  });
  asArr<AiRankedTeam>(sim.top_favorites).forEach((t) => {
    if (t?.team_code?.toUpperCase() === c) score += Math.max(1, 4 - (t.rank ?? 4));
  });
  asArr<AiTeamPick>(sim.dark_horses).forEach((t) => {
    if (t?.team_code?.toUpperCase() === c) score += 1;
  });
  if (sim.surprise_team_code?.toUpperCase() === c) score += 1;
  // group_stage_predictions
  if (groupCode && Array.isArray(sim.group_stage_predictions)) {
    for (const g of sim.group_stage_predictions) {
      const gc = (g?.group_code ?? g?.group ?? "").toString().toUpperCase();
      if (gc !== groupCode.toUpperCase()) continue;
      const qualified = asArr(g?.qualified_teams);
      if (qualified.length) {
        const found = qualified.find((q) => q?.team_code?.toUpperCase() === c);
        if (found) {
          const pos = found.predicted_position ?? 99;
          if (pos === 1) score += 3;
          else if (pos === 2) score += 2;
          else score += 1;
        }
      } else {
        const codeOf = (v: unknown): string | null => {
          if (!v) return null;
          if (typeof v === "string") return v;
          if (typeof v === "object" && v && "team_code" in v)
            return (v as { team_code?: string | null }).team_code ?? null;
          return null;
        };
        if (codeOf(g?.first)?.toUpperCase() === c) score += 3;
        else if (codeOf(g?.second)?.toUpperCase() === c) score += 2;
        else if (codeOf(g?.third)?.toUpperCase() === c) score += 1;
      }
    }
  }
  return score;
}

function pickFor(sim: VAiSimulationsFull, match: VMatchesFull): ProviderPick {
  const h = scoreTeam(sim, match.home_team_code, match.group_code);
  const a = scoreTeam(sim, match.away_team_code, match.group_code);
  let pick: Pick = "unknown";
  if (h === 0 && a === 0) pick = "unknown";
  else if (h > a) pick = "home";
  else if (a > h) pick = "away";
  else pick = "draw";
  return {
    provider: sim.provider,
    pick,
    homeScore: h,
    awayScore: a,
    confidence: sim.confidence ?? null,
  };
}

export function MatchAIPanel({ match }: { match: VMatchesFull }) {
  const simsQ = useAiSimulationsFull();
  const sims = simsQ.data?.data ?? [];

  const picks = useMemo<ProviderPick[]>(
    () => sims.map((s) => pickFor(s, match)),
    [sims, match],
  );

  const validPicks = picks.filter((p) => p.pick !== "unknown");
  const counts = { home: 0, away: 0, draw: 0 };
  validPicks.forEach((p) => {
    if (p.pick === "home") counts.home += 1;
    else if (p.pick === "away") counts.away += 1;
    else if (p.pick === "draw") counts.draw += 1;
  });
  const total = validPicks.length;

  type FavoriteKey = "home" | "away" | "draw";
  const orderedKeys: FavoriteKey[] = ["home", "away", "draw"];
  const favoriteKey = orderedKeys.reduce<FavoriteKey>(
    (acc, k) => (counts[k] > counts[acc] ? k : acc),
    "home",
  );
  const favoritePct = total > 0 ? Math.round((counts[favoriteKey] / total) * 100) : 0;

  const favoriteName =
    favoriteKey === "home"
      ? match.home_team_name ?? match.home_display_name ?? "Mandante"
      : favoriteKey === "away"
        ? match.away_team_name ?? match.away_display_name ?? "Visitante"
        : "Empate";
  const favoriteCode =
    favoriteKey === "home"
      ? match.home_team_code
      : favoriteKey === "away"
        ? match.away_team_code
        : null;

  // Consensus tier
  let consensus: { label: string; tone: "strong" | "moderate" | "split"; emoji: string };
  if (total < 2) {
    consensus = { label: "Aguardando previsões", tone: "split", emoji: "⚪" };
  } else if (favoritePct >= 70) {
    consensus = { label: "Forte Consenso", tone: "strong", emoji: "🟢" };
  } else if (favoritePct >= 50) {
    consensus = { label: "Consenso Moderado", tone: "moderate", emoji: "🟡" };
  } else {
    consensus = { label: "Partida Dividida", tone: "split", emoji: "🔴" };
  }

  // Most cited player & top scorer — only those whose team plays this match.
  const teamCodes = [match.home_team_code, match.away_team_code]
    .filter(Boolean)
    .map((c) => (c as string).toUpperCase());
  const inMatch = (code: string | null | undefined) =>
    code ? teamCodes.includes(code.toUpperCase()) : false;

  const topPlayer = mostCited(
    sims
      .filter((s) => inMatch(s.best_player_team_code))
      .map((s) => ({
        name: s.best_player_name ?? "",
        team_code: s.best_player_team_code ?? null,
        team_name: s.best_player_team ?? null,
        provider: s.provider,
      }))
      .filter((x) => x.name),
  );

  const topScorer = mostCited(
    sims
      .filter((s) => inMatch(s.top_scorer_team_code))
      .map((s) => ({
        name: s.top_scorer_player ?? "",
        team_code: s.top_scorer_team_code ?? null,
        team_name: s.top_scorer_team ?? null,
        provider: s.provider,
      }))
      .filter((x) => x.name),
  );

  if (simsQ.isLoading) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-muted-foreground">Carregando previsões das IAs…</p>
      </Card>
    );
  }

  if (sims.length === 0) {
    return (
      <Card className="p-10 text-center border-dashed">
        <Sparkles className="size-8 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-display text-lg font-bold">Nenhuma previsão disponível</h3>
        <p className="text-sm text-muted-foreground mt-1">
          As Inteligências Artificiais ainda não publicaram simulações para esta competição.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* SECTION 1 — FAVORITE */}
      <Card className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-card via-card to-primary/10 border-primary/30 shadow-elegant">
        <div className="absolute -top-16 -right-16 size-56 rounded-full bg-gradient-gold opacity-20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <div className="shrink-0">
            {favoriteKey === "draw" ? (
              <div className="size-20 sm:size-24 rounded-full grid place-items-center bg-secondary/60 border border-border">
                <span className="font-display text-2xl">⚖️</span>
              </div>
            ) : (
              <TeamFlag teamCode={favoriteCode} teamName={favoriteName} size={88} />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-gold flex items-center gap-1.5 justify-center sm:justify-start">
              <Trophy className="size-3.5" /> Favorito da Partida
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black mt-1 truncate">
              {favoriteName}
            </div>
            <div className="mt-2 flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="font-display text-5xl sm:text-6xl font-black tabular-nums text-primary">
                {favoritePct}%
              </span>
              <span className="text-xs text-muted-foreground">
                {total > 0
                  ? `das IAs apontam ${favoriteKey === "draw" ? "empate" : "vitória"}`
                  : "sem dados suficientes"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2 — CONSENSUS BADGE */}
      <Card className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{consensus.emoji}</span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Nível de Consenso
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold">{consensus.label}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <DistChip label={match.home_team_code ?? "Mandante"} value={counts.home} total={total} tone="home" />
          <DistChip label="Empate" value={counts.draw} total={total} tone="draw" />
          <DistChip label={match.away_team_code ?? "Visitante"} value={counts.away} total={total} tone="away" />
        </div>
      </Card>

      {/* SECTION 3 — PREDICTIONS */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-4 text-gold" />
          <h3 className="font-display text-lg font-bold">Previsões das IAs</h3>
          <Badge variant="outline" className="ml-auto text-[10px]">
            {sims.length} {sims.length === 1 ? "modelo" : "modelos"}
          </Badge>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">IA</th>
                <th className="text-left px-4 py-2 font-semibold">Previsão</th>
                <th className="text-right px-4 py-2 font-semibold">Confiança</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p) => (
                <tr key={p.provider} className="border-t border-border/40">
                  <td className="px-4 py-2.5 font-semibold">{p.provider}</td>
                  <td className="px-4 py-2.5">
                    <PickPill pick={p.pick} match={match} />
                  </td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                    {p.confidence != null ? `${Math.round(p.confidence * 100)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {picks.map((p) => (
            <div
              key={p.provider}
              className="rounded-lg border border-border/60 bg-card/60 p-3 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{p.provider}</div>
                {p.confidence != null && (
                  <div className="text-[10px] text-muted-foreground">
                    Confiança {Math.round(p.confidence * 100)}%
                  </div>
                )}
              </div>
              <PickPill pick={p.pick} match={match} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* SECTION 4 — MOST CITED RESULT (placeholder when unavailable) */}
        <HighlightCard
          icon={<ScrollText className="size-3.5" />}
          eyebrow="Resultado Mais Provável"
          title={favoriteKey === "draw" ? "Empate equilibrado" : `Vitória — ${favoriteName}`}
          subtitle={
            favoriteKey === "draw"
              ? "Partida apontada como dividida pelas IAs."
              : `${favoritePct}% das IAs projetam vitória.`
          }
          accent={<TrendingUp className="size-5 text-primary" />}
        />

        {/* SECTION 5 — MOST CITED PLAYER */}
        <HighlightCard
          icon={<Star className="size-3.5" />}
          eyebrow="Jogador Mais Citado"
          title={topPlayer?.name ?? "—"}
          subtitle={
            topPlayer
              ? `${topPlayer.team_name ?? topPlayer.team_code ?? ""} · ${topPlayer.votes} ${
                  topPlayer.votes === 1 ? "menção" : "menções"
                }`
              : "Sem menções desta partida."
          }
          accent={<Users className="size-5 text-gold" />}
        />

        {/* SECTION 6 — MOST CITED TOP SCORER */}
        <HighlightCard
          icon={<Target className="size-3.5" />}
          eyebrow="Artilheiro Mais Citado"
          title={topScorer?.name ?? "—"}
          subtitle={
            topScorer
              ? `${topScorer.team_name ?? topScorer.team_code ?? ""} · ${topScorer.votes} ${
                  topScorer.votes === 1 ? "menção" : "menções"
                }`
              : "Sem menções desta partida."
          }
          accent={<Target className="size-5 text-primary" />}
        />
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------

function DistChip({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "home" | "away" | "draw";
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const toneCls =
    tone === "home"
      ? "border-primary/40 text-primary"
      : tone === "away"
        ? "border-gold/40 text-gold"
        : "border-border text-muted-foreground";
  return (
    <div
      className={`px-2.5 py-1 rounded-md border ${toneCls} text-[11px] font-semibold flex items-center gap-1.5`}
    >
      <span>{label}</span>
      <span className="tabular-nums">
        {value}
        <span className="text-muted-foreground/70 font-normal"> · {pct}%</span>
      </span>
    </div>
  );
}

function PickPill({ pick, match }: { pick: Pick; match: VMatchesFull }) {
  if (pick === "unknown")
    return (
      <Badge variant="outline" className="text-[10px] text-muted-foreground">
        Sem indicação
      </Badge>
    );
  if (pick === "draw")
    return (
      <Badge variant="outline" className="text-[10px]">
        Empate
      </Badge>
    );
  const isHome = pick === "home";
  const code = isHome ? match.home_team_code : match.away_team_code;
  const name =
    (isHome ? match.home_team_name : match.away_team_name) ??
    (isHome ? match.home_display_name : match.away_display_name) ??
    (isHome ? "Mandante" : "Visitante");
  return (
    <span className="inline-flex items-center gap-1.5">
      <TeamFlag teamCode={code} teamName={name} size={18} />
      <span className="font-semibold text-sm">{name}</span>
    </span>
  );
}

function HighlightCard({
  icon,
  eyebrow,
  title,
  subtitle,
  accent,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent?: React.ReactNode;
}) {
  return (
    <Card className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] uppercase tracking-widest text-gold flex items-center gap-1.5">
          {icon}
          {eyebrow}
        </div>
        {accent}
      </div>
      <div className="font-display text-xl font-bold mt-2 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
    </Card>
  );
}

// --------------------------------------------------------------------------

interface CitedItem {
  name: string;
  team_code: string | null;
  team_name: string | null;
  provider: string;
}

function mostCited(items: CitedItem[]):
  | { name: string; team_code: string | null; team_name: string | null; votes: number; providers: string[] }
  | null {
  if (items.length === 0) return null;
  const map = new Map<
    string,
    { name: string; team_code: string | null; team_name: string | null; votes: number; providers: string[] }
  >();
  for (const it of items) {
    const key = it.name.trim().toLowerCase();
    if (!key) continue;
    const prev = map.get(key);
    if (prev) {
      prev.votes += 1;
      if (!prev.providers.includes(it.provider)) prev.providers.push(it.provider);
    } else {
      map.set(key, {
        name: it.name,
        team_code: it.team_code,
        team_name: it.team_name,
        votes: 1,
        providers: [it.provider],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.votes - a.votes)[0] ?? null;
}

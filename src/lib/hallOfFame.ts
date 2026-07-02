// Hall da Fama — aggregation & achievement rules.
// Pure functions; safe to memoize on the client.

import type {
  VwAiPredictionRanking,
  MatchPredictionEvaluated,
} from "@/types/views";

export type ProviderKey = string;

export interface PhaseAccuracy {
  stage: string;
  total: number;
  winnerHits: number;
  exactScoreHits: number;
  winnerAccuracy: number; // 0-100
  exactAccuracy: number;  // 0-100
}

export interface ProviderStats {
  provider: ProviderKey;
  matchesPredicted: number;
  winnerHits: number;
  winnerAccuracy: number;   // 0-100
  exactScoreHits: number;
  avgScoreError: number | null;
  totalPoints: number;
  longestStreak: number;
  currentStreak: number;
  phases: PhaseAccuracy[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  provider: ProviderKey | null;
  value?: string;
}

// Points scheme (mirrors backend view where possible; used only for streaks/derived).
const POINTS_WINNER = 3;
const POINTS_EXACT_BONUS = 2;

const STAGE_LABEL: Record<string, string> = {
  group_stage: "Fase de Grupos",
  round_of_32: "16-avos de Final",
  round_of_16: "Oitavas de Final",
  quarterfinals: "Quartas de Final",
  semifinals: "Semifinais",
  third_place: "Disputa do 3º Lugar",
  final: "Final",
};

export function stageLabel(stage: string | null | undefined) {
  if (!stage) return "Outros";
  return STAGE_LABEL[stage] ?? stage.replace(/_/g, " ");
}

/** Compute per-provider streaks (longest and current) from evaluated predictions. */
function computeStreaks(evaluated: MatchPredictionEvaluated[]) {
  // Order by evaluated_at asc for streak semantics.
  const sorted = [...evaluated].sort((a, b) => {
    const at = a.evaluated_at ?? a.generated_at ?? "";
    const bt = b.evaluated_at ?? b.generated_at ?? "";
    return at.localeCompare(bt);
  });
  let longest = 0;
  let current = 0;
  for (const p of sorted) {
    if (p.was_correct_winner) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return { longest, current };
}

/** Combine ranking view with evaluated predictions to produce full stats per provider. */
export function buildProviderStats(
  ranking: VwAiPredictionRanking[],
  evaluated: MatchPredictionEvaluated[],
): ProviderStats[] {
  const byProvider = new Map<string, MatchPredictionEvaluated[]>();
  for (const p of evaluated) {
    const list = byProvider.get(p.provider) ?? [];
    list.push(p);
    byProvider.set(p.provider, list);
  }

  const providers = new Set<string>([
    ...ranking.map((r) => r.provider),
    ...byProvider.keys(),
  ]);

  return Array.from(providers).map((provider) => {
    const rankRow = ranking.find((r) => r.provider === provider);
    const rows = byProvider.get(provider) ?? [];

    // Per-phase aggregation.
    const phaseMap = new Map<string, PhaseAccuracy>();
    for (const p of rows) {
      const key = p.stage ?? "unknown";
      const acc = phaseMap.get(key) ?? {
        stage: key,
        total: 0,
        winnerHits: 0,
        exactScoreHits: 0,
        winnerAccuracy: 0,
        exactAccuracy: 0,
      };
      acc.total += 1;
      if (p.was_correct_winner) acc.winnerHits += 1;
      if (p.is_exact_score) acc.exactScoreHits += 1;
      phaseMap.set(key, acc);
    }
    const phases = Array.from(phaseMap.values()).map((p) => ({
      ...p,
      winnerAccuracy: p.total ? (p.winnerHits / p.total) * 100 : 0,
      exactAccuracy: p.total ? (p.exactScoreHits / p.total) * 100 : 0,
    }));

    const { longest, current } = computeStreaks(rows);

    return {
      provider,
      matchesPredicted: rankRow?.matches_predicted ?? rows.length,
      winnerHits:
        rankRow?.winner_hits ??
        rows.filter((r) => r.was_correct_winner).length,
      winnerAccuracy: rankRow?.winner_accuracy ?? 0,
      exactScoreHits:
        rankRow?.exact_score_hits ??
        rows.filter((r) => r.is_exact_score).length,
      avgScoreError: rankRow?.avg_score_error ?? null,
      totalPoints:
        rankRow?.total_points ??
        rows.reduce(
          (n, r) =>
            n +
            (r.was_correct_winner ? POINTS_WINNER : 0) +
            (r.is_exact_score ? POINTS_EXACT_BONUS : 0),
          0,
        ),
      longestStreak: longest,
      currentStreak: current,
      phases: phases.sort((a, b) => b.total - a.total),
    };
  });
}

/** Configurable achievement rules. Each rule returns an Achievement or null. */
export type AchievementRule = (stats: ProviderStats[]) => Achievement | null;

const bestOf = (
  stats: ProviderStats[],
  pick: (s: ProviderStats) => number,
  minValue = 0,
) => {
  if (!stats.length) return null;
  const sorted = [...stats].sort((a, b) => pick(b) - pick(a));
  const top = sorted[0];
  if (pick(top) <= minValue) return null;
  return top;
};

export const DEFAULT_ACHIEVEMENT_RULES: AchievementRule[] = [
  (stats) => {
    const top = bestOf(stats, (s) => s.winnerAccuracy);
    return top && {
      id: "top_accuracy",
      title: "Maior Precisão",
      description: "IA com o melhor índice de acerto do vencedor.",
      provider: top.provider,
      value: `${top.winnerAccuracy.toFixed(1)}%`,
    };
  },
  (stats) => {
    const top = bestOf(stats, (s) => s.longestStreak);
    return top && {
      id: "longest_streak",
      title: "Maior Sequência de Acertos",
      description: "Maior série consecutiva de vencedores corretos.",
      provider: top.provider,
      value: `${top.longestStreak} jogos`,
    };
  },
  (stats) => {
    const top = bestOf(stats, (s) => s.exactScoreHits);
    return top && {
      id: "exact_scores",
      title: "Mestre do Placar Exato",
      description: "Mais placares exatos previstos.",
      provider: top.provider,
      value: `${top.exactScoreHits} acertos`,
    };
  },
  (stats) => {
    const top = bestOf(stats, (s) => s.totalPoints);
    return top && {
      id: "top_points",
      title: "Maior Pontuação",
      description: "IA com a maior pontuação acumulada.",
      provider: top.provider,
      value: `${top.totalPoints} pts`,
    };
  },
  (stats) => {
    // Lower avg_score_error is better. Pick lowest, ignore null.
    const valid = stats.filter((s) => s.avgScoreError != null);
    if (!valid.length) return null;
    const top = [...valid].sort(
      (a, b) => (a.avgScoreError ?? Infinity) - (b.avgScoreError ?? Infinity),
    )[0];
    return {
      id: "score_precision",
      title: "Placar Mais Próximo",
      description: "Menor erro médio de placar por partida.",
      provider: top.provider,
      value: `${top.avgScoreError?.toFixed(2)} gols`,
    };
  },
  (stats) => {
    // Best in Round of 16 or later (mata-mata) — proves clutch performance.
    const late = ["round_of_16", "quarterfinals", "semifinals", "final"];
    let best: { provider: string; hits: number; total: number } | null = null;
    for (const s of stats) {
      const filtered = s.phases.filter((p) => late.includes(p.stage));
      const total = filtered.reduce((n, p) => n + p.total, 0);
      const hits = filtered.reduce((n, p) => n + p.winnerHits, 0);
      if (total >= 2 && (!best || hits / total > best.hits / best.total)) {
        best = { provider: s.provider, hits, total };
      }
    }
    return best && {
      id: "knockout_king",
      title: "Rei do Mata-Mata",
      description: "Maior precisão nas fases eliminatórias.",
      provider: best.provider,
      value: `${((best.hits / best.total) * 100).toFixed(0)}%`,
    };
  },
];

export function computeAchievements(
  stats: ProviderStats[],
  rules: AchievementRule[] = DEFAULT_ACHIEVEMENT_RULES,
): Achievement[] {
  return rules
    .map((rule) => rule(stats))
    .filter((a): a is Achievement => a != null);
}

export function podium(stats: ProviderStats[]) {
  return [...stats]
    .sort((a, b) => b.totalPoints - a.totalPoints || b.winnerAccuracy - a.winnerAccuracy)
    .slice(0, 3);
}

export function initialsFor(provider: string) {
  return provider
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

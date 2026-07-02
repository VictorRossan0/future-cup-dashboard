import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAiPredictionRanking,
  getEvaluatedMatchPredictions,
} from "@/services/copaService";
import {
  buildProviderStats,
  computeAchievements,
  podium,
  DEFAULT_ACHIEVEMENT_RULES,
  type AchievementRule,
} from "@/lib/hallOfFame";

const TEN_MIN = 10 * 60 * 1000;

export function useHallOfFame(rules: AchievementRule[] = DEFAULT_ACHIEVEMENT_RULES) {
  const rankingQ = useQuery({
    queryKey: ["vw_ai_prediction_ranking"],
    queryFn: getAiPredictionRanking,
    staleTime: TEN_MIN,
    gcTime: 30 * 60 * 1000,
  });

  const predictionsQ = useQuery({
    queryKey: ["match_predictions_evaluated"],
    queryFn: getEvaluatedMatchPredictions,
    staleTime: TEN_MIN,
    gcTime: 30 * 60 * 1000,
  });

  const isLoading = rankingQ.isLoading || predictionsQ.isLoading;
  const isError = rankingQ.isError || predictionsQ.isError;
  const errorMessage = isError
    ? "Não foi possível carregar as métricas das IAs. Tente novamente em instantes."
    : null;

  const derived = useMemo(() => {
    const ranking = rankingQ.data?.data ?? [];
    const evaluated = predictionsQ.data?.data ?? [];
    const stats = buildProviderStats(ranking, evaluated);
    const sorted = [...stats].sort(
      (a, b) => b.totalPoints - a.totalPoints || b.winnerAccuracy - a.winnerAccuracy,
    );
    return {
      stats: sorted,
      podium: podium(stats),
      achievements: computeAchievements(stats, rules),
      totalEvaluated: evaluated.length,
      hasRealData:
        stats.some((s) => s.matchesPredicted > 0) && evaluated.length > 0,
      lastUpdated:
        Math.max(rankingQ.dataUpdatedAt ?? 0, predictionsQ.dataUpdatedAt ?? 0) ||
        null,
    };
  }, [rankingQ.data, predictionsQ.data, rankingQ.dataUpdatedAt, predictionsQ.dataUpdatedAt, rules]);

  return {
    ...derived,
    isLoading,
    isError,
    errorMessage,
    refetch: () => {
      rankingQ.refetch();
      predictionsQ.refetch();
    },
  };
}

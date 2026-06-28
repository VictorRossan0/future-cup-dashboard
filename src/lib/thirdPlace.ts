// Ranks 3rd-placed teams across all groups using FIFA tiebreakers.
// Order: points → goal_difference → goals_for → fair_play_points (lower) → group_code.
import type { VGroupsStandings } from "@/types/views";

export interface ThirdPlaceRow extends VGroupsStandings {
  ranking: number;
  qualifies: boolean;
  isProjection: boolean;
}

export function computeThirdPlaceRanking(
  standings: VGroupsStandings[],
  qualifierSlots = 8,
): { rows: ThirdPlaceRow[]; allGroupsFinished: boolean; groupsConsidered: number } {
  // pick 3rd of each group (position === 3); fallback by sort if missing.
  const byGroup = new Map<string, VGroupsStandings[]>();
  for (const s of standings) {
    if (!s.group_code) continue;
    if (!byGroup.has(s.group_code)) byGroup.set(s.group_code, []);
    byGroup.get(s.group_code)!.push(s);
  }

  const thirds: VGroupsStandings[] = [];
  let allFinished = true;
  for (const [, rows] of byGroup) {
    const sorted = [...rows].sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
    const third = sorted.find((r) => r.position === 3) ?? sorted[2];
    if (!third) continue;
    // group finished if every team has 3 played
    if (!rows.every((r) => (r.played ?? 0) >= 3)) allFinished = false;
    thirds.push(third);
  }

  thirds.sort((a, b) => {
    const pts = (b.points ?? 0) - (a.points ?? 0);
    if (pts) return pts;
    const gd = (b.goal_difference ?? 0) - (a.goal_difference ?? 0);
    if (gd) return gd;
    const gf = (b.goals_for ?? 0) - (a.goals_for ?? 0);
    if (gf) return gf;
    const fp = (a.fair_play_points ?? 0) - (b.fair_play_points ?? 0);
    if (fp) return fp;
    return (a.group_code ?? "").localeCompare(b.group_code ?? "");
  });

  const rows: ThirdPlaceRow[] = thirds.map((t, i) => ({
    ...t,
    ranking: i + 1,
    qualifies: i < qualifierSlots,
    isProjection: !allFinished,
  }));

  return { rows, allGroupsFinished: allFinished, groupsConsidered: thirds.length };
}

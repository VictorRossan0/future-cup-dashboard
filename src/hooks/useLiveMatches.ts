// Realtime subscription for live match updates.
//
// Subscribes to Postgres UPDATE events on the `matches` table and patches
// the existing TanStack Query cache for `v_matches_full` in place — no
// refetch needed for individual updates.
//
// Adds a lightweight polling safety net (every 30s) WHILE at least one
// match is `in_progress` in the cache, in case the WebSocket connection
// drops silently. The polling stops automatically when no match is live.

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { VMatchesFull } from "@/types/views";

type MatchesPayload = {
  data: VMatchesFull[];
  source: "supabase" | "mock";
  error?: string;
};

// Columns we care about for a live update. Anything else is ignored to keep
// the merge surgical (status/score/clock/period/timestamp).
const LIVE_FIELDS = [
  "status",
  "home_score",
  "away_score",
  "live_clock",
  "live_period",
  "live_updated_at",
] as const;

function mergeLive(prev: VMatchesFull, next: Record<string, unknown>): VMatchesFull {
  const patch: Partial<VMatchesFull> = {};
  for (const f of LIVE_FIELDS) {
    if (f in next) (patch as any)[f] = next[f];
  }
  return { ...prev, ...patch };
}

function patchCache(queryClient: ReturnType<typeof useQueryClient>, row: Record<string, unknown>) {
  const id = (row.id ?? row.match_id) as string | undefined;
  if (!id) return;

  queryClient.setQueryData<MatchesPayload>(["v_matches_full"], (curr) => {
    if (!curr) return curr;
    let changed = false;
    const data = curr.data.map((m) => {
      if (m.match_id !== id) return m;
      changed = true;
      return mergeLive(m, row);
    });
    return changed ? { ...curr, data } : curr;
  });
}

export function useLiveMatches() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("matches-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches" },
        (payload) => {
          const row = (payload.new ?? {}) as Record<string, unknown>;
          patchCache(queryClient, row);
        },
      )
      .subscribe();

    // Polling safety net — only ticks while there is at least one live match.
    const interval = window.setInterval(() => {
      const curr = queryClient.getQueryData<MatchesPayload>(["v_matches_full"]);
      const hasLive = curr?.data.some((m) => m.status === "in_progress");
      if (hasLive) {
        queryClient.invalidateQueries({ queryKey: ["v_matches_full"] });
      }
    }, 30_000);

    return () => {
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

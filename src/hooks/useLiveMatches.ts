// Live-match updater.
//
// Polls the curated `v_matches_full` view (via TanStack Query invalidation)
// while any match is in progress. We intentionally do NOT subscribe to
// Postgres `postgres_changes` on the raw `matches` table: that channel
// broadcasts the full row (all columns) to every subscribed client, which
// could leak internal columns not exposed by the public view.
//
// Polling against the view keeps the UI live while ensuring only the
// columns curated by `v_matches_full` ever reach the client.

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { VMatchesFull } from "@/types/views";

type MatchesPayload = {
  data: VMatchesFull[];
  source: "supabase" | "mock";
  error?: string;
};

const LIVE_POLL_MS = 15_000;
const IDLE_POLL_MS = 60_000;

export function useLiveMatches() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let timer: number | undefined;

    const tick = () => {
      const curr = queryClient.getQueryData<MatchesPayload>(["v_matches_full"]);
      const hasLive = curr?.data.some((m) => m.status === "in_progress");
      if (hasLive) {
        queryClient.invalidateQueries({ queryKey: ["v_matches_full"] });
      }
      timer = window.setTimeout(tick, hasLive ? LIVE_POLL_MS : IDLE_POLL_MS);
    };

    timer = window.setTimeout(tick, LIVE_POLL_MS);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [queryClient]);
}

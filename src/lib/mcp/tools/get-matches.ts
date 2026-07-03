import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_matches",
  title: "List matches",
  description:
    "List World Cup 2026 matches. Optional filters by stage, status, group code, or team code (home or away).",
  inputSchema: {
    stage: z.string().optional().describe("e.g. group_stage, round_of_32, round_of_16, quarter_finals, semi_finals, third_place, final"),
    status: z.enum(["scheduled", "current", "finished"]).optional(),
    group_code: z.string().optional(),
    team_code: z.string().optional().describe("3-letter team code; matches home or away."),
    limit: z.number().int().min(1).max(200).optional().default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ stage, status, group_code, team_code, limit }) => {
    try {
      let q = getSupabase()
        .from("v_matches_full")
        .select("*")
        .order("match_number", { ascending: true });
      if (stage) q = q.eq("stage", stage);
      if (status) q = q.eq("status", status);
      if (group_code) q = q.eq("group_code", group_code.toUpperCase());
      if (team_code) {
        const code = team_code.toUpperCase();
        q = q.or(`home_team_code.eq.${code},away_team_code.eq.${code}`);
      }
      q = q.limit(limit ?? 50);
      const { data, error } = await q;
      if (error) throw error;
      return textResult(data ?? []);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

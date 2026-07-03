import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_teams",
  title: "List teams",
  description: "List World Cup 2026 teams with coach info and squad composition counts. Optional group filter.",
  inputSchema: {
    group_code: z.string().length(1).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ group_code }) => {
    try {
      let q = getSupabase()
        .from("v_teams_full")
        .select("*")
        .order("group_code", { ascending: true })
        .order("team_name", { ascending: true });
      if (group_code) q = q.eq("group_code", group_code.toUpperCase());
      const { data, error } = await q;
      if (error) throw error;
      return textResult(data ?? []);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

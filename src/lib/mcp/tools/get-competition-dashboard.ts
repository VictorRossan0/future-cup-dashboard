import { defineTool } from "@lovable.dev/mcp-js";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_competition_dashboard",
  title: "Competition dashboard",
  description:
    "Get the World Cup 2026 competition overview: name, dates, host countries, total teams, groups, matches, stadiums and players.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    try {
      const { data, error } = await getSupabase()
        .from("v_competition_dashboard")
        .select("*")
        .limit(1);
      if (error) throw error;
      return textResult(data?.[0] ?? null);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

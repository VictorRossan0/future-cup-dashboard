import { defineTool } from "@lovable.dev/mcp-js";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_ai_consensus",
  title: "AI consensus",
  description:
    "Get the cross-provider AI consensus summary for World Cup 2026 predictions (agreement rates, favorite champions, dark horses).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    try {
      const { data, error } = await getSupabase()
        .from("v_ai_simulation_consensus")
        .select("*")
        .limit(1);
      if (error) throw error;
      return textResult(data?.[0] ?? null);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

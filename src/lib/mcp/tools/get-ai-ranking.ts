import { defineTool } from "@lovable.dev/mcp-js";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_ai_ranking",
  title: "AI prediction ranking",
  description:
    "Get the aggregated ranking of AI providers (ChatGPT, Gemini, Claude, etc.) with winner accuracy, exact scores and total points from evaluated predictions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    try {
      const { data, error } = await getSupabase()
        .from("vw_ai_prediction_ranking")
        .select("*")
        .order("total_points", { ascending: false });
      if (error) throw error;
      return textResult(data ?? []);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

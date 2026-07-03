import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_groups_standings",
  title: "Group standings",
  description:
    "Get current group-stage standings for the World Cup 2026. Optionally filter by a single group code (A–L).",
  inputSchema: {
    group_code: z
      .string()
      .length(1)
      .regex(/^[A-L]$/i)
      .optional()
      .describe("Group letter A–L. Omit to return all groups."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ group_code }) => {
    try {
      let q = getSupabase()
        .from("v_groups_standings")
        .select("*")
        .order("group_code", { ascending: true })
        .order("position", { ascending: true });
      if (group_code) q = q.eq("group_code", group_code.toUpperCase());
      const { data, error } = await q;
      if (error) throw error;
      return textResult(data ?? []);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

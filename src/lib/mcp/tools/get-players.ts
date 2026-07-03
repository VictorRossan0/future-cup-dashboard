import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, getSupabase, textResult } from "../supabase";

export default defineTool({
  name: "get_players",
  title: "List players",
  description:
    "List players for the World Cup 2026 with optional filters (team code, group, position, club search).",
  inputSchema: {
    team_code: z.string().optional(),
    group_code: z.string().optional(),
    position: z.enum(["goalkeeper", "defender", "midfielder", "forward"]).optional(),
    club: z.string().optional().describe("Case-insensitive substring match on club name."),
    limit: z.number().int().min(1).max(500).optional().default(100),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ team_code, group_code, position, club, limit }) => {
    try {
      let q = getSupabase().from("v_players_full").select("*");
      if (team_code) q = q.eq("team_code", team_code.toUpperCase());
      if (group_code) q = q.eq("group_code", group_code.toUpperCase());
      if (position) q = q.eq("position", position);
      if (club) q = q.ilike("club", `%${club}%`);
      const { data, error } = await q
        .order("team_code", { ascending: true })
        .order("jersey_number", { ascending: true })
        .limit(limit ?? 100);
      if (error) throw error;
      return textResult(data ?? []);
    } catch (e) {
      return errorResult((e as Error).message);
    }
  },
});

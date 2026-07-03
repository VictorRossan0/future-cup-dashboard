import { defineMcp } from "@lovable.dev/mcp-js";
import getCompetitionDashboard from "./tools/get-competition-dashboard";
import getGroupsStandings from "./tools/get-groups-standings";
import getMatches from "./tools/get-matches";
import getTeams from "./tools/get-teams";
import getPlayers from "./tools/get-players";
import getAiRanking from "./tools/get-ai-ranking";
import getAiConsensus from "./tools/get-ai-consensus";

export default defineMcp({
  name: "copa-2026-intelligence-mcp",
  title: "Copa 2026 Intelligence",
  version: "0.1.0",
  instructions:
    "Read-only tools to explore World Cup 2026 data: competition overview, group standings, matches, teams, players, and multi-provider AI predictions (ranking and consensus). All data is sourced from the app's Supabase views. This is a prototype: predictions are simulated by multiple AIs and results are not official FIFA data.",
  tools: [
    getCompetitionDashboard,
    getGroupsStandings,
    getMatches,
    getTeams,
    getPlayers,
    getAiRanking,
    getAiConsensus,
  ],
});

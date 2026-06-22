// Centralized data services. Reads exclusively from Supabase public views.
// Falls back to local mocks if Supabase is unconfigured or the call fails.

import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type {
  VCompetitionDashboard, VGroupsStandings, VMatchesFull,
  VTeamsFull, VPlayersFull, VRulesOrdered,
  VAiSimulationContext, VDataQualitySummary,
  VAiSimulationsFull, VAiSimulationConsensus,
} from "@/types/views";

// Mocks (fallback only) -----------------------------------------------------
import { competition as mockCompetition, stadiums as mockStadiums } from "@/data/competition";
import { teams as mockTeams } from "@/data/teams";
import { groups as mockGroups } from "@/data/groups";
import { matches as mockMatches } from "@/data/matches";

async function safeFetch<T>(
  fn: () => PromiseLike<{ data: T[] | null; error: unknown }>,
  fallback: T[],
): Promise<{ data: T[]; source: "supabase" | "mock"; error?: string }> {
  if (!isSupabaseConfigured) {
    return { data: fallback, source: "mock", error: "supabase_not_configured" };
  }
  try {
    const { data, error } = await fn();
    if (error) throw error;
    if (!data || data.length === 0) {
      return { data: [], source: "supabase" };
    }
    return { data: data as T[], source: "supabase" };
  } catch (err) {
    console.error("[copaService] Supabase fetch failed, using mock fallback", err);
    return { data: fallback, source: "mock", error: String(err) };
  }
}

// Dashboard -----------------------------------------------------------------
export async function getCompetitionDashboard() {
  const fallback: VCompetitionDashboard[] = [{
    name: mockCompetition.name,
    year: 2026,
    start_date: mockCompetition.startDate,
    end_date: mockCompetition.endDate,
    host_countries: mockCompetition.hosts,
    total_teams: mockCompetition.teams,
    total_groups: mockCompetition.groups,
    total_matches: mockCompetition.matches,
    total_stadiums: mockStadiums.length,
    total_players: 0,
  }];
  const res = await safeFetch<VCompetitionDashboard>(
    () => supabase.from("v_competition_dashboard").select("*").limit(1),
    fallback,
  );
  return { ...res, data: res.data[0] ?? fallback[0] };
}

// Groups standings ----------------------------------------------------------
export async function getGroupsStandings() {
  const fallback: VGroupsStandings[] = mockGroups.flatMap((g) =>
    g.teams.map((s, idx) => {
      const team = mockTeams.find((t) => t.id === s.teamId);
      return {
        group_code: g.letter,
        team_id: s.teamId,
        team_code: team?.code,
        team_name: team?.name ?? s.teamId,
        coach_name: team?.coach ?? null,
        position: idx + 1,
        played: s.played, wins: s.wins, draws: s.draws, losses: s.losses,
        goals_for: s.goalsFor, goals_against: s.goalsAgainst,
        goal_difference: s.goalDiff, points: s.points,
        qualification_status: s.status,
      } satisfies VGroupsStandings;
    }),
  );
  return safeFetch<VGroupsStandings>(
    () => supabase.from("v_groups_standings").select("*")
      .order("group_code", { ascending: true }).order("position", { ascending: true }),
    fallback,
  );
}

// Matches -------------------------------------------------------------------
export async function getMatches() {
  const fallback: VMatchesFull[] = mockMatches.map((m, idx) => {
    const home = mockTeams.find((t) => t.id === m.homeTeamId);
    const away = mockTeams.find((t) => t.id === m.awayTeamId);
    return {
      match_id: m.id, match_number: idx + 1, stage: "group_stage",
      group_code: m.group, match_date: m.date.slice(0, 10), match_time: m.date.slice(11, 16),
      stadium: m.stadium, city: m.city, country: "EUA",
      status: m.status === "Encerrado" ? "finished" : m.status === "Ao vivo" ? "current" : "scheduled",
      home_team_id: m.homeTeamId, home_team_code: home?.code, home_team_name: home?.name,
      away_team_id: m.awayTeamId, away_team_code: away?.code, away_team_name: away?.name,
      home_display_name: home?.name ?? "", away_display_name: away?.name ?? "",
      home_score: m.homeScore, away_score: m.awayScore,
    } satisfies VMatchesFull;
  });
  return safeFetch<VMatchesFull>(
    () => supabase.from("v_matches_full").select("*").order("match_number", { ascending: true }),
    fallback,
  );
}

// Teams ---------------------------------------------------------------------
export async function getTeams() {
  const fallback: VTeamsFull[] = mockTeams.map((t) => ({
    team_id: t.id, team_code: t.code, team_name: t.name,
    group_code: t.group, confederation: t.confederation,
    coach_name: t.coach, coach_nationality: null, coach_age: null,
    squad_status: t.players?.length ? "complete" : "pending",
    goalkeeper_count: t.players?.filter((p) => p.position === "Goleiro").length ?? 0,
    defender_count:   t.players?.filter((p) => p.position === "Defensor").length ?? 0,
    midfielder_count: t.players?.filter((p) => p.position === "Meio-campista").length ?? 0,
    forward_count:    t.players?.filter((p) => p.position === "Atacante").length ?? 0,
    total_players: t.players?.length ?? 0,
  }));
  return safeFetch<VTeamsFull>(
    () => supabase.from("v_teams_full").select("*")
      .order("group_code", { ascending: true }).order("team_name", { ascending: true }),
    fallback,
  );
}

// Players -------------------------------------------------------------------
export interface PlayersFilter {
  team_id?: string;
  team_code?: string;
  group_code?: string;
  position?: string;
  club?: string;
}

const POSITION_FROM_PT: Record<string, string> = {
  "Goleiro": "goalkeeper", "Defensor": "defender",
  "Meio-campista": "midfielder", "Atacante": "forward",
};

export async function getPlayers(filter: PlayersFilter = {}) {
  const fallback: VPlayersFull[] = mockTeams.flatMap((t) =>
    (t.players ?? []).map((p) => ({
      player_id: p.id, player_name: p.name,
      team_id: t.id, team_code: t.code, team_name: t.name, group_code: t.group,
      jersey_number: p.number, position: POSITION_FROM_PT[p.position] ?? p.position,
      age: p.age, date_of_birth: null, height_cm: Math.round((p.height ?? 1.78) * 100),
      club: p.club, source: "mock",
    })),
  );

  if (!isSupabaseConfigured) {
    return applyClientFilters({ data: fallback, source: "mock" as const }, filter);
  }
  try {
    let q = supabase.from("v_players_full").select("*");
    if (filter.team_id)    q = q.eq("team_id", filter.team_id);
    if (filter.team_code)  q = q.eq("team_code", filter.team_code);
    if (filter.group_code) q = q.eq("group_code", filter.group_code);
    if (filter.position)   q = q.eq("position", filter.position);
    if (filter.club)       q = q.ilike("club", `%${filter.club}%`);
    const { data, error } = await q.order("jersey_number", { ascending: true });
    if (error) throw error;
    return { data: data ?? [], source: "supabase" as const };
  } catch (err) {
    console.error("[copaService] getPlayers fallback", err);
    return applyClientFilters({ data: fallback, source: "mock" as const, error: String(err) }, filter);
  }
}

function applyClientFilters(
  res: { data: VPlayersFull[]; source: "mock"; error?: string },
  f: PlayersFilter,
) {
  let data = res.data;
  if (f.team_id)    data = data.filter((p) => p.team_id === f.team_id);
  if (f.team_code)  data = data.filter((p) => p.team_code === f.team_code);
  if (f.group_code) data = data.filter((p) => p.group_code === f.group_code);
  if (f.position)   data = data.filter((p) => p.position === f.position);
  if (f.club)       data = data.filter((p) => p.club?.toLowerCase().includes(f.club!.toLowerCase()));
  return { ...res, data };
}

// Rules ---------------------------------------------------------------------
export async function getRules() {
  const fallback: VRulesOrdered[] = [];
  return safeFetch<VRulesOrdered>(
    () => supabase.from("v_rules_ordered").select("*").order("display_order", { ascending: true }),
    fallback,
  );
}

// AI Simulation Context -----------------------------------------------------
export async function getAiSimulationContext() {
  const fallback: VAiSimulationContext[] = [];
  return safeFetch<VAiSimulationContext>(
    () => supabase.from("v_ai_simulation_context").select("*").order("team_name", { ascending: true }),
    fallback,
  );
}

// Data quality --------------------------------------------------------------
export async function getDataQualitySummary() {
  const fallback: VDataQualitySummary[] = [];
  return safeFetch<VDataQualitySummary>(
    () => supabase.from("v_data_quality_summary").select("*"),
    fallback,
  );
}

// AI Simulations Full -------------------------------------------------------
export async function getAiSimulationsFull() {
  const fallback: VAiSimulationsFull[] = [];
  return safeFetch<VAiSimulationsFull>(
    () => supabase.from("v_ai_simulations_full").select("*").order("provider", { ascending: true }),
    fallback,
  );
}

// AI Simulation Consensus ---------------------------------------------------
export async function getAiSimulationConsensus() {
  const fallback: VAiSimulationConsensus[] = [];
  const res = await safeFetch<VAiSimulationConsensus>(
    () => supabase.from("v_ai_simulation_consensus").select("*").limit(1),
    fallback,
  );
  return { ...res, data: res.data[0] ?? null };
}

// Match Lineups -------------------------------------------------------------
// Consumes a Supabase view if available. Returns empty when no official
// lineup has been published yet — UI shows an "awaiting data" state.
export interface VMatchLineup {
  match_id?: string | null;
  team_id?: string | null;
  team_code?: string | null;
  team_name?: string | null;
  side?: "home" | "away" | string | null;
  formation?: string | null;
  coach_name?: string | null;
  captain_player_id?: string | null;
  captain_name?: string | null;
  player_id?: string | null;
  player_name?: string | null;
  jersey_number?: number | null;
  position?: string | null;
  is_starter?: boolean | null;
  is_captain?: boolean | null;
  grid_row?: number | null;
  grid_col?: number | null;
  [k: string]: unknown;
}

// vw_match_lineups exposes ONE row per team with formation/coach (no players).
// match_lineup_players holds player rows linked via lineup_id -> match_lineups.id.
// We fan-out: fetch the per-team header, then fetch the player rows joined to
// players + match_lineups, and emit one VMatchLineup per player carrying team header info.
export async function getMatchLineups(matchId: string) {
  if (!isSupabaseConfigured || !matchId) {
    return { data: [] as VMatchLineup[], source: "mock" as const };
  }

  type HeaderRow = {
    match_id: string;
    team_id: string;
    team_code?: string | null;
    team_name?: string | null;
    formation?: string | null;
    coach_name?: string | null;
  };

  const [headerRes, playersRes, teamRes] = await Promise.all([
    supabase.from("vw_match_lineups").select("*").eq("match_id", matchId),
    supabase
      .from("match_lineup_players")
      .select(
        "id,lineup_id,player_id,is_starter,position_order,position_name,position_abbreviation," +
          "players(name,shirt_number,position,is_captain)," +
          "match_lineups!inner(match_id,team_id,formation,coach_id)"
      )
      .eq("match_lineups.match_id", matchId),
    supabase.from("teams").select("id,name,code").eq("id", matchId === "" ? "" : matchId).limit(0),
  ]);

  // Fetch all teams referenced to enrich code/name when missing.
  const headers = (headerRes.data ?? []) as HeaderRow[];
  const teamIds = Array.from(new Set(headers.map((h) => h.team_id).filter(Boolean)));
  let teamMap = new Map<string, { code?: string | null; name?: string | null }>();
  if (teamIds.length) {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("id,name,code")
      .in("id", teamIds);
    (teamsData ?? []).forEach((t: any) => teamMap.set(t.id, { code: t.code, name: t.name }));
  }
  void teamRes;

  const headerByTeam = new Map<string, HeaderRow>();
  headers.forEach((h) => headerByTeam.set(h.team_id, h));

  const players = (playersRes.data ?? []) as any[];
  const rows: VMatchLineup[] = players.map((p) => {
    const ml = p.match_lineups ?? {};
    const teamId = ml.team_id as string;
    const header = headerByTeam.get(teamId);
    const team = teamMap.get(teamId) ?? {};
    const pl = p.players ?? {};
    return {
      match_id: matchId,
      team_id: teamId,
      team_code: team.code ?? null,
      team_name: header?.team_name ?? team.name ?? null,
      formation: header?.formation ?? ml.formation ?? null,
      coach_name: header?.coach_name ?? null,
      player_id: p.player_id,
      player_name: pl.name ?? null,
      jersey_number: pl.shirt_number ?? null,
      position: pl.position ?? null,
      position_name: p.position_name ?? null,
      position_abbreviation: p.position_abbreviation ?? null,
      is_starter: p.is_starter,
      is_captain: !!pl.is_captain,
    } as VMatchLineup;
  });

  // If we have headers but no players, still surface header rows so the UI
  // can render team/formation/coach.
  if (rows.length === 0 && headers.length) {
    return {
      data: headers.map((h) => {
        const team = teamMap.get(h.team_id) ?? {};
        return {
          match_id: h.match_id,
          team_id: h.team_id,
          team_code: team.code ?? null,
          team_name: h.team_name ?? team.name ?? null,
          formation: h.formation ?? null,
          coach_name: h.coach_name ?? null,
        } as VMatchLineup;
      }),
      source: "supabase" as const,
    };
  }

  return { data: rows, source: "supabase" as const };
}

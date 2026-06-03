// Raw row shapes from Supabase views (v_*).
// Columns follow the spec; optional where the view may omit them.

export interface VCompetitionDashboard {
  competition_id?: string;
  name?: string | null;
  year?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  host_countries?: string[] | string | null;
  total_teams?: number | null;
  total_groups?: number | null;
  total_matches?: number | null;
  total_players?: number | null;
  total_stadiums?: number | null;
  imported_at?: string | null;
  [k: string]: unknown;
}

export interface VGroupsStandings {
  group_code: string;
  group_name?: string | null;
  team_id?: string;
  team_code?: string | null;
  team_name: string;
  coach_name?: string | null;
  position?: number | null;
  played?: number | null;
  wins?: number | null;
  draws?: number | null;
  losses?: number | null;
  goals_for?: number | null;
  goals_against?: number | null;
  goal_difference?: number | null;
  points?: number | null;
  qualification_status?: string | null;
}

export interface VMatchesFull {
  match_id?: string;
  match_number: number;
  stage: string;
  round_name?: string | null;
  group_code?: string | null;
  match_date?: string | null;
  match_time?: string | null;
  timezone?: string | null;
  stadium?: string | null;
  city?: string | null;
  country?: string | null;
  status?: string | null;
  home_team_id?: string | null;
  home_team_code?: string | null;
  home_team_name?: string | null;
  away_team_id?: string | null;
  away_team_code?: string | null;
  away_team_name?: string | null;
  home_display_name?: string | null;
  away_display_name?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  source?: string | null;
}

export interface VTeamsFull {
  team_id: string;
  team_code: string;
  team_name: string;
  group_code?: string | null;
  confederation?: string | null;
  squad_status?: string | null;
  coach_name?: string | null;
  coach_nationality?: string | null;
  coach_age?: number | null;
  goalkeeper_count?: number | null;
  defender_count?: number | null;
  midfielder_count?: number | null;
  forward_count?: number | null;
  total_players?: number | null;
}

export interface VPlayersFull {
  player_id: string;
  player_name: string;
  team_id: string;
  team_code?: string | null;
  team_name?: string | null;
  group_code?: string | null;
  jersey_number?: number | null;
  position: string;
  age?: number | null;
  date_of_birth?: string | null;
  height_cm?: number | null;
  club?: string | null;
  source?: string | null;
}

export interface VRulesOrdered {
  rule_id?: string;
  category: string;
  title?: string | null;
  description?: string | null;
  display_order: number;
}

export interface VAiSimulationContext {
  team_id: string;
  team_name: string;
  team_code?: string | null;
  group_code?: string | null;
  confederation?: string | null;
  coach_name?: string | null;
  goalkeeper_count?: number | null;
  defender_count?: number | null;
  midfielder_count?: number | null;
  forward_count?: number | null;
  avg_age?: number | null;
  avg_height_cm?: number | null;
  clubs_represented?: number | null;
}

export interface VDataQualitySummary {
  entity: string;
  total: number;
}

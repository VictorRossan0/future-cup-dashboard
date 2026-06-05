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

// AI Simulations -----------------------------------------------------------
export interface AiTeamPick {
  team?: string | null;
  team_code?: string | null;
  reason?: string | null;
  probability_score?: number | null;
  [k: string]: unknown;
}

export interface AiRankedTeam {
  rank?: number | null;
  team?: string | null;
  team_code?: string | null;
  score?: number | null;
  reason?: string | null;
  [k: string]: unknown;
}

export interface AiGroupTeamRef {
  team?: string | null;
  team_code?: string | null;
  predicted_position?: number | null;
  reason?: string | null;
  [k: string]: unknown;
}

export interface AiGroupStagePrediction {
  group_code?: string | null;
  group?: string | null;
  // legacy format
  first?: AiGroupTeamRef | string | null;
  second?: AiGroupTeamRef | string | null;
  third?: AiGroupTeamRef | string | null;
  reason?: string | null;
  // new format
  qualified_teams?: AiGroupTeamRef[] | null;
  possible_third_place_candidate?: AiGroupTeamRef | null;
  [k: string]: unknown;
}

export interface AiValidationNotes {
  status?: string | null;
  notes?: string | null;
  corrected_fields?: string[] | null;
  [k: string]: unknown;
}

export interface VAiSimulationsFull {
  simulation_id: string;
  competition_id?: string | null;
  competition_name?: string | null;
  provider: string;
  model?: string | null;
  generated_at?: string | null;
  confidence?: number | null;

  champion_prediction?: AiTeamPick | null;
  champion_team?: string | null;
  champion_team_code?: string | null;
  champion_probability_score?: number | null;
  champion_reason?: string | null;

  runner_up_prediction?: AiTeamPick | null;
  runner_up_team?: string | null;
  runner_up_team_code?: string | null;
  runner_up_probability_score?: number | null;
  runner_up_reason?: string | null;

  semifinalists?: AiTeamPick[] | null;
  top_favorites?: AiRankedTeam[] | null;

  surprise_team?: AiTeamPick | null;
  surprise_team_name?: string | null;
  surprise_team_code?: string | null;

  disappointment_team?: AiTeamPick | null;
  disappointment_team_name?: string | null;
  disappointment_team_code?: string | null;

  top_scorer_prediction?: Record<string, unknown> | null;
  top_scorer_player?: string | null;
  top_scorer_team?: string | null;
  top_scorer_team_code?: string | null;

  best_player_prediction?: Record<string, unknown> | null;
  best_player_name?: string | null;
  best_player_team?: string | null;
  best_player_team_code?: string | null;

  best_young_player_prediction?: Record<string, unknown> | null;
  best_young_player_name?: string | null;
  best_young_player_team?: string | null;
  best_young_player_team_code?: string | null;

  group_of_death?: Record<string, unknown> | null;
  group_of_death_code?: string | null;
  group_of_death_reason?: string | null;

  dark_horses?: AiTeamPick[] | null;
  risk_factors?: Array<string | Record<string, unknown>> | null;
  group_stage_predictions?: AiGroupStagePrediction[] | null;
  tactical_notes?: string | Record<string, unknown> | null;
  analysis_summary?: string | null;
  validation_notes?: AiValidationNotes | null;
  created_at?: string | null;
}

export interface AiConsensusItem {
  team?: string | null;
  team_code?: string | null;
  group_code?: string | null;
  votes: number;
  providers: string[];
  avg_confidence?: number | null;
}

export interface AiProviderPrediction {
  provider: string;
  confidence?: number | null;
  champion_team?: string | null;
  champion_team_code?: string | null;
  runner_up_team?: string | null;
  runner_up_team_code?: string | null;
}

export interface VAiSimulationConsensus {
  competition_id?: string | null;
  competition_name?: string | null;
  total_simulations: number;
  champion_consensus?: AiConsensusItem[] | null;
  runner_up_consensus?: AiConsensusItem[] | null;
  surprise_consensus?: AiConsensusItem[] | null;
  disappointment_consensus?: AiConsensusItem[] | null;
  group_of_death_consensus?: AiConsensusItem[] | null;
  provider_predictions?: AiProviderPrediction[] | null;
  avg_confidence?: number | null;
}

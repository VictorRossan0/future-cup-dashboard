import { useQuery } from "@tanstack/react-query";
import {
  getCompetitionDashboard, getGroupsStandings, getMatches,
  getTeams, getPlayers, getRules, getAiSimulationContext,
  getDataQualitySummary, getAiSimulationsFull, getAiSimulationConsensus,
  type PlayersFilter,
} from "@/services/copaService";

const FIVE_MIN = 5 * 60 * 1000;

export const useCompetitionDashboard = () =>
  useQuery({ queryKey: ["v_competition_dashboard"], queryFn: getCompetitionDashboard, staleTime: FIVE_MIN });

export const useGroupsStandings = () =>
  useQuery({ queryKey: ["v_groups_standings"], queryFn: getGroupsStandings, staleTime: FIVE_MIN });

export const useMatches = () =>
  useQuery({ queryKey: ["v_matches_full"], queryFn: getMatches, staleTime: FIVE_MIN });

export const useTeams = () =>
  useQuery({ queryKey: ["v_teams_full"], queryFn: getTeams, staleTime: FIVE_MIN });

export const usePlayers = (filter: PlayersFilter = {}) =>
  useQuery({ queryKey: ["v_players_full", filter], queryFn: () => getPlayers(filter), staleTime: FIVE_MIN });

export const useRules = () =>
  useQuery({ queryKey: ["v_rules_ordered"], queryFn: getRules, staleTime: FIVE_MIN });

export const useAiSimulationContext = () =>
  useQuery({ queryKey: ["v_ai_simulation_context"], queryFn: getAiSimulationContext, staleTime: FIVE_MIN });

export const useDataQualitySummary = () =>
  useQuery({ queryKey: ["v_data_quality_summary"], queryFn: getDataQualitySummary, staleTime: FIVE_MIN });

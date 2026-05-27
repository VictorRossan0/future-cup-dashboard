export type Confederation = "CONMEBOL" | "UEFA" | "CONCACAF" | "AFC" | "CAF" | "OFC";

export type PlayerPosition = "Goleiro" | "Defensor" | "Meio-campista" | "Atacante";
export type PlayerStatus = "Titular provável" | "Reserva" | "Dúvida";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  age: number;
  height: number;
  weight: number;
  club: string;
  league: string;
  clubCountry: string;
  captain?: boolean;
  status: PlayerStatus;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
  confederation: Confederation;
  coach: string;
  ranking: number;
  formation?: string;
  players?: Player[];
  flag?: string;
}

export type StandingStatus = "advanced" | "thirdContender" | "eliminated" | "playing";

export interface Standing {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  status: StandingStatus;
}

export interface Group {
  letter: string;
  teams: Standing[];
}

export type MatchPhase =
  | "Fase de Grupos"
  | "16 avos"
  | "Oitavas"
  | "Quartas"
  | "Semifinal"
  | "Final";

export type MatchStatus = "Agendado" | "Encerrado" | "Ao vivo";

export interface Match {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  group: string;
  phase: MatchPhase;
  stadium: string;
  city: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
}

export interface Stadium {
  name: string;
  city: string;
  country: string;
}

export interface Competition {
  name: string;
  startDate: string;
  endDate: string;
  hosts: string[];
  teams: number;
  groups: number;
  matches: number;
  stadiums: number;
  newPhase: string;
}

export type AIName = "ChatGPT" | "Claude" | "Gemini";

export interface AISimulation {
  id: string;
  ai: AIName;
  champion: string;
  runnerUp: string;
  semifinalists: string[];
  topFive: string[];
  surprise: string;
  disappointment: string;
  topScorer: string;
  bestPlayer: string;
  bestYoungPlayer: string;
  groupOfDeath: string;
  darkHorses: string[];
  riskFactors: string[];
  rationale: string;
  confidence: number;
}

export interface AIConsensus {
  mostCitedChampion: string;
  mostCitedRunnerUp: string;
  commonFavorites: string[];
  mainDivergence: string;
  overallSummary: string;
}


export interface Tiebreaker {
  title: string;
  description: string;
}

export interface TechnologyItem {
  title: string;
  description: string;
}

export interface TournamentPhase {
  icon: string;
  title: string;
  text: string;
}

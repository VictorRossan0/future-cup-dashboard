import { teams } from "./teams";

export interface GroupStanding {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  status: "advanced" | "thirdContender" | "eliminated" | "playing";
}

const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Generate plausible standings
function makeStanding(teamId: string, idx: number): GroupStanding {
  const seeds = [
    { p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2 },
    { p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3 },
    { p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3 },
    { p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 7 },
  ];
  const s = seeds[idx];
  const points = s.w * 3 + s.d;
  return {
    teamId,
    played: s.p,
    wins: s.w,
    draws: s.d,
    losses: s.l,
    goalsFor: s.gf,
    goalsAgainst: s.ga,
    goalDiff: s.gf - s.ga,
    points,
    status: idx < 2 ? "advanced" : idx === 2 ? "thirdContender" : "eliminated",
  };
}

export const groups = groupLetters.map((letter) => {
  const groupTeams = teams.filter((t) => t.group === letter).slice(0, 4);
  return {
    letter,
    teams: groupTeams.map((t, i) => makeStanding(t.id, i)),
  };
});

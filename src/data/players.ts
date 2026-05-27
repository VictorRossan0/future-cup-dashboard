import type { Player, PlayerPosition } from "@/types";

export const positionsRoster: PlayerPosition[] = [
  "Goleiro", "Goleiro", "Goleiro",
  "Defensor", "Defensor", "Defensor", "Defensor", "Defensor", "Defensor", "Defensor",
  "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista",
  "Atacante", "Atacante", "Atacante", "Atacante", "Atacante", "Atacante",
];

export const positionList: PlayerPosition[] = [
  "Goleiro", "Defensor", "Meio-campista", "Atacante",
];

const sampleClubs = [
  { club: "FC Atlas", league: "La Liga", country: "Espanha" },
  { club: "Northside United", league: "Premier League", country: "Inglaterra" },
  { club: "Bayern Mitte", league: "Bundesliga", country: "Alemanha" },
  { club: "Olympique Sud", league: "Ligue 1", country: "França" },
  { club: "Internazionale Roma", league: "Serie A", country: "Itália" },
  { club: "Rio Atlético", league: "Brasileirão", country: "Brasil" },
  { club: "Buenos Stars", league: "Liga Profesional", country: "Argentina" },
  { club: "Lisboa SC", league: "Primeira Liga", country: "Portugal" },
];

export function makePlayers(teamId: string, teamName: string): Player[] {
  return positionsRoster.map((pos, i) => {
    const club = sampleClubs[i % sampleClubs.length];
    return {
      id: `${teamId}-${String(i + 1).padStart(2, "0")}`,
      name: `${teamName.split(" ")[0]} Player ${i + 1}`,
      number: i + 1,
      position: pos,
      age: 20 + ((i * 3) % 16),
      height: 1.7 + ((i % 20) / 100),
      weight: 68 + ((i * 2) % 18),
      club: club.club,
      league: club.league,
      clubCountry: club.country,
      captain: i === 9,
      status: i < 11 ? "Titular provável" : i < 18 ? "Reserva" : (i % 4 === 0 ? "Dúvida" : "Reserva"),
    };
  });
}

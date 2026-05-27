export type Confederation = "CONMEBOL" | "UEFA" | "CONCACAF" | "AFC" | "CAF" | "OFC";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: "Goleiro" | "Defensor" | "Meio-campista" | "Atacante";
  age: number;
  height: number;
  weight: number;
  club: string;
  league: string;
  clubCountry: string;
  captain?: boolean;
  status: "Titular provável" | "Reserva" | "Dúvida";
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
  flag?: string; // emoji
}

const positions: Player["position"][] = [
  "Goleiro", "Goleiro", "Goleiro",
  "Defensor", "Defensor", "Defensor", "Defensor", "Defensor", "Defensor", "Defensor",
  "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista", "Meio-campista",
  "Atacante", "Atacante", "Atacante", "Atacante", "Atacante", "Atacante",
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

function makePlayers(teamId: string, teamName: string): Player[] {
  return positions.map((pos, i) => {
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

const fullRoster = [
  { id: "bra", name: "Brasil", code: "BRA", group: "A", confederation: "CONMEBOL" as const, coach: "Dorival Júnior (fic.)", ranking: 5, formation: "4-2-3-1", flag: "🇧🇷" },
  { id: "arg", name: "Argentina", code: "ARG", group: "B", confederation: "CONMEBOL" as const, coach: "Lionel Scaloni (fic.)", ranking: 1, formation: "4-3-3", flag: "🇦🇷" },
  { id: "fra", name: "França", code: "FRA", group: "C", confederation: "UEFA" as const, coach: "Didier Deschamps (fic.)", ranking: 2, formation: "4-2-3-1", flag: "🇫🇷" },
  { id: "esp", name: "Espanha", code: "ESP", group: "D", confederation: "UEFA" as const, coach: "Luis de la Fuente (fic.)", ranking: 3, formation: "4-3-3", flag: "🇪🇸" },
  { id: "eng", name: "Inglaterra", code: "ENG", group: "E", confederation: "UEFA" as const, coach: "Thomas Tuchel (fic.)", ranking: 4, formation: "4-2-3-1", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "ger", name: "Alemanha", code: "GER", group: "F", confederation: "UEFA" as const, coach: "Julian Nagelsmann (fic.)", ranking: 6, formation: "4-3-3", flag: "🇩🇪" },
  { id: "por", name: "Portugal", code: "POR", group: "G", confederation: "UEFA" as const, coach: "Roberto Martínez (fic.)", ranking: 7, formation: "4-3-3", flag: "🇵🇹" },
  { id: "ned", name: "Países Baixos", code: "NED", group: "H", confederation: "UEFA" as const, coach: "Ronald Koeman (fic.)", ranking: 8, formation: "4-3-3", flag: "🇳🇱" },
];

const otherTeams: Omit<Team, "players">[] = [
  { id: "usa", name: "Estados Unidos", code: "USA", group: "A", confederation: "CONCACAF", coach: "Mauricio Pochettino (fic.)", ranking: 16, flag: "🇺🇸" },
  { id: "mex", name: "México", code: "MEX", group: "A", confederation: "CONCACAF", coach: "Javier Aguirre (fic.)", ranking: 18, flag: "🇲🇽" },
  { id: "can", name: "Canadá", code: "CAN", group: "B", confederation: "CONCACAF", coach: "Jesse Marsch (fic.)", ranking: 39, flag: "🇨🇦" },
  { id: "uru", name: "Uruguai", code: "URU", group: "C", confederation: "CONMEBOL", coach: "Marcelo Bielsa (fic.)", ranking: 11, flag: "🇺🇾" },
  { id: "col", name: "Colômbia", code: "COL", group: "D", confederation: "CONMEBOL", coach: "Néstor Lorenzo (fic.)", ranking: 12, flag: "🇨🇴" },
  { id: "bel", name: "Bélgica", code: "BEL", group: "B", confederation: "UEFA", coach: "Domenico Tedesco (fic.)", ranking: 9, flag: "🇧🇪" },
  { id: "cro", name: "Croácia", code: "CRO", group: "C", confederation: "UEFA", coach: "Zlatko Dalić (fic.)", ranking: 10, flag: "🇭🇷" },
  { id: "ita", name: "Itália", code: "ITA", group: "D", confederation: "UEFA", coach: "Luciano Spalletti (fic.)", ranking: 13, flag: "🇮🇹" },
  { id: "den", name: "Dinamarca", code: "DEN", group: "E", confederation: "UEFA", coach: "Kasper Hjulmand (fic.)", ranking: 19, flag: "🇩🇰" },
  { id: "sui", name: "Suíça", code: "SUI", group: "F", confederation: "UEFA", coach: "Murat Yakin (fic.)", ranking: 20, flag: "🇨🇭" },
  { id: "aut", name: "Áustria", code: "AUT", group: "G", confederation: "UEFA", coach: "Ralf Rangnick (fic.)", ranking: 22, flag: "🇦🇹" },
  { id: "tur", name: "Turquia", code: "TUR", group: "H", confederation: "UEFA", coach: "Vincenzo Montella (fic.)", ranking: 27, flag: "🇹🇷" },
  { id: "mar", name: "Marrocos", code: "MAR", group: "A", confederation: "CAF", coach: "Walid Regragui (fic.)", ranking: 14, flag: "🇲🇦" },
  { id: "sen", name: "Senegal", code: "SEN", group: "B", confederation: "CAF", coach: "Pape Thiaw (fic.)", ranking: 17, flag: "🇸🇳" },
  { id: "egy", name: "Egito", code: "EGY", group: "C", confederation: "CAF", coach: "Hossam Hassan (fic.)", ranking: 33, flag: "🇪🇬" },
  { id: "nga", name: "Nigéria", code: "NGA", group: "D", confederation: "CAF", coach: "Eric Chelle (fic.)", ranking: 35, flag: "🇳🇬" },
  { id: "civ", name: "Costa do Marfim", code: "CIV", group: "E", confederation: "CAF", coach: "Emerse Faé (fic.)", ranking: 37, flag: "🇨🇮" },
  { id: "rsa", name: "África do Sul", code: "RSA", group: "F", confederation: "CAF", coach: "Hugo Broos (fic.)", ranking: 56, flag: "🇿🇦" },
  { id: "alg", name: "Argélia", code: "ALG", group: "G", confederation: "CAF", coach: "Vladimir Petković (fic.)", ranking: 41, flag: "🇩🇿" },
  { id: "cmr", name: "Camarões", code: "CMR", group: "H", confederation: "CAF", coach: "Marc Brys (fic.)", ranking: 49, flag: "🇨🇲" },
  { id: "jpn", name: "Japão", code: "JPN", group: "I", confederation: "AFC", coach: "Hajime Moriyasu (fic.)", ranking: 15, flag: "🇯🇵" },
  { id: "kor", name: "Coreia do Sul", code: "KOR", group: "I", confederation: "AFC", coach: "Hong Myung-bo (fic.)", ranking: 23, flag: "🇰🇷" },
  { id: "irn", name: "Irã", code: "IRN", group: "I", confederation: "AFC", coach: "Amir Ghalenoei (fic.)", ranking: 21, flag: "🇮🇷" },
  { id: "aus", name: "Austrália", code: "AUS", group: "I", confederation: "AFC", coach: "Tony Popovic (fic.)", ranking: 25, flag: "🇦🇺" },
  { id: "ksa", name: "Arábia Saudita", code: "KSA", group: "J", confederation: "AFC", coach: "Hervé Renard (fic.)", ranking: 56, flag: "🇸🇦" },
  { id: "qat", name: "Catar", code: "QAT", group: "J", confederation: "AFC", coach: "Tintín Márquez (fic.)", ranking: 60, flag: "🇶🇦" },
  { id: "uzb", name: "Uzbequistão", code: "UZB", group: "J", confederation: "AFC", coach: "Timur Kapadze (fic.)", ranking: 62, flag: "🇺🇿" },
  { id: "irq", name: "Iraque", code: "IRQ", group: "J", confederation: "AFC", coach: "Graham Arnold (fic.)", ranking: 58, flag: "🇮🇶" },
  { id: "ecu", name: "Equador", code: "ECU", group: "E", confederation: "CONMEBOL", coach: "Sebastián Beccacece (fic.)", ranking: 24, flag: "🇪🇨" },
  { id: "par", name: "Paraguai", code: "PAR", group: "F", confederation: "CONMEBOL", coach: "Gustavo Alfaro (fic.)", ranking: 36, flag: "🇵🇾" },
  { id: "ven", name: "Venezuela", code: "VEN", group: "G", confederation: "CONMEBOL", coach: "Fernando Batista (fic.)", ranking: 38, flag: "🇻🇪" },
  { id: "cri", name: "Costa Rica", code: "CRI", group: "K", confederation: "CONCACAF", coach: "Miguel Herrera (fic.)", ranking: 45, flag: "🇨🇷" },
  { id: "pan", name: "Panamá", code: "PAN", group: "K", confederation: "CONCACAF", coach: "Thomas Christiansen (fic.)", ranking: 42, flag: "🇵🇦" },
  { id: "jam", name: "Jamaica", code: "JAM", group: "K", confederation: "CONCACAF", coach: "Steve McClaren (fic.)", ranking: 52, flag: "🇯🇲" },
  { id: "hon", name: "Honduras", code: "HON", group: "K", confederation: "CONCACAF", coach: "Reinaldo Rueda (fic.)", ranking: 75, flag: "🇭🇳" },
  { id: "pol", name: "Polônia", code: "POL", group: "L", confederation: "UEFA", coach: "Michał Probierz (fic.)", ranking: 28, flag: "🇵🇱" },
  { id: "sco", name: "Escócia", code: "SCO", group: "L", confederation: "UEFA", coach: "Steve Clarke (fic.)", ranking: 32, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "nzl", name: "Nova Zelândia", code: "NZL", group: "L", confederation: "OFC", coach: "Darren Bazeley (fic.)", ranking: 87, flag: "🇳🇿" },
  { id: "tun", name: "Tunísia", code: "TUN", group: "L", confederation: "CAF", coach: "Sami Trabelsi (fic.)", ranking: 51, flag: "🇹🇳" },
];

export const teams: Team[] = [
  ...fullRoster.map((t) => ({ ...t, players: makePlayers(t.id, t.name) })),
  ...otherTeams,
];

export function getTeam(id: string) {
  return teams.find((t) => t.id === id);
}

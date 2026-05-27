import type { Competition, Stadium, Confederation } from "@/types";

export const competition: Competition = {
  name: "Copa do Mundo FIFA 2026",
  startDate: "2026-06-11T17:00:00Z",
  endDate: "2026-07-19T20:00:00Z",
  hosts: ["Estados Unidos", "Canadá", "México"],
  teams: 48,
  groups: 12,
  matches: 104,
  stadiums: 16,
  newPhase: "Round of 32 (16 avos)",
};

export const stadiums: Stadium[] = [
  { name: "MetLife Stadium", city: "Nova York/Nova Jersey", country: "EUA" },
  { name: "SoFi Stadium", city: "Los Angeles", country: "EUA" },
  { name: "AT&T Stadium", city: "Dallas", country: "EUA" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", country: "EUA" },
  { name: "Estadio Azteca", city: "Cidade do México", country: "México" },
  { name: "Estadio Akron", city: "Guadalajara", country: "México" },
  { name: "Estadio BBVA", city: "Monterrey", country: "México" },
  { name: "BMO Field", city: "Toronto", country: "Canadá" },
  { name: "BC Place", city: "Vancouver", country: "Canadá" },
  { name: "Lincoln Financial Field", city: "Filadélfia", country: "EUA" },
  { name: "Hard Rock Stadium", city: "Miami", country: "EUA" },
  { name: "Levi's Stadium", city: "São Francisco", country: "EUA" },
];

export const groupLetters = [
  "A","B","C","D","E","F","G","H","I","J","K","L",
];

export const confederations: Confederation[] = [
  "CONMEBOL","UEFA","CONCACAF","AFC","CAF","OFC",
];

import type { Match } from "@/types";
import { groupLetters, stadiums } from "./competition";
import { teams } from "./teams";

const baseDate = new Date("2026-06-11T17:00:00Z");

function isoFromOffset(days: number, hour = 17): string {
  const d = new Date(baseDate);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const matches: Match[] = [];

groupLetters.forEach((letter, gi) => {
  const t = teams.filter((x) => x.group === letter).slice(0, 4);
  if (t.length < 4) return;
  const s1 = stadiums[gi % stadiums.length];
  const s2 = stadiums[(gi + 3) % stadiums.length];
  matches.push({
    id: `m-${letter}-1`,
    date: isoFromOffset(gi, 17),
    homeTeamId: t[0].id,
    awayTeamId: t[1].id,
    group: letter,
    phase: "Fase de Grupos",
    stadium: s1.name,
    city: s1.city,
    status: gi < 3 ? "Encerrado" : gi === 3 ? "Ao vivo" : "Agendado",
    homeScore: gi < 4 ? 2 : undefined,
    awayScore: gi < 4 ? 1 : undefined,
  });
  matches.push({
    id: `m-${letter}-2`,
    date: isoFromOffset(gi, 20),
    homeTeamId: t[2].id,
    awayTeamId: t[3].id,
    group: letter,
    phase: "Fase de Grupos",
    stadium: s2.name,
    city: s2.city,
    status: gi < 3 ? "Encerrado" : "Agendado",
    homeScore: gi < 3 ? 1 : undefined,
    awayScore: gi < 3 ? 1 : undefined,
  });
});

// Centralized flag URL resolver based on FIFA team codes.
// Frontend-only: maps FIFA codes -> ISO 3166-1 alpha-2 (or region codes for ENG/SCO).

export const TEAM_FLAG_MAP: Record<string, string> = {
  RSA: "za", KOR: "kr", MEX: "mx", CZE: "cz",
  BIH: "ba", CAN: "ca", QAT: "qa", SUI: "ch",
  BRA: "br", SCO: "gb-sct", HAI: "ht", MAR: "ma",
  AUS: "au", USA: "us", PAR: "py", TUR: "tr",
  GER: "de", CIV: "ci", CUW: "cw", ECU: "ec",
  NED: "nl", JPN: "jp", SWE: "se", TUN: "tn",
  BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz",
  KSA: "sa", CPV: "cv", ESP: "es", URU: "uy",
  FRA: "fr", IRQ: "iq", NOR: "no", SEN: "sn",
  ALG: "dz", ARG: "ar", AUT: "at", JOR: "jo",
  COL: "co", POR: "pt", COD: "cd", UZB: "uz",
  CRO: "hr", GHA: "gh", ENG: "gb-eng", PAN: "pa",
};

const FLAG_BASE = "https://hatscripts.github.io/circle-flags/flags";

export function getTeamFlagUrl(teamCode?: string | null): string | null {
  if (!teamCode) return null;
  const key = teamCode.trim().toUpperCase();
  const code = TEAM_FLAG_MAP[key];
  if (!code) return null;
  return `${FLAG_BASE}/${code}.svg`;
}

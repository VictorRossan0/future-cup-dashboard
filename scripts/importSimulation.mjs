#!/usr/bin/env node
/**
 * SimulationImporter — Copa 2026 Intelligence
 *
 * Lê um arquivo JSON no padrão das IAs e popula:
 *   - 1 registro em ai_simulations
 *   - N registros em match_predictions (1 por jogo do mata-mata, normalmente 32)
 *
 * Uso:
 *   COPA_SERVICE_ROLE_KEY=xxx node scripts/importSimulation.mjs [--dry-run] <arquivo.json> [...]
 *
 *   --dry-run | -n   Valida, faz lookup e simula inserções, SEM gravar nada.
 *
 * Mapeamento JSON -> DB (cobre TODO o mata-mata da Copa 2026):
 *   JSON match_number 1..32  →  DB matches.match_number 73..104  (offset fixo = +72)
 *     - Round of 32     : JSON  1..16  → DB  73..88
 *     - Round of 16     : JSON 17..24  → DB  89..96
 *     - Quarterfinals   : JSON 25..28  → DB  97..100
 *     - Semifinals      : JSON 29..30  → DB 101..102
 *     - Third Place     : JSON 31      → DB 103
 *     - Final           : JSON 32      → DB 104
 *
 * Idempotência (chave determinística):
 *   - ai_simulations:    (provider, generated_at)
 *   - match_predictions: (provider, model, match_id, generated_at)
 */

import fs from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vfzqxjexhsasakjmlhak.supabase.co";

const STAGE_OFFSET = 72;

export function phaseLabel(n) {
  if (!Number.isInteger(n)) return null;
  if (n >= 1  && n <= 16) return "round_of_32";
  if (n >= 17 && n <= 24) return "round_of_16";
  if (n >= 25 && n <= 28) return "quarterfinal";
  if (n >= 29 && n <= 30) return "semifinal";
  if (n === 31)           return "third_place";
  if (n === 32)           return "final";
  return null;
}

export function toDbMatchNumber(jsonNumber) {
  if (!phaseLabel(jsonNumber)) return null;
  return jsonNumber + STAGE_OFFSET;
}

export const PHASE_COUNTS = {
  round_of_32: 16,
  round_of_16: 8,
  quarterfinal: 4,
  semifinal: 2,
  third_place: 1,
  final: 1,
};

// --- normalization ----------------------------------------------------------
export const norm = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TEAM_ALIASES = {
  "republica democratica do congo": "rd congo",
  "rep dem congo": "rd congo",
  "estados unidos da america": "estados unidos",
  "eua": "estados unidos",
  "coreia do sul": "coreia do sul",
  "cabo verde": "cabo verde",
};

function lookupTeam(map, raw) {
  if (!raw) return null;
  const n = norm(raw);
  return map.get(n) || map.get(TEAM_ALIASES[n] || "") || null;
}

// --- validation -------------------------------------------------------------
export function validateJson(j) {
  const errs = [];
  if (!j || typeof j !== "object") {
    return ["JSON raiz inválido (esperado objeto)"];
  }
  if (!j.provider || typeof j.provider !== "string") errs.push("provider ausente ou não-string");
  if (!j.model || typeof j.model !== "string") errs.push("model ausente ou não-string");
  if (!j.generated_at || isNaN(Date.parse(j.generated_at))) errs.push("generated_at ausente ou inválido (esperado ISO 8601)");
  if (!Array.isArray(j.matches)) {
    errs.push("matches deve ser array");
    return errs;
  }
  if (j.matches.length !== 32) {
    errs.push(`matches deve ter 32 itens (recebido ${j.matches.length})`);
  }
  const seen = new Set();
  const phaseCount = {};
  j.matches.forEach((m, i) => {
    const n = m?.match_number;
    if (!Number.isInteger(n) || n < 1 || n > 32) {
      errs.push(`matches[${i}].match_number inválido (${n}); esperado inteiro 1..32`);
      return;
    }
    if (seen.has(n)) errs.push(`matches[${i}].match_number duplicado (${n})`);
    seen.add(n);
    const ph = phaseLabel(n);
    phaseCount[ph] = (phaseCount[ph] || 0) + 1;
    if (!m.predicted_winner) errs.push(`matches[${i}] (#${n}) sem predicted_winner`);
  });
  for (const [ph, expected] of Object.entries(PHASE_COUNTS)) {
    const got = phaseCount[ph] || 0;
    if (seen.size === 32 && got !== expected) {
      errs.push(`Fase ${ph}: esperado ${expected} jogo(s), encontrado ${got}`);
    }
  }
  return errs;
}

// --- HTTP -------------------------------------------------------------------
function makeHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function sb(key, pathSeg, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathSeg}`, {
    ...init,
    headers: { ...makeHeaders(key), ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function loadMappers(key) {
  const teams = await sb(key, "teams?select=id,name,code");
  const teamMap = new Map();
  for (const t of teams) {
    if (t.name) teamMap.set(norm(t.name), t.id);
    if (t.code) teamMap.set(norm(t.code), t.id);
  }
  const matches = await sb(key, "matches?select=id,match_number&match_number=gte.73&order=match_number");
  const matchMap = new Map(matches.map((m) => [m.match_number, m.id]));
  const comp = await sb(key, "competitions?select=id&limit=1");
  const competitionId = comp?.[0]?.id;
  if (!competitionId) throw new Error("Nenhuma competition encontrada.");
  return { teamMap, matchMap, competitionId };
}

function wrapName(v) { if (v == null) return null; return typeof v === "object" ? v : { team: v }; }
function wrapPlayer(v, t) { if (v == null) return null; return typeof v === "object" ? v : (t ? { player: v, team: t } : { player: v }); }

// --- core import ------------------------------------------------------------
export async function importFile(filePath, { dryRun = false, serviceKey } = {}) {
  const raw = fs.readFileSync(filePath, "utf8");
  const j = JSON.parse(raw);
  const errs = validateJson(j);
  if (errs.length) {
    throw new Error(`JSON inválido:\n  - ${errs.join("\n  - ")}`);
  }

  const report = {
    file: path.basename(filePath),
    dryRun,
    provider: j.provider,
    model: j.model,
    generated_at: j.generated_at,
    simulation: { action: null, id: null },
    matches: { inserted: 0, skipped_duplicate: 0, skipped_missing_match: 0, skipped_missing_team: 0, failed: 0, details: [] },
  };

  if (!serviceKey) throw new Error("COPA_SERVICE_ROLE_KEY ausente.");
  const { teamMap, matchMap, competitionId } = await loadMappers(serviceKey);
  const tp = j.tournament_predictions || {};

  // ai_simulations
  const dupSim = await sb(
    serviceKey,
    `ai_simulations?select=id&provider=eq.${encodeURIComponent(j.provider)}&generated_at=eq.${encodeURIComponent(j.generated_at)}`,
  );
  let simulationId;
  if (dupSim.length) {
    simulationId = dupSim[0].id;
    report.simulation = { action: "reused", id: simulationId };
  } else {
    const payload = {
      competition_id: competitionId,
      provider: j.provider,
      model: j.model,
      generated_at: j.generated_at,
      champion_prediction: wrapName(tp.champion),
      runner_up_prediction: wrapName(tp.runner_up),
      top_scorer_prediction: wrapPlayer(tp.top_scorer),
      best_player_prediction: wrapPlayer(tp.best_player),
      best_young_player_prediction: wrapPlayer(tp.best_young_player),
      surprise_team: wrapName(tp.surprise_team),
      disappointment_team: wrapName(tp.disappointment_team),
      analysis_summary: j.analysis_summary ?? tp.analysis_summary ?? null,
      confidence: typeof j.confidence === "number" ? j.confidence : null,
    };
    if (dryRun) {
      report.simulation = { action: "would_insert", id: null, payload };
    } else {
      const inserted = await sb(serviceKey, "ai_simulations", { method: "POST", body: JSON.stringify(payload) });
      simulationId = inserted[0].id;
      report.simulation = { action: "inserted", id: simulationId };
    }
  }

  // match_predictions
  for (const mp of j.matches) {
    const jsonNum = mp.match_number;
    const phase = phaseLabel(jsonNum);
    const dbNum = toDbMatchNumber(jsonNum);
    const matchId = matchMap.get(dbNum);
    if (!matchId) {
      report.matches.skipped_missing_match++;
      report.matches.details.push({ json: jsonNum, phase, status: "missing_match", db: dbNum });
      continue;
    }
    const winnerId = lookupTeam(teamMap, mp.predicted_winner);
    if (mp.predicted_winner && !winnerId) {
      report.matches.skipped_missing_team++;
      report.matches.details.push({ json: jsonNum, phase, status: "missing_team", team: mp.predicted_winner });
      // ainda assim grava a previsão (sem winner_id) — comportamento atual
    }

    const dq = await sb(
      serviceKey,
      `match_predictions?select=id&match_id=eq.${matchId}&provider=eq.${encodeURIComponent(j.provider)}&model=eq.${encodeURIComponent(j.model)}&generated_at=eq.${encodeURIComponent(j.generated_at)}`,
    );
    if (dq.length) {
      report.matches.skipped_duplicate++;
      report.matches.details.push({ json: jsonNum, phase, status: "duplicate", id: dq[0].id });
      continue;
    }

    const body = {
      match_id: matchId,
      provider: j.provider,
      model: j.model,
      predicted_winner_team_id: winnerId,
      predicted_home_score: mp.predicted_home_score ?? null,
      predicted_away_score: mp.predicted_away_score ?? null,
      confidence: typeof mp.confidence === "number" ? mp.confidence / (mp.confidence > 1 ? 100 : 1) : null,
      reasoning: mp.reasoning ?? null,
      generated_at: j.generated_at,
    };
    if (dryRun) {
      report.matches.inserted++;
      report.matches.details.push({ json: jsonNum, phase, status: "would_insert" });
      continue;
    }
    try {
      await sb(serviceKey, "match_predictions", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(body) });
      report.matches.inserted++;
      report.matches.details.push({ json: jsonNum, phase, status: "inserted" });
    } catch (e) {
      report.matches.failed++;
      report.matches.details.push({ json: jsonNum, phase, status: "failed", error: e.message });
    }
  }

  return report;
}

function printReport(r) {
  const tag = r.dryRun ? "[DRY-RUN]" : "[LIVE]";
  console.log(`\n${tag} ${r.file}`);
  console.log(`  provider=${r.provider} model=${r.model} generated_at=${r.generated_at}`);
  console.log(`  ai_simulations: ${r.simulation.action}${r.simulation.id ? ` (${r.simulation.id})` : ""}`);
  const m = r.matches;
  console.log(`  match_predictions: ${m.inserted} ${r.dryRun ? "a inserir" : "inseridas"}, ${m.skipped_duplicate} duplicadas, ${m.skipped_missing_match} sem match, ${m.skipped_missing_team} sem time, ${m.failed} falhas`);
  const probs = m.details.filter((d) => ["missing_match", "missing_team", "failed"].includes(d.status));
  if (probs.length) {
    console.log("  Avisos:");
    for (const p of probs) console.log(`    - JSON#${p.json} [${p.phase}] ${p.status}${p.team ? ` "${p.team}"` : ""}${p.error ? `: ${p.error}` : ""}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-n");
  const files = args.filter((a) => !a.startsWith("-"));
  if (!files.length) {
    console.error("Uso: node scripts/importSimulation.mjs [--dry-run] <arquivo.json> [...]");
    process.exit(1);
  }
  const serviceKey = process.env.COPA_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.error("ERRO: defina COPA_SERVICE_ROLE_KEY no ambiente.");
    process.exit(1);
  }
  let exitCode = 0;
  for (const f of files) {
    try {
      const r = await importFile(f, { dryRun, serviceKey });
      printReport(r);
    } catch (e) {
      exitCode = 1;
      console.error(`\n✗ ${f}\n${e.message}`);
    }
  }
  process.exit(exitCode);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) main();

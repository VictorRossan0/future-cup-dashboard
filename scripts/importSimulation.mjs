#!/usr/bin/env node
/**
 * SimulationImporter — Copa 2026 Intelligence
 *
 * Lê um arquivo JSON no padrão das IAs e popula:
 *   - 1 registro em ai_simulations
 *   - N registros em match_predictions (1 por jogo do mata-mata, normalmente 32)
 *
 * Uso:
 *   COPA_SERVICE_ROLE_KEY=xxx node scripts/importSimulation.mjs <arquivo.json> [arquivo2.json ...]
 *
 * Mapeamento JSON -> DB (cobre TODO o mata-mata da Copa 2026):
 *   JSON match_number 1..32  →  DB matches.match_number 73..104  (offset fixo = +72)
 *     - Round of 32     : JSON  1..16  → DB  73..88
 *     - Round of 16     : JSON 17..24  → DB  89..96
 *     - Quarterfinals   : JSON 25..28  → DB  97..100
 *     - Semifinals      : JSON 29..30  → DB 101..102
 *     - Third Place     : JSON 31      → DB 103
 *     - Final           : JSON 32      → DB 104
 *   - Nome da seleção  →  teams.id (lookup por name/code, com normalização de acentos)
 *
 * Idempotência:
 *   - Pula ai_simulations duplicadas por (provider, generated_at).
 *   - Pula match_predictions duplicadas por (provider, model, match_id, generated_at).
 *
 * Falhas pontuais (time não encontrado, match inexistente) NÃO interrompem a importação:
 * são logadas e o resto continua.
 */

import fs from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vfzqxjexhsasakjmlhak.supabase.co";
const SERVICE_KEY = process.env.COPA_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error("ERRO: defina COPA_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const STAGE_OFFSET = 72; // JSON 1..32 == DB 73..104 (cobre R32, R16, QF, SF, 3rd, Final)

// Rotula a fase a partir do match_number relativo (1..32) do JSON.
function phaseLabel(n) {
  if (n >= 1  && n <= 16) return "round_of_32";
  if (n >= 17 && n <= 24) return "round_of_16";
  if (n >= 25 && n <= 28) return "quarterfinal";
  if (n >= 29 && n <= 30) return "semifinal";
  if (n === 31)           return "third_place";
  if (n === 32)           return "final";
  return null;
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function sb(pathSeg, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathSeg}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

// --- normalization helpers ---------------------------------------------------
const norm = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Aliases conhecidos: nome usado pelas IAs -> nome canônico no banco
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

// --- importer ---------------------------------------------------------------
async function loadMappers() {
  const teams = await sb("teams?select=id,name,code");
  const teamMap = new Map();
  for (const t of teams) {
    if (t.name) teamMap.set(norm(t.name), t.id);
    if (t.code) teamMap.set(norm(t.code), t.id);
  }
  const matches = await sb("matches?select=id,match_number&match_number=gte.73&order=match_number");
  const matchMap = new Map(matches.map((m) => [m.match_number, m.id]));
  const comp = await sb("competitions?select=id&limit=1");
  const competitionId = comp?.[0]?.id;
  if (!competitionId) throw new Error("Nenhuma competition encontrada em competitions.");
  return { teamMap, matchMap, competitionId };
}

function validateJson(j) {
  const errs = [];
  if (!j.provider) errs.push("provider ausente");
  if (!j.model) errs.push("model ausente");
  if (!j.generated_at) errs.push("generated_at ausente");
  if (!Array.isArray(j.matches)) errs.push("matches deve ser array");
  return errs;
}

function wrapName(value) {
  // ai_simulations.* são jsonb; aceita string simples ou objeto.
  if (value == null) return null;
  if (typeof value === "object") return value;
  return { team: value };
}

function wrapPlayer(value, teamHint) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  return teamHint ? { player: value, team: teamHint } : { player: value };
}

async function importFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const j = JSON.parse(raw);
  const errs = validateJson(j);
  if (errs.length) throw new Error(`JSON inválido: ${errs.join(", ")}`);

  const { teamMap, matchMap, competitionId } = await loadMappers();
  const tp = j.tournament_predictions || {};

  // -- 1) ai_simulations (idempotente por provider+generated_at) ------------
  const dupCheck = await sb(
    `ai_simulations?select=id&provider=eq.${encodeURIComponent(j.provider)}&generated_at=eq.${encodeURIComponent(j.generated_at)}`
  );
  let simulationRow;
  if (dupCheck.length) {
    simulationRow = dupCheck[0];
    console.log(`  ↻ ai_simulation já existe (${simulationRow.id}), reusando.`);
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
    const inserted = await sb("ai_simulations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    simulationRow = inserted[0];
    console.log(`  ✓ ai_simulation criada (${simulationRow.id})`);
  }

  // -- 2) match_predictions -------------------------------------------------
  let ok = 0, skipped = 0;
  for (const mp of j.matches) {
    const jsonNum = mp.match_number ?? 0;
    const phase = phaseLabel(jsonNum);
    if (!phase) {
      console.warn(`  ⚠ JSON#${jsonNum} fora do intervalo 1..32, pulando`);
      skipped++;
      continue;
    }
    const dbNum = jsonNum + STAGE_OFFSET;
    const matchId = matchMap.get(dbNum);
    if (!matchId) {
      console.warn(`  ⚠ match JSON#${jsonNum} [${phase}] (DB#${dbNum}) não encontrado, pulando`);
      skipped++;
      continue;
    }
    const winnerId = lookupTeam(teamMap, mp.predicted_winner);
    if (mp.predicted_winner && !winnerId) {
      console.warn(`  ⚠ time vencedor "${mp.predicted_winner}" não encontrado em JSON#${mp.match_number}`);
    }

    // dedup por (provider, model, match_id, generated_at)
    const dq = await sb(
      `match_predictions?select=id&match_id=eq.${matchId}&provider=eq.${encodeURIComponent(j.provider)}&model=eq.${encodeURIComponent(j.model)}&generated_at=eq.${encodeURIComponent(j.generated_at)}`
    );
    if (dq.length) {
      skipped++;
      continue;
    }

    try {
      await sb("match_predictions", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          match_id: matchId,
          provider: j.provider,
          model: j.model,
          predicted_winner_team_id: winnerId,
          predicted_home_score: mp.predicted_home_score ?? null,
          predicted_away_score: mp.predicted_away_score ?? null,
          confidence: typeof mp.confidence === "number" ? mp.confidence / (mp.confidence > 1 ? 100 : 1) : null,
          reasoning: mp.reasoning ?? null,
          generated_at: j.generated_at,
        }),
      });
      ok++;
    } catch (e) {
      console.warn(`  ✗ falha JSON#${mp.match_number}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`  → match_predictions: ${ok} inseridas, ${skipped} puladas/falhas`);
  return { simulationId: simulationRow.id, ok, skipped };
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Uso: node scripts/importSimulation.mjs <arquivo.json> [...]");
    process.exit(1);
  }
  for (const f of files) {
    console.log(`\n▶ Importando ${path.basename(f)}`);
    try {
      await importFile(f);
    } catch (e) {
      console.error(`✗ ${f}: ${e.message}`);
    }
  }
  console.log("\nFim.");
}

main();

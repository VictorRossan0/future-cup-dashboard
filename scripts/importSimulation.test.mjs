#!/usr/bin/env node
/**
 * Testes do mapper e validador do SimulationImporter.
 * Execução: node scripts/importSimulation.test.mjs
 */
import assert from "node:assert/strict";
import { phaseLabel, toDbMatchNumber, validateJson, PHASE_COUNTS, norm } from "./importSimulation.mjs";

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); pass++; }
  catch (e) { console.error(`  ✗ ${name}\n    ${e.message}`); fail++; }
}

console.log("\nphaseLabel / toDbMatchNumber — cobertura 1..32");
const expectedPhases = [
  [1, 16,  "round_of_32",  73,  88],
  [17, 24, "round_of_16",  89,  96],
  [25, 28, "quarterfinal", 97, 100],
  [29, 30, "semifinal",   101, 102],
  [31, 31, "third_place", 103, 103],
  [32, 32, "final",       104, 104],
];
for (const [lo, hi, phase, dbLo, dbHi] of expectedPhases) {
  t(`fase ${phase}: JSON ${lo}..${hi} → DB ${dbLo}..${dbHi}`, () => {
    for (let n = lo; n <= hi; n++) {
      assert.equal(phaseLabel(n), phase, `phaseLabel(${n})`);
      assert.equal(toDbMatchNumber(n), n + 72, `toDbMatchNumber(${n})`);
    }
    assert.equal(toDbMatchNumber(lo), dbLo);
    assert.equal(toDbMatchNumber(hi), dbHi);
  });
}

t("fora do intervalo retorna null", () => {
  for (const n of [0, -1, 33, 100, 1.5, "1", null, undefined, NaN]) {
    assert.equal(phaseLabel(n), null, `phaseLabel(${n})`);
    assert.equal(toDbMatchNumber(n), null, `toDbMatchNumber(${n})`);
  }
});

t("contagens por fase somam 32", () => {
  const sum = Object.values(PHASE_COUNTS).reduce((a, b) => a + b, 0);
  assert.equal(sum, 32);
});

console.log("\nvalidateJson");
const baseMatches = Array.from({ length: 32 }, (_, i) => ({
  match_number: i + 1,
  predicted_winner: "Brasil",
}));
const baseJson = {
  provider: "openai",
  model: "gpt-5",
  generated_at: "2026-06-01T12:00:00Z",
  matches: baseMatches,
};

t("JSON válido não gera erros", () => {
  assert.deepEqual(validateJson(baseJson), []);
});

t("provider/model/generated_at faltando", () => {
  const errs = validateJson({ matches: baseMatches });
  assert.ok(errs.some((e) => e.includes("provider")));
  assert.ok(errs.some((e) => e.includes("model")));
  assert.ok(errs.some((e) => e.includes("generated_at")));
});

t("generated_at inválido", () => {
  const errs = validateJson({ ...baseJson, generated_at: "ontem" });
  assert.ok(errs.some((e) => e.includes("generated_at")));
});

t("matches não-array", () => {
  const errs = validateJson({ ...baseJson, matches: "x" });
  assert.ok(errs.some((e) => e.includes("array")));
});

t("matches com contagem errada", () => {
  const errs = validateJson({ ...baseJson, matches: baseMatches.slice(0, 30) });
  assert.ok(errs.some((e) => e.includes("32 itens")));
});

t("match_number duplicado", () => {
  const dup = baseMatches.map((m, i) => ({ ...m, match_number: i === 5 ? 1 : m.match_number }));
  const errs = validateJson({ ...baseJson, matches: dup });
  assert.ok(errs.some((e) => e.includes("duplicado")));
});

t("match_number fora do intervalo", () => {
  const bad = [...baseMatches];
  bad[0] = { ...bad[0], match_number: 99 };
  const errs = validateJson({ ...baseJson, matches: bad });
  assert.ok(errs.some((e) => e.includes("inválido")));
});

t("predicted_winner ausente", () => {
  const bad = baseMatches.map((m, i) => (i === 0 ? { match_number: 1 } : m));
  const errs = validateJson({ ...baseJson, matches: bad });
  assert.ok(errs.some((e) => e.includes("predicted_winner")));
});

console.log("\nnorm (normalização de nomes)");
t("remove acentos e caixa", () => {
  assert.equal(norm("São Paulo"), "sao paulo");
  assert.equal(norm("Côte d'Ivoire"), "cote d ivoire");
  assert.equal(norm("  RD-Congo  "), "rd congo");
});

console.log(`\nResultado: ${pass} ok, ${fail} falha(s)`);
process.exit(fail ? 1 : 0);

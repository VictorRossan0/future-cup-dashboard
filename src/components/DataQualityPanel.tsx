import { useDataQualitySummary } from "@/hooks/useCopa";
import { SourceBadge } from "@/components/DataState";
import { Database, AlertTriangle, CheckCircle2 } from "lucide-react";

// Expected coverage so we can show warnings when the base is incomplete.
const EXPECTED: Record<string, number> = {
  competitions: 1,
  groups: 12,
  teams: 48,
  coaches: 48,
  players: 1248,
  standings: 48,
  matches: 104,
  rules: 10,
  data_sources: 1,
  ai_simulations: 0,
};

const LABEL: Record<string, string> = {
  competitions: "Competições",
  groups: "Grupos",
  teams: "Seleções",
  coaches: "Técnicos",
  players: "Jogadores",
  standings: "Classificações",
  matches: "Jogos",
  rules: "Regras",
  data_sources: "Fontes de dados",
  ai_simulations: "Simulações IA",
};

interface RowState {
  label: string;
  total: number;
  expected: number;
  coverage: number; // 0–100
  warning?: string;
}

function evaluate(entity: string, total: number): RowState {
  const expected = EXPECTED[entity] ?? 0;
  const label = LABEL[entity] ?? entity;
  if (expected === 0) {
    return { label, total, expected, coverage: total > 0 ? 100 : 0 };
  }
  const coverage = Math.min(100, Math.round((total / expected) * 100));
  let warning: string | undefined;
  if (total === 0) warning = "Sem dados cadastrados";
  else if (total < expected) warning = `Faltam ${expected - total} registros para cobertura completa`;
  return { label, total, expected, coverage, warning };
}

export function DataQualityPanel() {
  const q = useDataQualitySummary();
  const rows = q.data?.data ?? [];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Database className="size-5 text-info" /> Qualidade dos dados
          </h2>
          <p className="text-xs text-muted-foreground">Cobertura atual das entidades importadas no banco.</p>
        </div>
        {q.data && <SourceBadge source={q.data.source} />}
      </div>

      {q.isLoading ? (
        <div className="h-32 animate-pulse rounded-lg bg-muted/30" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem informação de qualidade disponível.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {rows.map((r) => {
            const s = evaluate(r.entity, Number(r.total) || 0);
            const ok = !s.warning;
            return (
              <div
                key={r.entity}
                className="rounded-xl border border-border bg-background/40 p-3 flex flex-col gap-1.5"
                title={s.warning ?? "Cobertura completa"}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{s.label}</span>
                  {ok ? (
                    <CheckCircle2 className="size-3.5 text-success" />
                  ) : (
                    <AlertTriangle className="size-3.5 text-warning" />
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold tabular-nums">{s.total}</span>
                  {s.expected > 0 && <span className="text-xs text-muted-foreground">/ {s.expected}</span>}
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`h-full ${ok ? "bg-success" : s.total === 0 ? "bg-destructive" : "bg-warning"}`}
                    style={{ width: `${s.coverage}%` }}
                  />
                </div>
                {s.warning && <p className="text-[10px] text-warning leading-tight">{s.warning}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

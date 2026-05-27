import type { AISimulation } from "@/types";
import { aiAccentClasses } from "@/data/aiSimulations";

function Row({ label, value, accent }: { label: string; value: string; accent?: "gold" | "info" }) {
  const cls = accent === "gold" ? "text-gold font-semibold" : accent === "info" ? "text-info font-semibold" : "";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}

export function AISimulationCard({ simulation }: { simulation: AISimulation }) {
  const s = simulation;
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${aiAccentClasses[s.ai]} p-5 backdrop-blur`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">{s.ai}</h3>
        <span className="text-[10px] uppercase tracking-widest bg-card/60 px-2 py-1 rounded-full">
          Confiança {s.confidence}%
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Campeã" value={s.champion} accent="gold" />
        <Row label="Vice" value={s.runnerUp} />
        <Row label="Artilheiro" value={s.topScorer} />
        <Row label="Surpresa" value={s.surprise} accent="info" />
        <Row label="Decepção" value={s.disappointment} />
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Top 5</div>
        <div className="flex flex-wrap gap-1.5">
          {s.topFive.map((t, i) => (
            <span key={t} className="text-xs bg-card border border-border rounded-full px-2 py-0.5">
              {i + 1}. {t}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground leading-relaxed italic">"{s.rationale}"</p>
    </div>
  );
}

import type { AISimulation } from "@/types";
import { aiAccentClasses } from "@/data/aiSimulations";

function Row({ label, value, accent }: { label: string; value: string; accent?: "gold" | "info" }) {
  const cls = accent === "gold" ? "text-gold font-semibold" : accent === "info" ? "text-info font-semibold" : "";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`text-right ${cls}`}>{value}</span>
    </div>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className="text-xs bg-card border border-border rounded-full px-2 py-0.5">
            {label === "Top 5" ? `${i + 1}. ${t}` : t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AISimulationCard({ simulation }: { simulation: AISimulation }) {
  const s = simulation;
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${aiAccentClasses[s.ai]} p-5 backdrop-blur flex flex-col`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">{s.ai}</h3>
        <span className="text-[10px] uppercase tracking-widest bg-card/60 px-2 py-1 rounded-full">
          Confiança {s.confidence}%
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <Row label="Campeã" value={s.champion} accent="gold" />
        <Row label="Vice" value={s.runnerUp} />
        <Row label="Surpresa" value={s.surprise} accent="info" />
        <Row label="Decepção" value={s.disappointment} />
        <Row label="Grupo da morte" value={s.groupOfDeath} />
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
        <ChipList label="Semifinalistas" items={s.semifinalists} />
        <ChipList label="Top 5" items={s.topFive} />
        <ChipList label="Dark horses" items={s.darkHorses} />
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-1 gap-2 text-xs">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Artilheiro provável</div>
          <div>{s.topScorer}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Melhor jogador</div>
          <div>{s.bestPlayer}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Melhor jovem</div>
          <div>{s.bestYoungPlayer}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Fatores de risco</div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          {s.riskFactors.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <p className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground leading-relaxed italic">
        "{s.rationale}"
      </p>
    </div>
  );
}

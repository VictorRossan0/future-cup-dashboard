import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { aiSimulations, aiConsensus } from "@/data/aiSimulations";
import { Brain, Trophy, Target, AlertTriangle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/simulacoes")({
  head: () => ({
    meta: [
      { title: "Simulações de IA · Copa 2026 Data Hub" },
      { name: "description", content: "Comparativo fictício de previsões para a Copa 2026 entre ChatGPT, Claude e Gemini com tabela e consenso." },
    ],
  }),
  component: SimulacoesPage,
});

const aiColors: Record<string, string> = {
  ChatGPT: "from-primary/30 to-primary/5 border-primary/40",
  Claude: "from-gold/30 to-gold/5 border-gold/40",
  Gemini: "from-info/30 to-info/5 border-info/40",
};

function SimulacoesPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <header>
          <div className="text-[10px] uppercase tracking-widest text-gold">Previsões fictícias</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1 flex items-center gap-2">
            <Brain className="size-8 text-primary" /> Simulações de IA
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Comparativo entre ChatGPT, Claude e Gemini com previsões simuladas. Estrutura preparada para consumir dados reais de um backend no futuro.
          </p>
        </header>

        {/* AI Cards */}
        <section className="grid lg:grid-cols-3 gap-4">
          {aiSimulations.map((s) => (
            <div key={s.id} className={`rounded-2xl border bg-gradient-to-br ${aiColors[s.ai]} p-5 backdrop-blur`}>
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
          ))}
        </section>

        {/* Comparison table */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Tabela comparativa</h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/40">
                  <tr>
                    <th className="text-left px-4 py-3">Critério</th>
                    {aiSimulations.map((s) => (
                      <th key={s.id} className="text-left px-4 py-3">{s.ai}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Campeã", "champion"],
                    ["Vice", "runnerUp"],
                    ["Artilheiro", "topScorer"],
                    ["Surpresa", "surprise"],
                    ["Decepção", "disappointment"],
                    ["Confiança", "confidence"],
                  ].map(([label, key]) => (
                    <tr key={key} className="border-t border-border">
                      <td className="px-4 py-3 text-muted-foreground">{label}</td>
                      {aiSimulations.map((s) => (
                        <td key={s.id} className="px-4 py-3">
                          {key === "confidence" ? `${s.confidence}%` : (s as unknown as Record<string, string>)[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Consensus */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="size-5 text-gold" /> Consenso das IAs
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ConsensusCard icon={Trophy} label="Mais citada como campeã" value={aiConsensus.mostCitedChampion} variant="gold" />
            <ConsensusCard icon={Target} label="Jogador mais citado" value={aiConsensus.mostCitedPlayer} variant="green" />
            <ConsensusCard icon={AlertTriangle} label="Grupo mais difícil" value={aiConsensus.toughestGroup} variant="info" />
            <ConsensusCard icon={Sparkles} label="Possível zebra" value={aiConsensus.potentialUnderdog} variant="gold" />
          </div>
        </section>

        <p className="text-xs text-center text-muted-foreground">
          Dados simulados para protótipo. Nenhuma chamada real a APIs de IA é feita no frontend.
        </p>
      </div>
    </AppLayout>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "gold" | "info" }) {
  const cls = accent === "gold" ? "text-gold font-semibold" : accent === "info" ? "text-info font-semibold" : "";
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}

function ConsensusCard({ icon: Icon, label, value, variant }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; variant: "gold" | "green" | "info" }) {
  const bg = { gold: "bg-gradient-gold text-gold-foreground", green: "bg-gradient-green text-primary-foreground", info: "bg-info/20 text-info" }[variant];
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={`size-9 rounded-xl grid place-items-center ${bg}`}>
        <Icon className="size-4" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="font-display font-bold mt-1">{value}</div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AISimulationCard } from "@/components/AISimulationCard";
import { aiSimulations, aiConsensus, aiDisclaimer } from "@/data/aiSimulations";
import { Brain, Trophy, Medal, Users, GitCompare, Sparkles, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/simulacoes")({
  head: () => ({
    meta: [
      { title: "Simulações de IA · Copa 2026 Data Hub" },
      { name: "description", content: "Comparativo fictício de previsões para a Copa 2026 entre ChatGPT, Claude e Gemini com tabela e consenso." },
    ],
  }),
  component: SimulacoesPage,
});

const comparisonRows: Array<{ label: string; key: keyof typeof aiSimulations[number] }> = [
  { label: "Campeã", key: "champion" },
  { label: "Vice", key: "runnerUp" },
  { label: "Artilheiro", key: "topScorer" },
  { label: "Melhor jogador", key: "bestPlayer" },
  { label: "Melhor jovem", key: "bestYoungPlayer" },
  { label: "Surpresa", key: "surprise" },
  { label: "Decepção", key: "disappointment" },
  { label: "Grupo da morte", key: "groupOfDeath" },
  { label: "Confiança", key: "confidence" },
];

function SimulacoesPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <PageHeader
          kicker="Previsões fictícias"
          title={
            <span className="flex items-center gap-2">
              <Brain className="size-8 text-primary" /> Simulações de IA
            </span>
          }
          description="Comparativo entre ChatGPT, Claude e Gemini com previsões simuladas. Estrutura preparada para consumir dados reais (JSON) no futuro — sem nenhuma chamada a APIs."
        />

        {/* Disclaimer */}
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{aiDisclaimer}</p>
        </div>

        <section className="grid lg:grid-cols-3 gap-4">
          {aiSimulations.map((s) => <AISimulationCard key={s.id} simulation={s} />)}
        </section>

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
                  {comparisonRows.map((row) => (
                    <tr key={row.key} className="border-t border-border">
                      <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                      {aiSimulations.map((s) => (
                        <td key={s.id} className="px-4 py-3">
                          {row.key === "confidence" ? `${s.confidence}%` : String(s[row.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Consenso */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="size-5 text-gold" /> Consenso das IAs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConsensusCard icon={Trophy} label="Campeão mais citado" value={aiConsensus.mostCitedChampion} variant="gold" />
            <ConsensusCard icon={Medal} label="Vice mais citado" value={aiConsensus.mostCitedRunnerUp} variant="green" />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <h3 className="font-semibold">Favoritos em comum</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {aiConsensus.commonFavorites.map((f) => (
                <span key={f} className="text-xs bg-secondary border border-border rounded-full px-3 py-1">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <GitCompare className="size-4 text-info" />
              <h3 className="font-semibold">Principal divergência</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{aiConsensus.mainDivergence}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent p-5">
            <div className="text-[10px] uppercase tracking-widest text-gold mb-1">Resumo geral</div>
            <p className="text-sm leading-relaxed">{aiConsensus.overallSummary}</p>
          </div>
        </section>

        <p className="text-xs text-center text-muted-foreground">
          Dados 100% mockados em <code className="text-foreground/70">/src/data/aiSimulations.ts</code>. Nenhuma integração com OpenAI, Anthropic ou Google é executada.
        </p>
      </div>
    </AppLayout>
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

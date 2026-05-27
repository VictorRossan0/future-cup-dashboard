import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AISimulationCard } from "@/components/AISimulationCard";
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

const comparisonRows: Array<{ label: string; key: keyof typeof aiSimulations[number] }> = [
  { label: "Campeã", key: "champion" },
  { label: "Vice", key: "runnerUp" },
  { label: "Artilheiro", key: "topScorer" },
  { label: "Surpresa", key: "surprise" },
  { label: "Decepção", key: "disappointment" },
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
          description="Comparativo entre ChatGPT, Claude e Gemini com previsões simuladas. Estrutura preparada para consumir dados reais de um backend no futuro."
        />

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

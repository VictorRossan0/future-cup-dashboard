import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Brain, Sparkles } from "lucide-react";

export const Route = createFileRoute("/simulacoes")({
  head: () => ({
    meta: [
      { title: "Simulações de IA · Copa 2026 Data Hub" },
      { name: "description", content: "Em breve: simulações com IA baseadas nos elencos oficiais, técnicos, grupos e contexto estatístico." },
    ],
  }),
  component: SimulacoesPage,
});

function SimulacoesPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
        <PageHeader
          kicker="Em breve"
          title="Simulações com IA"
          description="Estamos preparando esta seção."
        />

        <div className="rounded-2xl border border-border bg-card p-10">
          <div className="size-14 mx-auto rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground">
            <Brain className="size-7" />
          </div>
          <h2 className="font-display text-2xl font-bold mt-4">Em breve</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Simulações com IA serão adicionadas em breve com base nos elencos oficiais, técnicos, grupos e contexto estatístico da competição.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs">
            <Sparkles className="size-3.5 text-gold" /> Fonte: v_ai_simulation_context (preparada)
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { tiebreakers, technology, tournamentPhases, bracketSummary } from "@/data/rules";
import { Trophy, Medal, Flame, Target, Shield, Tv } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/regras")({
  head: () => ({
    meta: [
      { title: "Regras e Formato · Copa 2026 Data Hub" },
      { name: "description", content: "Como funciona a fase de grupos, o Round of 32, melhores terceiros, critérios de desempate, VAR e impedimento semiautomático." },
    ],
  }),
  component: RegrasPage,
});

const phaseIcons: Record<string, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  flame: Flame,
  target: Target,
};

function RegrasPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <PageHeader
          kicker="Regulamento"
          title="Regras e Formato"
          description="Resumo do novo formato com 48 seleções e da fase de 16 avos. Os dados devem ser revisados conforme comunicações oficiais."
        />

        <section>
          <h2 className="font-display text-xl font-bold mb-4">Caminho até a final</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tournamentPhases.map((p) => {
              const Icon = phaseIcons[p.icon] ?? Trophy;
              return (
                <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="size-10 rounded-xl bg-gradient-gold grid place-items-center text-gold-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display font-bold mt-3">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Bracket completo:</strong> {bracketSummary}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-4">Critérios de Desempate</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiebreakers.map((t, i) => (
              <div key={t.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <span className="size-7 rounded-lg bg-primary/15 text-primary grid place-items-center text-xs font-bold tabular-nums">{i + 1}</span>
                  <h3 className="font-semibold">{t.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Tv className="size-5 text-info" /> Arbitragem e Tecnologia
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {technology.map((t) => (
              <div key={t.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-info" />
                  <h3 className="font-semibold">{t.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{t.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

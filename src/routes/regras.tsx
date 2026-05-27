import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { tiebreakers, technology } from "@/data/rules";
import { Trophy, Medal, Flame, Target, Shield, Tv } from "lucide-react";

export const Route = createFileRoute("/regras")({
  head: () => ({
    meta: [
      { title: "Regras e Formato · Copa 2026 Data Hub" },
      { name: "description", content: "Como funciona a fase de grupos, o Round of 32, melhores terceiros, critérios de desempate, VAR e impedimento semiautomático." },
    ],
  }),
  component: RegrasPage,
});

const phases = [
  { icon: Trophy, title: "Fase de Grupos", text: "12 grupos com 4 seleções. Cada equipe joga 3 partidas. Os 2 primeiros de cada grupo avançam." },
  { icon: Medal, title: "Melhores Terceiros", text: "Os 8 melhores colocados na terceira posição também avançam, totalizando 32 classificados." },
  { icon: Flame, title: "16 avos de Final", text: "Nova fase eliminatória do formato 2026: 32 seleções em mata-mata direto." },
  { icon: Target, title: "Oitavas → Final", text: "Após 16 avos: oitavas (16), quartas (8), semifinais (4) e final entre os 2 finalistas." },
];

function RegrasPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <header>
          <div className="text-[10px] uppercase tracking-widest text-gold">Regulamento</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">Regras e Formato</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Resumo do novo formato com 48 seleções e da fase de 16 avos. Os dados devem ser revisados conforme comunicações oficiais.
          </p>
        </header>

        {/* Phases */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Caminho até a final</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="size-10 rounded-xl bg-gradient-gold grid place-items-center text-gold-foreground">
                  <p.icon className="size-5" />
                </div>
                <h3 className="font-display font-bold mt-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Bracket completo:</strong> Fase de Grupos → 16 avos (32) → Oitavas (16) → Quartas (8) → Semifinal (4) → Final (2). Total de 104 jogos.
          </div>
        </section>

        {/* Tiebreakers */}
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

        {/* Technology */}
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

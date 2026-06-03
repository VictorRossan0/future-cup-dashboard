import type { VRulesOrdered } from "@/types/views";
import { Users, Layers, Trophy, ListChecks } from "lucide-react";

interface Props {
  rules: VRulesOrdered[];
}

const HIGHLIGHT = [
  { category: "format",         icon: Users,      tone: "text-success" },
  { category: "group_stage",    icon: Layers,     tone: "text-info" },
  { category: "classification", icon: ListChecks, tone: "text-gold" },
  { category: "knockout",       icon: Trophy,     tone: "text-primary" },
] as const;

export function FormatOverview({ rules }: Props) {
  // Pick the first rule per highlighted category.
  const picked = HIGHLIGHT.map((h) => {
    const r = rules.find((x) => x.category === h.category);
    return r ? { ...h, rule: r } : null;
  }).filter(Boolean) as Array<{ category: string; icon: typeof Users; tone: string; rule: VRulesOrdered }>;

  if (picked.length === 0) return null;

  return (
    <section
      aria-label="Como funciona a Copa 2026"
      className="rounded-2xl border border-border bg-gradient-hero p-6 sm:p-8 space-y-6"
    >
      <div>
        <div className="text-[10px] uppercase tracking-widest text-gold">Visão geral</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">
          Como funciona a Copa 2026
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
          48 seleções, 12 grupos de 4, fase de grupos seguida por mata-mata começando nos 32 avos.
          Os pontos-chave abaixo vêm direto de <code className="text-xs">v_rules_ordered</code>.
        </p>
      </div>

      {/* Fluxo visual: Grupos → 32 avos → 16 → 8 → 4 → Final */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { l: "12 grupos", s: "48 seleções" },
          { l: "32 avos", s: "32 equipes" },
          { l: "Oitavas", s: "16" },
          { l: "Quartas", s: "8" },
          { l: "Semis", s: "4" },
          { l: "Final", s: "Campeão" },
        ].map((step, i, arr) => (
          <div key={step.l} className="flex items-center gap-1.5 shrink-0">
            <div className="rounded-lg border border-border bg-card/60 px-3 py-2 text-center min-w-[88px]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{step.s}</div>
              <div className="text-sm font-semibold">{step.l}</div>
            </div>
            {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {picked.map(({ category, icon: Icon, tone, rule }) => (
          <article
            key={category}
            className="rounded-xl border border-border bg-card/70 p-4"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`size-4 ${tone}`} />
              <h3 className="font-semibold text-sm">{rule.title ?? category}</h3>
            </div>
            {rule.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

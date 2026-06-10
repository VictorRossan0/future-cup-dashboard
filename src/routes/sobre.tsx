import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Brain, Users, RefreshCcw, Info } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · Copa 2026 Intelligence" },
      { name: "description", content: "Plataforma independente que acompanha, compara e analisa previsões da Copa do Mundo FIFA 2026 com múltiplas Inteligências Artificiais." },
      { property: "og:title", content: "Sobre · Copa 2026 Intelligence" },
      { property: "og:description", content: "Plataforma independente de análise da Copa do Mundo FIFA 2026 com IA." },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

const cards = [
  { icon: Database, title: "Dados", desc: "Base completa com 48 seleções, elencos e estatísticas oficiais." },
  { icon: Brain, title: "Simulações", desc: "Previsões coletadas dos principais modelos de IA do mercado." },
  { icon: Users, title: "Consenso", desc: "Agregação automática das previsões para destacar os favoritos." },
  { icon: RefreshCcw, title: "Automação", desc: "Atualização contínua de resultados e validação multi-fonte." },
];

const ias = ["ChatGPT", "Gemini", "Claude", "DeepSeek", "Mistral", "Copilot", "Grok", "EA Sports"];

function SobrePage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <header className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-2">
            <Info className="size-3" /> Sobre a plataforma
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Copa 2026 Intelligence</h1>
          <p className="text-muted-foreground mt-4">
            Plataforma independente criada para acompanhar, comparar e analisar previsões da
            Copa do Mundo FIFA 2026 utilizando múltiplas Inteligências Artificiais.
          </p>
        </header>

        <section>
          <h2 className="font-display text-2xl font-bold mb-4">Modelos analisados</h2>
          <div className="flex flex-wrap gap-2">
            {ias.map((n) => (
              <span key={n} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                {n}
              </span>
            ))}
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.title} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="size-10 rounded-xl bg-gradient-green grid place-items-center text-primary-foreground shadow-glow mb-2">
                  <c.icon className="size-5" />
                </div>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold mb-2">O que a plataforma reúne</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Dashboard estatístico com seleções, grupos e jogos.</li>
            <li>Base completa de jogadores convocados.</li>
            <li>Ranking comparativo das IAs.</li>
            <li>Consenso entre os modelos para campeão, vice, artilheiro e melhor jogador.</li>
            <li>Atualização automática dos resultados durante a competição.</li>
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}

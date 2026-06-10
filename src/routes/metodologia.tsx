import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Brain, Users, BarChart3, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia · Copa 2026 Intelligence" },
      { name: "description", content: "Como as previsões da Copa 2026 Intelligence são coletadas, calculadas e atualizadas." },
      { property: "og:title", content: "Metodologia · Copa 2026 Intelligence" },
      { property: "og:description", content: "Coleta, consenso, ranking e atualização das previsões de IA para a Copa 2026." },
    ],
    links: [{ rel: "canonical", href: "/metodologia" }],
  }),
  component: MetodologiaPage,
});

const sections = [
  {
    icon: Brain,
    title: "Coleta das Simulações",
    body: "Cada IA realiza sua própria previsão de campeão, vice, artilheiro, melhor jogador e maior surpresa. As respostas são padronizadas e armazenadas em um formato comum.",
  },
  {
    icon: Users,
    title: "Consenso",
    body: "O consenso é calculado a partir da frequência das previsões entre os modelos: campeão mais citado, vice mais citado, artilheiro mais citado e melhor jogador mais citado.",
  },
  {
    icon: BarChart3,
    title: "Ranking",
    body: "O ranking expõe lado a lado as escolhas individuais de cada modelo, incluindo o nível de confiança declarado, permitindo comparação direta entre as previsões.",
  },
  {
    icon: RefreshCcw,
    title: "Atualização dos Resultados",
    body: "Os jogos são atualizados automaticamente através de validação multi-fonte, garantindo que cada placar reflita o resultado oficial assim que disponível.",
  },
];

function MetodologiaPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <header className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-2">
            <FlaskConical className="size-3" /> Metodologia
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Como calculamos</h1>
          <p className="text-muted-foreground mt-4">
            Transparência total sobre como as previsões são coletadas, agregadas e atualizadas.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((s, i) => (
            <Card key={s.title} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-gold grid place-items-center text-gold-foreground">
                    <s.icon className="size-5" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Etapa {i + 1}
                  </div>
                </div>
                <CardTitle className="mt-2">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

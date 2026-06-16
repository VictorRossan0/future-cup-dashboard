import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Crown,
  Clock,
  Trophy,
  Medal,
  Award,
  Target,
  TrendingUp,
  Flame,
  Star,
  Goal,
  ListChecks,
  LineChart,
  Sparkles,
  CircleDashed,
} from "lucide-react";

export const Route = createFileRoute("/hall-da-fama")({
  head: () => ({
    meta: [
      { title: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      {
        name: "description",
        content:
          "Acompanhamento da performance real das Inteligências Artificiais participantes do Copa 2026 Intelligence durante a Copa do Mundo FIFA 2026.",
      },
      { property: "og:title", content: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      {
        property: "og:description",
        content:
          "Ranking de precisão, pódio e conquistas das IAs durante a Copa do Mundo FIFA 2026.",
      },
    ],
    links: [{ rel: "canonical", href: "/hall-da-fama" }],
  }),
  component: HallDaFamaPage,
});

const IAS = [
  { name: "ChatGPT", initials: "GP", tone: "from-emerald-500/30 to-emerald-500/5" },
  { name: "Gemini", initials: "GM", tone: "from-sky-500/30 to-sky-500/5" },
  { name: "Claude", initials: "CL", tone: "from-amber-500/30 to-amber-500/5" },
  { name: "DeepSeek", initials: "DS", tone: "from-violet-500/30 to-violet-500/5" },
  { name: "Mistral", initials: "MS", tone: "from-rose-500/30 to-rose-500/5" },
  { name: "Copilot", initials: "CP", tone: "from-cyan-500/30 to-cyan-500/5" },
];

const CRITERIA = [
  {
    icon: Trophy,
    title: "Campeão Previsto",
    text: "Pontuação máxima para quem acertar o campeão da Copa.",
  },
  {
    icon: Medal,
    title: "Vice-Campeão",
    text: "Pontos para a previsão correta do finalista vencido.",
  },
  {
    icon: Star,
    title: "Melhor Jogador",
    text: "Pontuação para acerto do destaque individual da competição.",
  },
  {
    icon: Goal,
    title: "Artilheiro",
    text: "Pontuação para previsão correta do maior goleador.",
  },
  {
    icon: ListChecks,
    title: "Classificação Geral",
    text: "Pontuação acumulada por acertos ao longo de todas as fases.",
  },
];

const ACHIEVEMENTS = [
  { icon: Target, title: "Maior Precisão", text: "IA com o melhor índice de acerto geral." },
  { icon: Flame, title: "Maior Sequência de Acertos", text: "Maior série consecutiva de previsões corretas." },
  { icon: Trophy, title: "Melhor Campeão Previsto", text: "Quem cravou o campeão com maior antecedência." },
  { icon: Goal, title: "Melhor Artilheiro Previsto", text: "Acerto mais preciso do goleador da Copa." },
  { icon: TrendingUp, title: "Maior Evolução", text: "IA que mais evoluiu ao longo da competição." },
];

function HallDaFamaPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-background to-background p-6 sm:p-12">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-4">
              <Crown className="size-3" /> Hall da Fama
            </div>
            <div className="flex items-start gap-4 mb-5">
              <div className="size-14 sm:size-16 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant shrink-0">
                <Trophy className="size-7 sm:size-8" />
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
                Hall da Fama das Inteligências Artificiais
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Durante a Copa do Mundo FIFA 2026, esta página acompanhará o desempenho real
              de cada Inteligência Artificial participante do Copa 2026 Intelligence.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/90 mt-3 leading-relaxed">
              As previsões realizadas antes do início da competição serão comparadas com os
              resultados oficiais da Copa para identificar quais modelos apresentaram maior
              precisão.
            </p>
          </div>
        </section>

        {/* STATUS */}
        <Card className="border-dashed border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
          <CardContent className="py-6 sm:py-8 grid grid-cols-[auto_minmax(0,1fr)] gap-4 sm:gap-6 items-center">
            <div className="size-12 sm:size-14 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant shrink-0">
              <Clock className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Status da competição
                </span>
                <Badge className="bg-gold text-gold-foreground hover:bg-gold/90 border-0">
                  Aguardando início da Copa
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As avaliações serão iniciadas automaticamente após os primeiros resultados
                oficiais da Copa do Mundo FIFA 2026.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PÓDIO */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Pódio"
            title="Pódio das IAs"
            subtitle="Os três modelos mais precisos da Copa serão exibidos aqui."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-end">
            <PodiumCard place={2} icon="🥈" label="2º Lugar" height="md:h-56" tone="from-zinc-300/30 to-zinc-300/5" />
            <PodiumCard place={1} icon="🥇" label="1º Lugar" height="md:h-72" tone="from-gold/40 to-gold/5" featured />
            <PodiumCard place={3} icon="🥉" label="3º Lugar" height="md:h-48" tone="from-amber-700/30 to-amber-700/5" />
          </div>
        </section>

        {/* RANKING DE PRECISÃO */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Ranking"
            title="Ranking de Precisão"
            subtitle="Estrutura pronta para receber os dados em tempo real durante a Copa."
          />

          {/* Desktop — tabela */}
          <div className="hidden md:block rounded-2xl border border-border overflow-x-auto bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Posição</TableHead>
                  <TableHead>IA</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Acertos</TableHead>
                  <TableHead>Erros</TableHead>
                  <TableHead>Precisão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IAS.map((ia) => (
                  <TableRow key={ia.name}>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-9 rounded-xl grid place-items-center bg-gradient-to-br ${ia.tone} border border-border text-xs font-bold shrink-0`}
                        >
                          {ia.initials}
                        </div>
                        <span className="font-medium truncate">{ia.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                        <CircleDashed className="size-3" /> Aguardando
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile — cards */}
          <div className="md:hidden grid gap-3">
            {IAS.map((ia) => (
              <Card key={ia.name}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`size-10 rounded-xl grid place-items-center bg-gradient-to-br ${ia.tone} border border-border text-xs font-bold shrink-0`}
                    >
                      {ia.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{ia.name}</div>
                      <div className="text-xs text-muted-foreground">Posição —</div>
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-muted-foreground shrink-0">
                      <CircleDashed className="size-3" /> Aguardando
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {["Pontos", "Acertos", "Erros", "Precisão"].map((l) => (
                      <div key={l} className="rounded-lg border border-border/60 py-2">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {l}
                        </div>
                        <div className="font-display font-bold text-muted-foreground">—</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CRITÉRIOS */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Metodologia"
            title="Como a pontuação será calculada"
            subtitle="Critérios objetivos baseados nos resultados oficiais da FIFA."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITERIA.map((c) => (
              <Card key={c.title} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <c.icon className="size-5" />
                  </div>
                  <div className="font-display font-bold">{c.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Timeline"
            title="Evolução da Precisão"
            subtitle="A curva de acertos de cada IA será exibida aqui ao longo da Copa."
          />
          <Card className="border-dashed">
            <CardContent className="p-6 sm:p-10">
              <div className="relative h-56 sm:h-72 rounded-xl border border-border/60 bg-gradient-to-b from-muted/40 to-transparent overflow-hidden">
                {/* gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 px-6">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="border-t border-dashed border-border/50" />
                  ))}
                </div>
                <div className="absolute inset-0 grid place-items-center text-center px-6">
                  <div className="space-y-2">
                    <div className="size-12 rounded-2xl bg-muted text-muted-foreground grid place-items-center mx-auto">
                      <LineChart className="size-5" />
                    </div>
                    <div className="font-medium">Sem dados ainda</div>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Os dados começarão a ser exibidos após os primeiros jogos da Copa.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONQUISTAS */}
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Conquistas"
            title="Conquistas e Recordes"
            subtitle="Destaques individuais que serão entregues ao longo da Copa."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <Card key={a.title} className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 size-28 rounded-full bg-gold/10 blur-2xl" />
                <CardContent className="p-5 space-y-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-gold text-gold-foreground grid place-items-center shadow-elegant shrink-0">
                      <a.icon className="size-5" />
                    </div>
                    <div className="font-display font-bold truncate">{a.title}</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.text}</p>
                  <Badge variant="outline" className="gap-1.5 text-muted-foreground">
                    <Sparkles className="size-3" /> Aguardando dados da competição
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] uppercase tracking-widest text-gold">{eyebrow}</div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function PodiumCard({
  place,
  icon,
  label,
  height,
  tone,
  featured,
}: {
  place: number;
  icon: string;
  label: string;
  height: string;
  tone: string;
  featured?: boolean;
}) {
  return (
    <Card
      className={`relative overflow-hidden border ${
        featured ? "border-gold/60 shadow-elegant" : "border-border"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tone} pointer-events-none`} />
      <CardContent
        className={`relative p-6 flex flex-col items-center justify-end text-center gap-3 ${height} min-h-44`}
      >
        <div className="text-5xl sm:text-6xl leading-none">{icon}</div>
        <div className="font-display text-lg font-bold">{label}</div>
        <div className="text-sm text-muted-foreground">Aguardando competição</div>
        {featured && (
          <Badge className="bg-gold text-gold-foreground border-0">
            <Crown className="size-3 mr-1" /> Favorito
          </Badge>
        )}
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {place}º colocado
        </div>
      </CardContent>
    </Card>
  );
}

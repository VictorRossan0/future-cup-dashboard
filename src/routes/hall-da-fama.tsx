import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/hall-da-fama")({
  head: () => ({
    meta: [
      { title: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      { name: "description", content: "Desempenho real das Inteligências Artificiais durante a Copa do Mundo FIFA 2026." },
      { property: "og:title", content: "Hall da Fama das IAs · Copa 2026 Intelligence" },
      { property: "og:description", content: "Ranking de acertos das IAs durante a Copa 2026." },
    ],
    links: [{ rel: "canonical", href: "/hall-da-fama" }],
  }),
  component: HallDaFamaPage,
});

function HallDaFamaPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <header className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-2">
            <Crown className="size-3" /> Hall da Fama
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Hall da Fama das IAs</h1>
          <p className="text-muted-foreground mt-4">
            Esta página acompanhará o desempenho real das Inteligências Artificiais durante a
            Copa do Mundo FIFA 2026.
          </p>
        </header>

        <Card className="border-dashed">
          <CardContent className="py-10 flex flex-col items-center text-center gap-3">
            <div className="size-14 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant">
              <Clock className="size-6" />
            </div>
            <div className="font-display text-xl font-bold">Aguardando início da competição</div>
            <p className="text-sm text-muted-foreground max-w-md">
              Quando a Copa começar, exibiremos aqui a pontuação acumulada de cada IA, com base
              em acertos de campeão, vice, artilheiro, melhor jogador e resultados-chave.
            </p>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-border overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>IA</TableHead>
                <TableHead>Acertos</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Confiança média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Sem dados — a tabela será preenchida ao longo da competição.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}

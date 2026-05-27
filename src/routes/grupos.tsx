import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { GroupTable } from "@/components/GroupTable";
import { groups } from "@/data/groups";
import { Info } from "lucide-react";

export const Route = createFileRoute("/grupos")({
  head: () => ({
    meta: [
      { title: "Grupos e Classificação · Copa 2026 Data Hub" },
      { name: "description", content: "Tabela de classificação dos 12 grupos da Copa 2026 com indicadores de classificação direta, melhor 3º e eliminação." },
    ],
  }),
  component: GruposPage,
});

function GruposPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header>
          <div className="text-[10px] uppercase tracking-widest text-gold">Fase de Grupos</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">Grupos e Classificação</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            12 grupos com 4 seleções cada. Os <span className="text-primary font-medium">dois primeiros</span> avançam direto e os <span className="text-gold font-medium">8 melhores terceiros</span> também se classificam para os 16 avos.
          </p>
        </header>

        <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 flex items-start gap-3">
          <Info className="size-4 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Indicadores: <span className="inline-block size-2 rounded-full bg-primary align-middle mx-1" /> classificado direto
            · <span className="inline-block size-2 rounded-full bg-gold align-middle mx-1" /> possível melhor terceiro
            · <span className="inline-block size-2 rounded-full bg-muted-foreground/40 align-middle mx-1" /> eliminado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {groups.map((g) => <GroupTable key={g.letter} letter={g.letter} teams={g.teams} />)}
        </div>
      </div>
    </AppLayout>
  );
}

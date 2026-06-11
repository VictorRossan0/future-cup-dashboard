import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LoadingGrid, ErrorState, EmptyState, SourceBadge } from "@/components/DataState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TeamFlag } from "@/components/TeamFlag";
import { useAiSimulationsFull } from "@/hooks/useCopa";
import { BarChart3, Trophy, Medal, Star, Target, ArrowUpDown } from "lucide-react";
import type { VAiSimulationsFull } from "@/types/views";

export const Route = createFileRoute("/ranking-ias")({
  head: () => ({
    meta: [
      { title: "Ranking das IAs · Copa 2026 Intelligence" },
      { name: "description", content: "Ranking comparativo das previsões de IAs (ChatGPT, Claude, Gemini, Grok, Copilot, Mistral, DeepSeek, EA Sports) para a Copa 2026." },
    ],
  }),
  component: RankingIAsPage,
});

const pct = (n?: number | null) =>
  typeof n === "number" && isFinite(n) ? `${Math.round(n * 100)}%` : "—";
const dash = (s?: string | null) => (s == null || s === "" ? "—" : s);

type SortKey = "provider" | "confidence";

function RankingIAsPage() {
  const simsQ = useAiSimulationsFull();
  const sims = simsQ.data?.data ?? [];
  const [sortBy, setSortBy] = useState<SortKey>("confidence");
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...sims];
    arr.sort((a, b) => {
      const va = a[sortBy] ?? "";
      const vb = b[sortBy] ?? "";
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sims, sortBy, asc]);

  const toggle = (k: SortKey) => {
    if (sortBy === k) setAsc(!asc); else { setSortBy(k); setAsc(true); }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-elegant">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <div className="text-[10px] uppercase tracking-widest text-gold">Comparativo direto</div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 flex items-center gap-3">
                <span className="size-11 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant">
                  <BarChart3 className="size-5" />
                </span>
                Ranking das IAs
              </h1>
              <p className="text-muted-foreground mt-3">
                Lado a lado, as principais previsões de cada modelo: campeão, vice, artilheiro,
                melhor jogador e nível de confiança.
              </p>
            </div>
            {simsQ.data && <SourceBadge source={simsQ.data.source} />}
          </div>
        </section>

        {simsQ.isError && <ErrorState />}
        {simsQ.isLoading ? (
          <LoadingGrid count={6} />
        ) : sims.length === 0 ? (
          <EmptyState title="Sem simulações" description="Nenhuma simulação cadastrada no banco." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-border overflow-x-auto bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button onClick={() => toggle("provider")} className="inline-flex items-center gap-1 hover:text-foreground">
                        IA <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead><span className="inline-flex items-center gap-1"><Trophy className="size-3.5 text-gold" /> Campeão</span></TableHead>
                    <TableHead><span className="inline-flex items-center gap-1"><Medal className="size-3.5 text-primary" /> Vice</span></TableHead>
                    <TableHead><span className="inline-flex items-center gap-1"><Target className="size-3.5 text-info" /> Artilheiro</span></TableHead>
                    <TableHead><span className="inline-flex items-center gap-1"><Star className="size-3.5 text-gold" /> Melhor jogador</span></TableHead>
                    <TableHead>
                      <button onClick={() => toggle("confidence")} className="inline-flex items-center gap-1 hover:text-foreground">
                        Confiança <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((s, i) => (
                    <TableRow key={s.simulation_id} className={i === 0 ? "bg-gold/5" : ""}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <RankMedal index={i} />
                          {s.provider}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <TeamCell name={s.champion_team} code={s.champion_team_code} />
                          {i === 0 && <Badge className="bg-gradient-gold text-gold-foreground text-[10px]">Top pick</Badge>}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap"><TeamCell name={s.runner_up_team} code={s.runner_up_team_code} /></TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dash(s.top_scorer_player)}
                        {s.top_scorer_team && <span className="ml-1 text-[10px] text-muted-foreground">({s.top_scorer_team_code ?? s.top_scorer_team})</span>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dash(s.best_player_name)}
                        {s.best_player_team && <span className="ml-1 text-[10px] text-muted-foreground">({s.best_player_team_code ?? s.best_player_team})</span>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap"><ConfidencePill v={s.confidence} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {sorted.map((s, i) => <MobileCard key={s.simulation_id} s={s} index={i} />)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function RankMedal({ index }: { index: number }) {
  if (index === 0) return <span title="1º" className="inline-grid place-items-center size-6 rounded-full bg-gradient-gold text-gold-foreground text-[11px] font-bold">1</span>;
  if (index === 1) return <span title="2º" className="inline-grid place-items-center size-6 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold">2</span>;
  if (index === 2) return <span title="3º" className="inline-grid place-items-center size-6 rounded-full bg-secondary/60 text-secondary-foreground text-[11px] font-bold">3</span>;
  return <span className="inline-grid place-items-center size-6 rounded-full bg-secondary/40 text-muted-foreground text-[11px]">{index + 1}</span>;
}

function TeamCell({ name, code }: { name?: string | null; code?: string | null }) {
  if (!name && !code) return <>—</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {code && <TeamFlag teamCode={code} teamName={name} size={16} />}
      <span>{dash(name)}</span>
      {code && <span className="text-[10px] text-muted-foreground">({code})</span>}
    </span>
  );
}

function ConfidencePill({ v }: { v?: number | null }) {
  const value = typeof v === "number" ? v : null;
  const width = value == null ? 0 : Math.round(value * 100);
  const tone = value == null ? "bg-muted-foreground/40"
    : value >= 0.75 ? "bg-primary"
    : value >= 0.5 ? "bg-gold"
    : "bg-destructive";
  return (
    <div className="flex items-center gap-2 min-w-[80px] sm:min-w-[100px]">
      <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-xs tabular-nums w-9 text-right">{pct(value)}</span>
    </div>
  );
}

function MobileCard({ s, index }: { s: VAiSimulationsFull; index: number }) {
  return (
    <Card className={index === 0 ? "border-gold/40 shadow-glow" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base inline-flex items-center gap-2 min-w-0 truncate">
            <RankMedal index={index} /> <span className="truncate">{s.provider}</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] shrink-0">{pct(s.confidence)}</Badge>
        </div>
        {s.model && <CardDescription className="text-xs">{s.model}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <Row icon={<Trophy className="size-3.5 text-gold" />} label="Campeão" value={<TeamCell name={s.champion_team} code={s.champion_team_code} />} />
        <Row icon={<Medal className="size-3.5 text-primary" />} label="Vice" value={<TeamCell name={s.runner_up_team} code={s.runner_up_team_code} />} />
        <Row icon={<Target className="size-3.5 text-info" />} label="Artilheiro" value={<span>{dash(s.top_scorer_player)}{s.top_scorer_team ? ` · ${s.top_scorer_team_code ?? s.top_scorer_team}` : ""}</span>} />
        <Row icon={<Star className="size-3.5 text-gold" />} label="Melhor jogador" value={<span>{dash(s.best_player_name)}{s.best_player_team ? ` · ${s.best_player_team_code ?? s.best_player_team}` : ""}</span>} />
        <div className="pt-1"><ConfidencePill v={s.confidence} /></div>
      </CardContent>
    </Card>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 items-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1">{icon}{label}</div>
      <div className="font-medium text-sm min-w-0 truncate">{value}</div>
    </div>
  );
}

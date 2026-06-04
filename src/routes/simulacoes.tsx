import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { LoadingGrid, ErrorState, EmptyState, SourceBadge } from "@/components/DataState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, Trophy, Medal, AlertTriangle, ShieldAlert, ArrowUpDown } from "lucide-react";
import { useAiSimulationsFull, useAiSimulationConsensus } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";
import type {
  VAiSimulationsFull, AiConsensusItem, AiRankedTeam, AiGroupStagePrediction,
import type {
  VAiSimulationsFull, AiConsensusItem, AiRankedTeam, AiGroupStagePrediction,
  VAiSimulationConsensus,
} from "@/types/views";

export const Route = createFileRoute("/simulacoes")({
  head: () => ({
    meta: [
      { title: "Simulações com IA · Copa 2026 Data Hub" },
      { name: "description", content: "Comparativo entre ChatGPT, Gemini, Claude, Meta AI, Manus e Perplexity para a Copa do Mundo FIFA 2026." },
    ],
  }),
  component: SimulacoesPage,
});

// --- helpers ---------------------------------------------------------------
const pct = (n?: number | null) =>
  typeof n === "number" && isFinite(n) ? `${Math.round(n * 100)}%` : "—";
const dash = (s?: string | number | null) =>
  s === null || s === undefined || s === "" ? "—" : String(s);
const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return s; }
};
const asArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const codeBadge = (code?: string | null) =>
  code ? <span className="ml-1 text-[10px] text-muted-foreground">({code})</span> : null;

// --- page ------------------------------------------------------------------
function SimulacoesPage() {
  const simsQ = useAiSimulationsFull();
  const consQ = useAiSimulationConsensus();

  const sims = simsQ.data?.data ?? [];
  const consensus = consQ.data?.data ?? null;
  const source = simsQ.data?.source ?? "supabase";

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <PageHeader
          kicker="IA · análise comparativa"
          title={
            <span className="inline-flex items-center gap-3">
              <span className="size-10 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground">
                <Brain className="size-5" />
              </span>
              {t.ai("page_title")}
            </span>
          }
          description={t.ai("page_subtitle")}
          right={<SourceBadge source={source} />}
        >
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="secondary" className="rounded-full">
              <Sparkles className="size-3 mr-1 text-gold" />
              {consensus?.total_simulations ?? sims.length} {t.ai("simulations_analyzed")}
            </Badge>
            {typeof consensus?.avg_confidence === "number" && (
              <Badge variant="outline" className="rounded-full">
                {t.ai("avg_confidence")}: {pct(consensus.avg_confidence)}
              </Badge>
            )}
          </div>
        </PageHeader>

        {(simsQ.isError || consQ.isError) && <ErrorState />}

        {simsQ.isLoading ? (
          <LoadingGrid count={6} />
        ) : sims.length === 0 ? (
          <EmptyState title="Sem simulações" description="Nenhuma simulação encontrada no Supabase." />
        ) : (
          <>
            <ConsensusSection consensus={consensus} />
            <ProviderCards sims={sims} />
            <ComparativeTable sims={sims} />
            <FavoritesByAI sims={sims} />
            <GroupStageSection sims={sims} />
            <ValidationSection sims={sims} />
          </>
        )}
      </div>
    </AppLayout>
  );
}

// --- consensus -------------------------------------------------------------
function ConsensusSection({ consensus }: { consensus: ReturnType<typeof useAiSimulationConsensus>["data"] extends { data: infer D } ? D : null }) {
  if (!consensus) return null;
  const blocks: Array<{ title: string; icon: React.ReactNode; items: AiConsensusItem[] | null | undefined; isGroup?: boolean }> = [
    { title: t.ai("most_voted_champion"),       icon: <Trophy className="size-4 text-gold" />,           items: consensus.champion_consensus },
    { title: t.ai("most_voted_runner_up"),      icon: <Medal className="size-4 text-primary" />,         items: consensus.runner_up_consensus },
    { title: t.ai("biggest_surprise"),          icon: <Sparkles className="size-4 text-gold" />,         items: consensus.surprise_consensus },
    { title: t.ai("biggest_disappointment"),    icon: <AlertTriangle className="size-4 text-destructive" />, items: consensus.disappointment_consensus },
    { title: t.ai("most_cited_god"),            icon: <ShieldAlert className="size-4 text-destructive" />,   items: consensus.group_of_death_consensus, isGroup: true },
  ];
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("consensus")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((b) => (
          <Card key={b.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">{b.icon}{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {asArray(b.items).length === 0 ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                asArray(b.items).map((it, i) => {
                  const label = b.isGroup
                    ? `Grupo ${it.group_code ?? "?"}`
                    : (it.team ?? "—");
                  return (
                    <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm">
                          {label}{!b.isGroup && codeBadge(it.team_code)}
                        </div>
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {it.votes} {it.votes === 1 ? t.ai("vote") : t.ai("votes")}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t.ai("providers")}: {asArray(it.providers).join(", ") || "—"}
                      </div>
                      {typeof it.avg_confidence === "number" && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {t.ai("confidence")}: {pct(it.avg_confidence)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// --- per-provider cards ----------------------------------------------------
function ProviderCards({ sims }: { sims: VAiSimulationsFull[] }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">Comparativo por IA</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {sims.map((s) => <ProviderCard key={s.simulation_id} s={s} />)}
      </div>
    </section>
  );
}

function ProviderCard({ s }: { s: VAiSimulationsFull }) {
  const rows: Array<[string, React.ReactNode]> = [
    [t.ai("champion"),       <span>{dash(s.champion_team)}{codeBadge(s.champion_team_code)}</span>],
    [t.ai("runner_up"),      <span>{dash(s.runner_up_team)}{codeBadge(s.runner_up_team_code)}</span>],
    [t.ai("top_scorer"),     <span>{dash(s.top_scorer_player)}{s.top_scorer_team ? ` · ${s.top_scorer_team}` : ""}</span>],
    [t.ai("best_player"),    <span>{dash(s.best_player_name)}{s.best_player_team ? ` · ${s.best_player_team}` : ""}</span>],
    [t.ai("best_young"),     <span>{dash(s.best_young_player_name)}{s.best_young_player_team ? ` · ${s.best_young_player_team}` : ""}</span>],
    [t.ai("surprise"),       <span>{dash(s.surprise_team_name)}{codeBadge(s.surprise_team_code)}</span>],
    [t.ai("disappointment"), <span>{dash(s.disappointment_team_name)}{codeBadge(s.disappointment_team_code)}</span>],
    [t.ai("group_of_death"), <span>{s.group_of_death_code ? `Grupo ${s.group_of_death_code}` : "—"}</span>],
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{s.provider}</CardTitle>
            <CardDescription className="text-xs">
              {dash(s.model)} · {fmtDate(s.generated_at)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full shrink-0">
            {t.ai("confidence")}: {pct(s.confidence)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <dl className="grid grid-cols-1 gap-y-1.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        {s.analysis_summary && (
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t.ai("summary")}</div>
            <p className="text-sm text-foreground/90">{s.analysis_summary}</p>
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="text-sm py-2">{t.ai("show_details")}</AccordionTrigger>
            <AccordionContent>
              <DetailsBlock s={s} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function DetailsBlock({ s }: { s: VAiSimulationsFull }) {
  const sections: Array<{ title: string; node: React.ReactNode }> = [];

  const semis = asArray(s.semifinalists);
  if (semis.length) sections.push({
    title: t.ai("semifinalists"),
    node: <TeamList items={semis} />,
  });
  const favs = asArray(s.top_favorites);
  if (favs.length) sections.push({
    title: t.ai("top_favorites"),
    node: <RankedList items={favs} />,
  });
  const dh = asArray(s.dark_horses);
  if (dh.length) sections.push({
    title: t.ai("dark_horses"),
    node: <TeamList items={dh} />,
  });
  const rf = asArray(s.risk_factors);
  if (rf.length) sections.push({
    title: t.ai("risk_factors"),
    node: (
      <ul className="list-disc pl-5 text-sm space-y-1">
        {rf.map((r, i) => (
          <li key={i}>{typeof r === "string" ? r : JSON.stringify(r)}</li>
        ))}
      </ul>
    ),
  });
  if (s.tactical_notes) sections.push({
    title: t.ai("tactical_notes"),
    node: <p className="text-sm whitespace-pre-line">{typeof s.tactical_notes === "string" ? s.tactical_notes : JSON.stringify(s.tactical_notes, null, 2)}</p>,
  });

  if (sections.length === 0) return <p className="text-sm text-muted-foreground">—</p>;
  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div key={sec.title}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{sec.title}</div>
          {sec.node}
        </div>
      ))}
    </div>
  );
}

function TeamList({ items }: { items: Array<{ team?: string | null; team_code?: string | null; reason?: string | null }> }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="text-sm">
          <span className="font-medium">{dash(it.team)}</span>{codeBadge(it.team_code)}
          {it.reason && <div className="text-xs text-muted-foreground">{it.reason}</div>}
        </li>
      ))}
    </ul>
  );
}

function RankedList({ items }: { items: AiRankedTeam[] }) {
  return (
    <ol className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="text-sm flex items-start gap-2">
          <span className="size-5 rounded-full bg-secondary text-xs grid place-items-center shrink-0">{it.rank ?? i + 1}</span>
          <div className="min-w-0">
            <div><span className="font-medium">{dash(it.team)}</span>{codeBadge(it.team_code)}{typeof it.score === "number" && <span className="ml-2 text-xs text-muted-foreground">score {it.score}</span>}</div>
            {it.reason && <div className="text-xs text-muted-foreground">{it.reason}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// --- comparative table -----------------------------------------------------
type SortKey = "provider" | "champion_team" | "confidence";
function ComparativeTable({ sims }: { sims: VAiSimulationsFull[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("provider");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...sims];
    arr.sort((a, b) => {
      const va = (a[sortBy] ?? "") as string | number;
      const vb = (b[sortBy] ?? "") as string | number;
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sims, sortBy, asc]);

  const toggle = (k: SortKey) => {
    if (sortBy === k) setAsc(!asc); else { setSortBy(k); setAsc(true); }
  };

  const Th = ({ k, label }: { k?: SortKey; label: string }) => (
    <TableHead>
      {k ? (
        <button onClick={() => toggle(k)} className="inline-flex items-center gap-1 hover:text-foreground">
          {label} <ArrowUpDown className="size-3" />
        </button>
      ) : label}
    </TableHead>
  );

  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("comparative_summary")}</h2>
      <div className="rounded-xl border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <Th k="provider" label={t.ai("ai")} />
              <Th k="champion_team" label={t.ai("champion")} />
              <Th label={t.ai("runner_up")} />
              <Th label={t.ai("top_scorer")} />
              <Th label={t.ai("best_player")} />
              <Th label={t.ai("best_young")} />
              <Th label={t.ai("surprise")} />
              <Th label={t.ai("disappointment")} />
              <Th label={t.ai("group_of_death")} />
              <Th k="confidence" label={t.ai("confidence")} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((s) => (
              <TableRow key={s.simulation_id}>
                <TableCell className="font-medium">{s.provider}</TableCell>
                <TableCell>{dash(s.champion_team)}</TableCell>
                <TableCell>{dash(s.runner_up_team)}</TableCell>
                <TableCell>{dash(s.top_scorer_player)}</TableCell>
                <TableCell>{dash(s.best_player_name)}</TableCell>
                <TableCell>{dash(s.best_young_player_name)}</TableCell>
                <TableCell>{dash(s.surprise_team_name)}</TableCell>
                <TableCell>{dash(s.disappointment_team_name)}</TableCell>
                <TableCell>{s.group_of_death_code ? `Grupo ${s.group_of_death_code}` : "—"}</TableCell>
                <TableCell>{pct(s.confidence)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

// --- favorites by AI (tabs) ------------------------------------------------
function FavoritesByAI({ sims }: { sims: VAiSimulationsFull[] }) {
  const withFavs = sims.filter((s) => asArray(s.top_favorites).length > 0);
  if (!withFavs.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("favorites_by_ai")}</h2>
      <Tabs defaultValue={withFavs[0].provider}>
        <TabsList className="flex-wrap h-auto">
          {withFavs.map((s) => (
            <TabsTrigger key={s.simulation_id} value={s.provider}>{s.provider}</TabsTrigger>
          ))}
        </TabsList>
        {withFavs.map((s) => (
          <TabsContent key={s.simulation_id} value={s.provider} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <RankedList items={asArray(s.top_favorites)} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

// --- group stage -----------------------------------------------------------
function GroupStageSection({ sims }: { sims: VAiSimulationsFull[] }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("group_stage_pred")}</h2>
      <Accordion type="multiple" className="space-y-2">
        {sims.map((s) => (
          <AccordionItem key={s.simulation_id} value={s.simulation_id} className="border border-border rounded-xl px-4">
            <AccordionTrigger className="text-sm">{s.provider}</AccordionTrigger>
            <AccordionContent>
              <GroupStageBody preds={s.group_stage_predictions} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function GroupStageBody({ preds }: { preds?: AiGroupStagePrediction[] | null }) {
  const items = asArray(preds);
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{t.ai("no_group_stage")}</p>;

  const teamStr = (v: AiGroupStagePrediction["first"]) => {
    if (!v) return "—";
    if (typeof v === "string") return v;
    return `${v.team ?? "—"}${v.team_code ? ` (${v.team_code})` : ""}`;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grupo</TableHead>
            <TableHead>{t.ai("first_place")}</TableHead>
            <TableHead>{t.ai("second_place")}</TableHead>
            <TableHead>{t.ai("third_place")}</TableHead>
            <TableHead>Justificativa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((g, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{g.group_code ?? g.group ?? "—"}</TableCell>
              <TableCell>{teamStr(g.first)}</TableCell>
              <TableCell>{teamStr(g.second)}</TableCell>
              <TableCell>{teamStr(g.third)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{g.reason ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- validation notes ------------------------------------------------------
function ValidationSection({ sims }: { sims: VAiSimulationsFull[] }) {
  const withNotes = sims.filter((s) => s.validation_notes);
  if (!withNotes.length) return null;
  return (
    <section>
      <h2 className="font-display text-lg font-semibold mb-2 text-muted-foreground">{t.ai("validation_notes")}</h2>
      <Accordion type="single" collapsible>
        {withNotes.map((s) => {
          const v = s.validation_notes!;
          return (
            <AccordionItem key={s.simulation_id} value={s.simulation_id}>
              <AccordionTrigger className="text-sm text-muted-foreground">
                {s.provider}{v.status ? ` · ${v.status}` : ""}
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm space-y-2 text-muted-foreground">
                  {v.status && <div><span className="font-medium text-foreground">{t.ai("status")}: </span>{v.status}</div>}
                  {v.notes && <div><span className="font-medium text-foreground">{t.ai("notes")}: </span>{v.notes}</div>}
                  {asArray(v.corrected_fields).length > 0 && (
                    <div>
                      <span className="font-medium text-foreground">{t.ai("corrected_fields")}: </span>
                      {asArray(v.corrected_fields).join(", ")}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}

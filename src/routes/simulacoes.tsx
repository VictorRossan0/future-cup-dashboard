import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { LoadingGrid, ErrorState, EmptyState, SourceBadge } from "@/components/DataState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Sparkles, Trophy, Medal, ShieldAlert, ArrowUpDown,
  BarChart3, Database, Clock, ShieldCheck, Star, TrendingDown, Users,
} from "lucide-react";
import { useAiSimulationsFull, useAiSimulationConsensus } from "@/hooks/useCopa";
import { t } from "@/lib/i18n";
import { TeamFlag } from "@/components/TeamFlag";
import type {
  VAiSimulationsFull, AiConsensusItem, AiRankedTeam, AiGroupStagePrediction,
  VAiSimulationConsensus,
} from "@/types/views";

export const Route = createFileRoute("/simulacoes")({
  head: () => ({
    meta: [
      { title: "Simulações com IA · Copa 2026 Data Hub" },
      { name: "description", content: "Comparativo entre ChatGPT, Gemini, Claude, Meta AI, Manus, Perplexity e Grok para a Copa do Mundo FIFA 2026." },
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
const fmtDateTime = (s?: string | null) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return s; }
};
const asArray = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
const codeBadge = (code?: string | null) =>
  code ? <span className="ml-1 text-[10px] text-muted-foreground">({code})</span> : null;
const latestDate = (sims: VAiSimulationsFull[]) => {
  const ts = sims
    .map((s) => s.generated_at ? new Date(s.generated_at).getTime() : 0)
    .filter((n) => n > 0);
  return ts.length ? new Date(Math.max(...ts)).toISOString() : null;
};

// --- page ------------------------------------------------------------------
function SimulacoesPage() {
  const simsQ = useAiSimulationsFull();
  const consQ = useAiSimulationConsensus();

  const sims = simsQ.data?.data ?? [];
  const consensus: VAiSimulationConsensus | null = consQ.data?.data ?? null;
  const source = simsQ.data?.source ?? "supabase";
  const total = consensus?.total_simulations ?? sims.length;
  const lastUpdate = latestDate(sims);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-elegant">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-gradient-gold opacity-20 blur-3xl pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <div className="text-[10px] uppercase tracking-widest text-gold">IA · análise comparativa</div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 flex items-center gap-3">
                <span className="size-11 rounded-2xl bg-gradient-gold grid place-items-center text-gold-foreground shadow-elegant">
                  <Brain className="size-5" />
                </span>
                {t.ai("page_title")}
              </h1>
              <p className="text-muted-foreground mt-3">
                Compare previsões de diferentes modelos de IA para a Copa do Mundo FIFA 2026 com base em seleções, elencos, técnicos, grupos e contexto estatístico.
              </p>
            </div>
            <SourceBadge source={source} />
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <HeroStat icon={<BarChart3 className="size-4" />} label={t.ai("simulations_analyzed")} value={String(total)} />
            <HeroStat
              icon={<Sparkles className="size-4 text-gold" />}
              label={t.ai("avg_confidence")}
              value={pct(consensus?.avg_confidence)}
            />
            <HeroStat icon={<Database className="size-4 text-primary" />} label={t.ai("source")} value="Supabase" />
            <HeroStat icon={<Clock className="size-4" />} label={t.ai("last_update")} value={fmtDate(lastUpdate)} />
          </div>
          <p className="relative text-[11px] text-muted-foreground mt-4 flex items-center gap-1.5">
            <ShieldCheck className="size-3 text-primary" /> {t.ai("data_from_supabase")}
          </p>
        </section>

        {(simsQ.isError || consQ.isError) && <ErrorState />}

        {simsQ.isLoading ? (
          <LoadingGrid count={6} />
        ) : sims.length === 0 ? (
          <EmptyState title={t.ai("no_simulations")} description={t.ai("no_simulations_desc")} />
        ) : (
          <>
            <ConsensusHighlights sims={sims} consensus={consensus} />
            <ConsensusSection consensus={consensus} total={total} sims={sims} />
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

function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-1 font-display text-xl sm:text-2xl font-bold truncate">{value}</div>
    </div>
  );
}

// --- consensus -------------------------------------------------------------
function ConsensusSection({ consensus, total }: { consensus: VAiSimulationConsensus | null; total: number }) {
  if (!consensus) return null;
  const blocks: Array<{
    title: string; icon: React.ReactNode; items: AiConsensusItem[] | null | undefined;
    isGroup?: boolean; tone?: "gold" | "primary" | "destructive" | "warn";
  }> = [
    { title: t.ai("most_voted_champion"),    icon: <Trophy className="size-4" />,        items: consensus.champion_consensus, tone: "gold" },
    { title: t.ai("most_voted_runner_up"),   icon: <Medal className="size-4" />,         items: consensus.runner_up_consensus, tone: "primary" },
    { title: t.ai("biggest_surprise"),       icon: <Sparkles className="size-4" />,      items: consensus.surprise_consensus, tone: "gold" },
    { title: t.ai("biggest_disappointment"), icon: <TrendingDown className="size-4" />,  items: consensus.disappointment_consensus, tone: "destructive" },
    { title: t.ai("most_cited_god"),         icon: <ShieldAlert className="size-4" />,   items: consensus.group_of_death_consensus, isGroup: true, tone: "warn" },
  ];

  const toneClass = (tone?: string) => ({
    gold: "bg-gradient-gold text-gold-foreground",
    primary: "bg-gradient-green text-primary-foreground",
    destructive: "bg-destructive/15 text-destructive",
    warn: "bg-info/15 text-info",
  }[tone ?? ""] ?? "bg-secondary text-secondary-foreground");

  return (
    <section>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold">{t.ai("consensus")}</h2>
          <p className="text-sm text-muted-foreground">Visão agregada entre as {total} simulações de IA analisadas.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((b) => (
          <Card key={b.title} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className={`size-7 rounded-lg grid place-items-center ${toneClass(b.tone)}`}>{b.icon}</span>
                {b.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {asArray(b.items).length === 0 ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                asArray(b.items).map((it, i) => (
                  <ConsensusRow key={i} item={it} total={total} isGroup={b.isGroup} highlight={i === 0} />
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ConsensusRow({
  item, total, isGroup, highlight,
}: { item: AiConsensusItem; total: number; isGroup?: boolean; highlight?: boolean }) {
  const label = isGroup ? `${t.ai("group")} ${item.group_code ?? "?"}` : (item.team ?? "—");
  const share = total > 0 ? Math.round((item.votes / total) * 100) : 0;
  const providers = asArray(item.providers);
  return (
    <div className={`rounded-lg border p-3 transition-colors ${
      highlight ? "border-gold/40 bg-gold/5" : "border-border bg-secondary/30"
    }`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium text-sm flex items-center gap-1.5 min-w-0">
          {highlight && <Star className="size-3.5 text-gold shrink-0" />}
          {!isGroup && <TeamFlag teamCode={item.team_code} teamName={item.team} size={18} />}
          <span className="truncate">{label}</span>
          {!isGroup && codeBadge(item.team_code)}
        </div>
        <Badge variant="outline" className="rounded-full text-[10px] shrink-0">
          {item.votes}/{total}
        </Badge>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${highlight ? "bg-gradient-gold" : "bg-primary/60"}`}
          style={{ width: `${share}%` }}
        />
      </div>
      <div className="text-[11px] text-muted-foreground mt-1.5">
        {share}% {t.ai("of_total")}
      </div>
      {providers.length > 0 && (
        <div className="text-[11px] text-muted-foreground mt-1">
          <span className="font-medium text-foreground/80">{t.ai("chosen_by")}:</span>{" "}
          {providers.join(", ")}
        </div>
      )}
      {typeof item.avg_confidence === "number" && (
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {t.ai("confidence")}: {pct(item.avg_confidence)}
        </div>
      )}
    </div>
  );
}

// --- per-provider cards ----------------------------------------------------
function ProviderCards({ sims }: { sims: VAiSimulationsFull[] }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("comparative_by_ai")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {sims.map((s) => <ProviderCard key={s.simulation_id} s={s} />)}
      </div>
    </section>
  );
}

function ConfidenceBadge({ value }: { value?: number | null }) {
  const v = typeof value === "number" ? value : null;
  const tone =
    v === null ? "bg-secondary text-secondary-foreground" :
    v >= 0.75 ? "bg-primary/15 text-primary border-primary/30" :
    v >= 0.5  ? "bg-gold/15 text-gold border-gold/30" :
                "bg-destructive/15 text-destructive border-destructive/30";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {t.ai("confidence")}: {pct(v)}
    </span>
  );
}

function ProviderCard({ s }: { s: VAiSimulationsFull }) {
  const teamCell = (name?: string | null, code?: string | null) => (
    <span className="inline-flex items-center gap-1.5">
      {code && <TeamFlag teamCode={code} teamName={name} size={16} />}
      <span>{dash(name)}</span>{codeBadge(code)}
    </span>
  );
  const rows: Array<[string, React.ReactNode]> = [
    [t.ai("champion"),       teamCell(s.champion_team, s.champion_team_code)],
    [t.ai("runner_up"),      teamCell(s.runner_up_team, s.runner_up_team_code)],
    [t.ai("top_scorer"),     <span>{dash(s.top_scorer_player)}{s.top_scorer_team ? ` · ${s.top_scorer_team}` : ""}</span>],
    [t.ai("best_player"),    <span>{dash(s.best_player_name)}{s.best_player_team ? ` · ${s.best_player_team}` : ""}</span>],
    [t.ai("best_young"),     <span>{dash(s.best_young_player_name)}{s.best_young_player_team ? ` · ${s.best_young_player_team}` : ""}</span>],
    [t.ai("surprise"),       teamCell(s.surprise_team_name, s.surprise_team_code)],
    [t.ai("disappointment"), teamCell(s.disappointment_team_name, s.disappointment_team_code)],
    [t.ai("group_of_death"), <span>{s.group_of_death_code ? `${t.ai("group")} ${s.group_of_death_code}` : "—"}</span>],
  ];

  return (
    <Card className="overflow-hidden hover:border-primary/40 transition-colors">
      <CardHeader className="pb-3 bg-secondary/20">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg truncate">{s.provider}</CardTitle>
              {s.validation_notes && (
                <Badge variant="outline" className="rounded-full text-[10px] border-info/40 text-info">
                  <ShieldCheck className="size-3 mr-1" /> {t.ai("curated")}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-0.5">
              {dash(s.model)} · {fmtDateTime(s.generated_at)}
            </CardDescription>
          </div>
          <ConfidenceBadge value={s.confidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <dl className="grid grid-cols-1 gap-y-1.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[130px_1fr] gap-2 items-baseline">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="font-medium text-sm">{v}</dd>
            </div>
          ))}
        </dl>

        <Accordion type="single" collapsible>
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="text-sm py-2">{t.ai("full_analysis")}</AccordionTrigger>
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

  if (s.analysis_summary) sections.push({
    title: t.ai("summary"),
    node: <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{s.analysis_summary}</p>,
  });
  const semis = asArray(s.semifinalists);
  if (semis.length) sections.push({ title: t.ai("semifinalists"), node: <TeamList items={semis} /> });
  const favs = asArray(s.top_favorites);
  if (favs.length) sections.push({ title: t.ai("top_favorites"), node: <RankedList items={favs} /> });
  const dh = asArray(s.dark_horses);
  if (dh.length) sections.push({ title: t.ai("dark_horses"), node: <TeamList items={dh} /> });
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
    node: <NotesRenderer value={s.tactical_notes} />,
  });
  const gs = asArray(s.group_stage_predictions);
  if (gs.length) sections.push({
    title: t.ai("group_stage_pred"),
    node: <GroupGrid preds={gs} />,
  });

  if (sections.length === 0) return <p className="text-sm text-muted-foreground">—</p>;
  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div key={sec.title}>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{sec.title}</div>
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
          <span className="inline-flex items-center gap-1.5">
            {it.team_code && <TeamFlag teamCode={it.team_code} teamName={it.team} size={16} />}
            <span className="font-medium">{dash(it.team)}</span>{codeBadge(it.team_code)}
          </span>
          {it.reason && <div className="text-xs text-muted-foreground">{it.reason}</div>}
        </li>
      ))}
    </ul>
  );
}

function RankedList({ items }: { items: AiRankedTeam[] }) {
  return (
    <ol className="space-y-1.5">
      {items.map((it, i) => {
        const rank = it.rank ?? i + 1;
        const isTop = rank === 1;
        return (
          <li key={i} className={`flex items-start gap-2 rounded-lg p-2 ${isTop ? "bg-gold/10 border border-gold/30" : ""}`}>
            <span className={`size-6 rounded-full text-xs grid place-items-center shrink-0 font-semibold ${
              isTop ? "bg-gradient-gold text-gold-foreground" : "bg-secondary text-secondary-foreground"
            }`}>{rank}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                {it.team_code && <TeamFlag teamCode={it.team_code} teamName={it.team} size={16} className="self-center" />}
                <span className="font-medium text-sm">{dash(it.team)}</span>
                {codeBadge(it.team_code)}
                {typeof it.score === "number" && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    <span className="font-semibold text-foreground">{it.score}</span> / 10
                  </span>
                )}
              </div>
              {it.reason && <div className="text-xs text-muted-foreground mt-0.5">{it.reason}</div>}
            </div>
          </li>
        );
      })}
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
    <TableHead className="whitespace-nowrap">
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

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border overflow-x-auto">
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
                <TableCell className="font-medium whitespace-nowrap">{s.provider}</TableCell>
                <TableCell className="whitespace-nowrap"><TeamCell name={s.champion_team} code={s.champion_team_code} /></TableCell>
                <TableCell className="whitespace-nowrap"><TeamCell name={s.runner_up_team} code={s.runner_up_team_code} /></TableCell>
                <TableCell className="whitespace-nowrap">{dash(s.top_scorer_player)}</TableCell>
                <TableCell className="whitespace-nowrap">{dash(s.best_player_name)}</TableCell>
                <TableCell className="whitespace-nowrap">{dash(s.best_young_player_name)}</TableCell>
                <TableCell className="whitespace-nowrap"><TeamCell name={s.surprise_team_name} code={s.surprise_team_code} /></TableCell>
                <TableCell className="whitespace-nowrap"><TeamCell name={s.disappointment_team_name} code={s.disappointment_team_code} /></TableCell>
                <TableCell className="whitespace-nowrap">{s.group_of_death_code ? `${t.ai("group")} ${s.group_of_death_code}` : "—"}</TableCell>
                <TableCell className="whitespace-nowrap">{pct(s.confidence)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((s) => (
          <Card key={s.simulation_id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{s.provider}</CardTitle>
                <ConfidenceBadge value={s.confidence} />
              </div>
            </CardHeader>
            <CardContent className="text-sm grid grid-cols-2 gap-x-3 gap-y-1.5">
              <Cell k={t.ai("champion")} v={s.champion_team} />
              <Cell k={t.ai("runner_up")} v={s.runner_up_team} />
              <Cell k={t.ai("top_scorer")} v={s.top_scorer_player} />
              <Cell k={t.ai("best_player")} v={s.best_player_name} />
              <Cell k={t.ai("best_young")} v={s.best_young_player_name} />
              <Cell k={t.ai("surprise")} v={s.surprise_team_name} />
              <Cell k={t.ai("disappointment")} v={s.disappointment_team_name} />
              <Cell k={t.ai("group_of_death")} v={s.group_of_death_code ? `${t.ai("group")} ${s.group_of_death_code}` : null} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TeamCell({ name, code }: { name?: string | null; code?: string | null }) {
  if (!name && !code) return <>—</>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {code && <TeamFlag teamCode={code} teamName={name} size={16} />}
      <span>{dash(name)}</span>
    </span>
  );
}

function Cell({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="font-medium truncate">{dash(v)}</div>
    </div>
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
        <TabsList className="flex-wrap h-auto bg-secondary/50">
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
  const withGs = sims.filter((s) => asArray(s.group_stage_predictions).length > 0);
  if (!withGs.length) {
    return (
      <section>
        <h2 className="font-display text-2xl font-bold mb-4">{t.ai("group_predictions")}</h2>
        <EmptyState title={t.ai("no_group_stage")} />
      </section>
    );
  }
  return (
    <section>
      <h2 className="font-display text-2xl font-bold mb-4">{t.ai("group_predictions")}</h2>
      <Tabs defaultValue={withGs[0].provider}>
        <TabsList className="flex-wrap h-auto bg-secondary/50">
          {withGs.map((s) => (
            <TabsTrigger key={s.simulation_id} value={s.provider}>{s.provider}</TabsTrigger>
          ))}
        </TabsList>
        {withGs.map((s) => (
          <TabsContent key={s.simulation_id} value={s.provider} className="mt-4">
            <GroupGrid preds={s.group_stage_predictions ?? []} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function resolveTeam(v: unknown): { team?: string | null; team_code?: string | null; reason?: string | null } | null {
  if (!v) return null;
  if (typeof v === "string") return { team: v };
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    return {
      team: (o.team as string) ?? (o.name as string) ?? null,
      team_code: (o.team_code as string) ?? (o.code as string) ?? null,
      reason: (o.reason as string) ?? null,
    };
  }
  return null;
}

function GroupGrid({ preds }: { preds: AiGroupStagePrediction[] }) {
  const items = asArray(preds);
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.ai("no_group_stage")}</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((g, i) => {
        const qt = asArray(g.qualified_teams);
        const firstPick = qt.find((x) => x?.predicted_position === 1) ?? qt[0];
        const secondPick = qt.find((x) => x?.predicted_position === 2) ?? qt[1];
        const first = resolveTeam(firstPick) ?? resolveTeam(g.first);
        const second = resolveTeam(secondPick) ?? resolveTeam(g.second);
        const third = resolveTeam(g.possible_third_place_candidate) ?? resolveTeam(g.third);
        const reason = g.possible_third_place_candidate?.reason ?? g.reason ?? null;
        return (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2 bg-secondary/30">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="size-4 text-primary" />
                {t.ai("group")} {g.group_code ?? g.group ?? "?"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 text-sm space-y-1.5">
              <TeamRow label="1º" team={first} accent="gold" />
              <TeamRow label="2º" team={second} accent="primary" />
              <TeamRow label={t.ai("third_place")} team={third} />
              {reason && (
                <div className="pt-2 mt-2 border-t border-border text-[11px] text-muted-foreground">
                  {reason}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TeamRow({ label, team, accent }: { label: string; team: { team?: string | null; team_code?: string | null } | null; accent?: "gold" | "primary" }) {
  const dot = accent === "gold" ? "bg-gold" : accent === "primary" ? "bg-primary" : "bg-muted-foreground/40";
  return (
    <div className="flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${dot}`} />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-16">{label}</span>
      {team?.team_code && <TeamFlag teamCode={team.team_code} teamName={team.team} size={16} />}
      <span className="font-medium truncate">
        {team?.team ?? "—"}
        {team?.team_code && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{team.team_code}</span>}
      </span>
    </div>
  );
}


// --- validation notes ------------------------------------------------------
function ValidationSection({ sims }: { sims: VAiSimulationsFull[] }) {
  const withNotes = sims.filter((s) => s.validation_notes);
  if (!withNotes.length) return null;
  return (
    <section>
      <div className="mb-3">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="size-4 text-info" />
          {t.ai("validation_title")}
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          {t.ai("validation_intro")}
        </p>
      </div>
      <Accordion type="single" collapsible className="rounded-xl border border-border bg-secondary/20 px-3">
        {withNotes.map((s) => {
          const v = s.validation_notes!;
          return (
            <AccordionItem key={s.simulation_id} value={s.simulation_id} className="border-border">
              <AccordionTrigger className="text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{s.provider}</span>
                  {v.status && (
                    <Badge variant="outline" className="rounded-full text-[10px] border-info/30 text-info">
                      {v.status}
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm space-y-2 text-muted-foreground">
                  {v.notes != null && <div><span className="font-medium text-foreground">{t.ai("notes")}: </span><NotesRenderer value={v.notes} inline /></div>}
                  {asArray(v.corrected_fields).length > 0 && (
                    <div>
                      <span className="font-medium text-foreground">{t.ai("corrected_fields")}: </span>
                      <span className="inline-flex flex-wrap gap-1 mt-1">
                        {asArray(v.corrected_fields).map((f) => (
                          <Badge key={f} variant="secondary" className="rounded-full text-[10px]">{f}</Badge>
                        ))}
                      </span>
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

function NotesRenderer({ value, inline }: { value: unknown; inline?: boolean }) {
  if (value == null) return null;
  if (typeof value === "string") {
    return <span className={inline ? "" : "text-sm whitespace-pre-line block"}>{value}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    const allStrings = value.every((v) => typeof v === "string");
    if (allStrings) {
      return (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {(value as string[]).map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      );
    }
    return (
      <ul className="space-y-1.5 text-sm">
        {value.map((v, i) => {
          if (typeof v === "string") return <li key={i}>{v}</li>;
          if (v && typeof v === "object") {
            const o = v as Record<string, unknown>;
            const team = (o.team as string) ?? (o.title as string) ?? null;
            const code = (o.team_code as string) ?? null;
            const note = (o.note as string) ?? (o.text as string) ?? (o.description as string) ?? null;
            if (team || note) {
              return (
                <li key={i} className="flex items-start gap-1.5">
                  {code && <TeamFlag teamCode={code} teamName={team} size={14} className="mt-0.5" />}
                  <span>
                    {team && <span className="font-medium">{team}</span>}
                    {code && <span className="ml-1 text-[10px] font-mono text-muted-foreground">{code}</span>}
                    {team && note && <span className="text-muted-foreground"> — </span>}
                    {note && <span className="text-muted-foreground">{note}</span>}
                  </span>
                </li>
              );
            }
          }
          return <li key={i} className="text-xs text-muted-foreground italic">—</li>;
        })}
      </ul>
    );
  }
  if (typeof value === "object") {
    // try common shape { summary } or fallback
    const o = value as Record<string, unknown>;
    if (typeof o.summary === "string") {
      return <span className={inline ? "" : "text-sm whitespace-pre-line block"}>{o.summary}</span>;
    }
    return <span className="text-xs text-muted-foreground italic">—</span>;
  }
  return <span>{String(value)}</span>;
}


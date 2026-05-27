import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Countdown } from "@/components/Countdown";
import { MatchCard } from "@/components/MatchCard";
import { copaInfo } from "@/data/copaInfo";
import { matches } from "@/data/matches";
import { aiSimulations } from "@/data/aiSimulations";
import { Trophy, Users, CalendarDays, Flag, Layers, MapPin, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copa 2026 Data Hub — Dashboard" },
      { name: "description", content: "Dashboard interativo da Copa do Mundo FIFA 2026: 48 seleções, 12 grupos, jogos, regras e simulações de IA." },
    ],
  }),
  component: Index,
});

function Index() {
  const upcoming = matches.filter((m) => m.status !== "Encerrado").slice(0, 6);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.72 0.17 152 / 0.25), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.82 0.14 85 / 0.2), transparent 50%)" }} />
        <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur border border-border text-[10px] uppercase tracking-widest text-gold mb-5">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            Dados simulados · Mock data
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Copa 2026 <span className="bg-gradient-gold bg-clip-text text-transparent">Data Hub</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Dashboard interativo com jogos, grupos, seleções, jogadores, regras e simulações de IA da Copa do Mundo 2026.
          </p>

          <div className="mt-8 max-w-xl">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Contagem regressiva · 11 jun 2026
            </div>
            <Countdown target={copaInfo.startDate} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="Seleções" value={48} variant="green" />
          <StatCard icon={Layers} label="Grupos" value={12} variant="info" />
          <StatCard icon={CalendarDays} label="Jogos" value={104} />
          <StatCard icon={Flag} label="Países-sede" value={3} hint="USA · CAN · MEX" />
          <StatCard icon={Trophy} label="16 avos" value="Novo" variant="gold" hint="Nova fase" />
        </div>
      </section>

      {/* Upcoming */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <MapPin className="size-5 text-primary" /> Próximos jogos
            </h2>
            <p className="text-sm text-muted-foreground">Dados simulados — substitua por JSON real no futuro.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      {/* AI Favorites */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Brain className="size-5 text-gold" /> Favoritos das IAs
            </h2>
            <p className="text-sm text-muted-foreground">Ranking comparativo fictício entre IAs líderes.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/40">
                <tr>
                  <th className="text-left px-4 py-3">IA</th>
                  <th className="text-left px-4 py-3">Campeã prevista</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Vice</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Surpresa</th>
                  <th className="text-right px-4 py-3">Confiança</th>
                </tr>
              </thead>
              <tbody>
                {aiSimulations.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">{s.ai}</td>
                    <td className="px-4 py-3 text-gold">{s.champion}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{s.runnerUp}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{s.surprise}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{s.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

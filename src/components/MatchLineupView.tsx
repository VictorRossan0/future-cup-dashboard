import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamFlag } from "@/components/TeamFlag";
import { EmptyState } from "@/components/DataState";
import { Crown, ShieldCheck, UserRound, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { VMatchLineup } from "@/services/copaService";

// ---------------------------------------------------------------------------
// Position mapping (ESPN abbreviations -> field role)

type Role = "GK" | "DEF" | "WB" | "DM" | "MID" | "AM" | "WIDE" | "FWD";
type Side = "L" | "C" | "R";

const POS_ROLE: Record<string, Role> = {
  G: "GK", GK: "GK",
  CD: "DEF", "CD-L": "DEF", "CD-R": "DEF", "CD-C": "DEF", CB: "DEF", "CB-L": "DEF", "CB-R": "DEF", D: "DEF", SW: "DEF",
  LB: "WB", RB: "WB", LWB: "WB", RWB: "WB", WB: "WB",
  DM: "DM", "DM-L": "DM", "DM-R": "DM", "DM-C": "DM", CDM: "DM",
  CM: "MID", "CM-L": "MID", "CM-R": "MID", "CM-C": "MID", M: "MID",
  AM: "AM", "AM-L": "AM", "AM-R": "AM", "AM-C": "AM", CAM: "AM",
  LM: "WIDE", RM: "WIDE", LW: "WIDE", RW: "WIDE",
  F: "FWD", CF: "FWD", "CF-L": "FWD", "CF-R": "FWD", "CF-C": "FWD", ST: "FWD", SS: "FWD",
  "F-L": "FWD", "F-R": "FWD", "F-C": "FWD",
};

function abbrOf(p: VMatchLineup): string {
  return (p.position_abbreviation ?? p.position ?? "").toString().toUpperCase().trim();
}

function roleOf(p: VMatchLineup): Role {
  const abbr = abbrOf(p);
  if (POS_ROLE[abbr]) return POS_ROLE[abbr];
  const base = abbr.split("-")[0];
  if (POS_ROLE[base]) return POS_ROLE[base];
  const name = (p.position_name ?? "").toString().toLowerCase();
  const v = abbr.toLowerCase();
  if (v.startsWith("g") || name.includes("goalkeep") || name.includes("gole")) return "GK";
  if (name.includes("defender") || name.includes("zagueiro") || v.startsWith("cb") || v.startsWith("cd")) return "DEF";
  if (name.includes("back") || v.startsWith("lb") || v.startsWith("rb")) return "WB";
  if (name.includes("defensive mid") || v.startsWith("dm")) return "DM";
  if (name.includes("attacking mid") || v.startsWith("am")) return "AM";
  if (name.includes("wing") || v.startsWith("lw") || v.startsWith("rw") || v.startsWith("lm") || v.startsWith("rm")) return "WIDE";
  if (name.includes("midfield") || v.startsWith("cm") || v.startsWith("m")) return "MID";
  if (name.includes("forward") || name.includes("striker") || name.includes("atac") || v.startsWith("f") || v.startsWith("st") || v.startsWith("cf")) return "FWD";
  return "MID";
}

function sideOf(p: VMatchLineup): Side {
  const abbr = abbrOf(p);
  const name = (p.position_name ?? "").toString().toLowerCase();
  if (abbr.endsWith("-L") || /^L[BWM]/.test(abbr) || name.includes(" left") || name.startsWith("left")) return "L";
  if (abbr.endsWith("-R") || /^R[BWM]/.test(abbr) || name.includes(" right") || name.startsWith("right")) return "R";
  return "C";
}

function shortPos(p?: string | null) {
  if (!p) return "—";
  return p.toUpperCase().slice(0, 4);
}

function parseFormation(formation: string): number[] {
  const parts = formation
    .split(/[-x:]/)
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return parts.length ? parts : [4, 4, 2];
}

function lastName(name?: string | null) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1 ? parts[0] : parts[parts.length - 1];
}

// ---------------------------------------------------------------------------
// Public column

export function MatchLineupView({
  rows,
  fallbackTeamCode,
  fallbackTeamName,
  tone,
}: {
  rows: VMatchLineup[];
  fallbackTeamCode?: string;
  fallbackTeamName?: string;
  tone: "home" | "away";
}) {
  const [selected, setSelected] = useState<VMatchLineup | null>(null);

  if (rows.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          title="Sem escalação"
          description={`Aguardando publicação oficial${fallbackTeamName ? ` de ${fallbackTeamName}` : ""}.`}
        />
      </Card>
    );
  }

  const meta = rows[0];
  const teamName = meta.team_name ?? fallbackTeamName ?? "Seleção";
  const teamCode = meta.team_code ?? fallbackTeamCode ?? null;
  const formationRaw = (meta.formation ?? "").toString().trim();
  const formation = formationRaw;
  const coach = meta.coach_name ?? null;

  const starters = rows.filter((r) => r.is_starter !== false);
  const bench = rows.filter((r) => r.is_starter === false);
  const captain =
    rows.find((r) => r.is_captain) ??
    rows.find((r) => r.player_id && r.player_id === meta.captain_player_id) ??
    null;

  return (
    <Card className="p-4 sm:p-5 space-y-4 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamFlag teamCode={teamCode} teamName={teamName} size={40} />
          <div className="min-w-0">
            <div className="font-display text-lg font-bold truncate">{teamName}</div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
              <span className="uppercase tracking-widest text-[9px]">Formação</span>
              {formation ? (
                <Badge variant="outline" className="border-primary/40 text-primary font-mono text-xs">
                  {formation}
                </Badge>
              ) : (
                <span className="italic text-muted-foreground/80">Formação não divulgada</span>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-[10px]",
            tone === "home" ? "border-primary/40 text-primary" : "border-gold/50 text-gold",
          )}
        >
          {tone === "home" ? "Mandante" : "Visitante"}
        </Badge>
      </div>

      {/* Coach */}
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-gradient-to-br from-secondary/40 to-secondary/10 px-3 py-2.5">
        <div className="grid place-items-center size-9 rounded-full bg-primary/15 text-primary border border-primary/30 shrink-0">
          <ShieldCheck className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Comissão Técnica</div>
          <div className="text-sm font-bold truncate">
            {coach ?? <span className="italic text-muted-foreground">Técnico não informado</span>}
          </div>
        </div>
      </div>

      {/* Field */}
      <Field
        formation={formation || "4-4-2"}
        starters={starters}
        captainId={captain?.player_id ?? null}
        onSelect={setSelected}
      />

      {/* Starters list */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold mb-2">
          <Crown className="size-3.5" /> Titulares
          <span className="text-foreground/80">· {starters.length}</span>
        </div>
        {starters.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem titulares divulgados.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {[...starters]
              .sort((a, b) => {
                const ag = roleOf(a) === "GK" ? 0 : 1;
                const bg = roleOf(b) === "GK" ? 0 : 1;
                if (ag !== bg) return ag - bg;
                return (a.jersey_number ?? 99) - (b.jersey_number ?? 99);
              })
              .map((p, i) => {
                const isCap = (captain?.player_id ?? null) && p.player_id === captain?.player_id;
                return (
                  <li key={`s-${p.player_id ?? p.player_name}-${i}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      className={cn(
                        "w-full flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs text-left transition-colors",
                        isCap
                          ? "border-gold/50 bg-gold/5 hover:bg-gold/10"
                          : "border-border/60 bg-card hover:bg-secondary/40",
                      )}
                    >
                      <span className="grid place-items-center size-6 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono font-bold text-primary shrink-0">
                        <Hash className="size-2.5 -mr-0.5" />
                        {p.jersey_number ?? "—"}
                      </span>
                      <span className="flex-1 truncate font-medium">{p.player_name ?? "—"}</span>
                      {isCap && (
                        <span
                          className="grid place-items-center size-4 rounded-full bg-gold text-[8px] font-black text-slate-900 shrink-0"
                          title="Capitão"
                        >
                          C
                        </span>
                      )}
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono shrink-0">
                        {shortPos((p.position_abbreviation as string | undefined) ?? p.position)}
                      </Badge>
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Bench */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          <UserRound className="size-3.5" /> Banco de Reservas
          <span className="text-foreground/80">· {bench.length}</span>
        </div>
        {bench.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sem reservas divulgados.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {[...bench]
              .sort((a, b) => (a.jersey_number ?? 99) - (b.jersey_number ?? 99))
              .map((p, i) => (
                <li key={`b-${p.player_id ?? p.player_name}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="w-full flex items-center gap-2 rounded-md border border-border/60 bg-secondary/30 hover:bg-secondary/60 px-2 py-1.5 text-xs text-left transition-colors"
                  >
                    <span className="grid place-items-center size-6 rounded-full bg-background border border-border text-[10px] font-mono font-bold shrink-0">
                      {p.jersey_number ?? "—"}
                    </span>
                    <span className="flex-1 truncate font-medium">{p.player_name ?? "—"}</span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground shrink-0">
                      SUB
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <PlayerDialog player={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tactical field

function Field({
  formation,
  starters,
  captainId,
  onSelect,
}: {
  formation: string;
  starters: VMatchLineup[];
  captainId: string | null;
  onSelect: (p: VMatchLineup) => void;
}) {
  const lines = parseFormation(formation);
  const totalOutfield = lines.reduce((a, b) => a + b, 0);

  const gk = starters.find((p) => roleOf(p) === "GK") ?? null;
  const outfieldAll = starters.filter((p) => p !== gk);

  // Role priority (back → front)
  const bandOrder: Role[] = ["DEF", "WB", "DM", "MID", "AM", "WIDE", "FWD"];
  const bandRow: Record<Role, number> = {
    GK: -1, DEF: 0, WB: 0, DM: 1, MID: 2, AM: 3, WIDE: 3, FWD: 4,
  };

  // Bucket by row band; try role-based first
  const hasReliablePositions = outfieldAll.some(
    (p) => (p.position_abbreviation ?? p.position_name) != null,
  );

  let grouped: VMatchLineup[][] = [];

  if (hasReliablePositions) {
    // Collapse to as many rows as the formation, walking from back to front.
    const buckets: VMatchLineup[][] = Array.from({ length: 5 }, () => []);
    for (const p of outfieldAll) {
      const row = bandRow[roleOf(p)];
      buckets[Math.max(0, Math.min(4, row))].push(p);
    }
    const filled = buckets.filter((b) => b.length > 0);

    // Reduce or expand `filled` to match `lines.length` rows.
    grouped = collapseRows(filled, lines.length);

    // If assignment is unbalanced vs the announced formation, redistribute
    // adjacent rows toward the target row sizes to match `lines`.
    grouped = balanceToFormation(grouped, lines);

    // Sort each row by side (L → C → R), then by position_order/jersey
    grouped = grouped.map((row) =>
      [...row].sort((a, b) => {
        const sideRank: Record<Side, number> = { L: 0, C: 1, R: 2 };
        const sa = sideRank[sideOf(a)];
        const sb = sideRank[sideOf(b)];
        if (sa !== sb) return sa - sb;
        return (a.jersey_number ?? 99) - (b.jersey_number ?? 99);
      }),
    );
  } else {
    // Fallback: legacy behaviour based on position_order + formation.
    const outfield = [...outfieldAll]
      .sort((a, b) => {
        const oa = bandOrder.indexOf(roleOf(a));
        const ob = bandOrder.indexOf(roleOf(b));
        return oa - ob;
      })
      .slice(0, totalOutfield);
    let cursor = 0;
    for (const count of lines) {
      grouped.push(outfield.slice(cursor, cursor + count));
      cursor += count;
    }
  }

  const rowCount = grouped.length;
  const yFor = (idx: number) => {
    if (rowCount === 1) return 50;
    const top = 14;
    const bottom = 78;
    return bottom - (idx * (bottom - top)) / (rowCount - 1);
  };

  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-elegant">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, hsl(142 60% 22%) 0 8%, hsl(142 55% 27%) 8% 16%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full text-white/40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="0.6" fill="currentColor" />
        <rect x="25" y="2" width="50" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="38" y="2" width="24" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="25" y="84" width="50" height="14" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <rect x="38" y="92" width="24" height="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
      </svg>

      {gk && (
        <PlayerDot
          player={gk}
          x={50}
          y={92}
          isCaptain={gk.player_id === captainId}
          onSelect={onSelect}
        />
      )}

      {grouped.map((row, ri) => {
        const y = yFor(ri);
        return row.map((p, ci) => {
          const x = ((ci + 1) / (row.length + 1)) * 100;
          return (
            <PlayerDot
              key={`${ri}-${ci}-${p.player_id ?? p.player_name}`}
              player={p}
              x={x}
              y={y}
              isCaptain={p.player_id === captainId}
              onSelect={onSelect}
            />
          );
        });
      })}
    </div>
  );
}

function PlayerDot({
  player,
  x,
  y,
  isCaptain,
  onSelect,
}: {
  player: VMatchLineup;
  x: number;
  y: number;
  isCaptain: boolean;
  onSelect: (p: VMatchLineup) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(player)}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative">
        <div className="grid place-items-center size-9 sm:size-10 rounded-full bg-white text-slate-900 font-mono text-sm font-black border-2 border-emerald-300 shadow-md group-hover:scale-110 group-hover:border-gold transition-transform">
          {player.jersey_number ?? "—"}
        </div>
        {isCaptain && (
          <div
            className="absolute -top-1 -right-1 grid place-items-center size-4 rounded-full bg-gold text-[8px] font-black text-slate-900 border border-amber-900/60 shadow"
            title="Capitão"
          >
            C
          </div>
        )}
      </div>
      <div className="mt-1 max-w-[80px] truncate text-[10px] font-medium text-white bg-black/55 px-1.5 rounded">
        {lastName(player.player_name)}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Player dialog

function PlayerDialog({
  player,
  onOpenChange,
}: {
  player: VMatchLineup | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(player)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="grid place-items-center size-10 rounded-full bg-primary/15 border border-primary/30 text-primary font-mono font-black">
              {player?.jersey_number ?? "—"}
            </span>
            <span className="truncate">{player?.player_name ?? "—"}</span>
          </DialogTitle>
          <DialogDescription>
            {((player?.position_name as string | undefined) ?? player?.position ?? "Posição não informada") as string}
            {player?.is_captain ? " · Capitão" : ""}
            {player?.is_starter === false ? " · Reserva" : ""}
          </DialogDescription>
        </DialogHeader>
        {player?.team_name && (
          <div className="text-xs text-muted-foreground border-t border-border/60 pt-3">
            <span className="uppercase tracking-widest text-[9px]">Seleção</span>
            <div className="font-bold text-sm text-foreground mt-0.5">{player.team_name}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import type { Player } from "@/types";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayerCard({ player }: { player: Player }) {
  const statusColor = {
    "Titular provável": "text-primary",
    "Reserva": "text-muted-foreground",
    "Dúvida": "text-warning",
  }[player.status];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-xl bg-gradient-green grid place-items-center font-display font-bold text-xl text-primary-foreground shrink-0">
          {player.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{player.name}</h3>
            {player.captain && <Star className="size-3.5 text-gold fill-gold" />}
          </div>
          <div className="text-xs text-muted-foreground">{player.position}</div>
          <div className={cn("text-[10px] uppercase tracking-widest mt-1", statusColor)}>{player.status}</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
        <div><div className="text-muted-foreground text-[10px]">Idade</div><div className="tabular-nums">{player.age}</div></div>
        <div><div className="text-muted-foreground text-[10px]">Altura</div><div className="tabular-nums">{player.height.toFixed(2)}m</div></div>
        <div><div className="text-muted-foreground text-[10px]">Peso</div><div className="tabular-nums">{player.weight}kg</div></div>
      </div>
      <div className="mt-2 text-xs">
        <div className="text-muted-foreground text-[10px]">Clube</div>
        <div className="truncate">
          {player.club} <span className="text-muted-foreground">· {player.league} ({player.clubCountry})</span>
        </div>
      </div>
    </div>
  );
}

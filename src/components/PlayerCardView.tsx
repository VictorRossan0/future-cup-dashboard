import type { VPlayersFull } from "@/types/views";
import { t } from "@/lib/i18n";

export function PlayerCardView({ player }: { player: VPlayersFull }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-xl bg-gradient-green grid place-items-center font-display font-bold text-xl text-primary-foreground shrink-0 tabular-nums">
          {player.jersey_number ?? "—"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{player.player_name}</h3>
          <div className="text-xs text-muted-foreground">{t.position(player.position)}</div>
          {player.team_name && (
            <div className="text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">
              {player.team_code ?? player.team_name}{player.group_code ? ` · Grupo ${player.group_code}` : ""}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground text-[10px]">Idade</div>
          <div className="tabular-nums">{player.age ?? "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-[10px]">Altura</div>
          <div className="tabular-nums">{player.height_cm ? `${(player.height_cm / 100).toFixed(2)}m` : "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-[10px]">Nascimento</div>
          <div className="tabular-nums">{player.date_of_birth ?? "—"}</div>
        </div>
      </div>
      <div className="mt-2 text-xs">
        <div className="text-muted-foreground text-[10px]">Clube</div>
        <div className="truncate">{player.club ?? "—"}</div>
      </div>
      {player.source && (
        <div className="mt-2 text-[10px] text-muted-foreground italic">Fonte: {player.source}</div>
      )}
    </div>
  );
}

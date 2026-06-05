import { useState } from "react";
import { cn } from "@/lib/utils";
import { getTeamFlagUrl } from "@/lib/flags";

interface TeamFlagProps {
  teamCode?: string | null;
  teamName?: string | null;
  size?: number;
  className?: string;
}

export function TeamFlag({ teamCode, teamName, size = 20, className }: TeamFlagProps) {
  const [errored, setErrored] = useState(false);
  const url = getTeamFlagUrl(teamCode);
  const alt = teamName ? `Bandeira de ${teamName}` : teamCode ? `Bandeira ${teamCode}` : "Bandeira";
  const style = { width: size, height: size };

  if (!url || errored) {
    return (
      <span
        aria-label={alt}
        title={teamName ?? teamCode ?? undefined}
        style={style}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-muted-foreground border border-border shrink-0",
          className,
        )}
      >
        {(teamCode ?? "?").slice(0, 3)}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      title={teamName ?? teamCode ?? undefined}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      style={style}
      className={cn("inline-block rounded-full object-cover shrink-0", className)}
    />
  );
}

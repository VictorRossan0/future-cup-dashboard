import { useEffect, useState } from "react";

interface CountdownProps {
  target: string; // ISO
}

function diff(target: Date) {
  const t = target.getTime() - Date.now();
  const clamp = Math.max(0, t);
  return {
    d: Math.floor(clamp / 86400000),
    h: Math.floor((clamp / 3600000) % 24),
    m: Math.floor((clamp / 60000) % 60),
    s: Math.floor((clamp / 1000) % 60),
  };
}

export function Countdown({ target }: CountdownProps) {
  const date = new Date(target);
  const [t, setT] = useState(() => diff(date));
  useEffect(() => {
    const id = setInterval(() => setT(diff(date)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items: [string, number][] = [
    ["Dias", t.d],
    ["Horas", t.h],
    ["Min", t.m],
    ["Seg", t.s],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card/50 backdrop-blur px-2 py-3 sm:py-4 text-center"
        >
          <div className="font-display text-2xl sm:text-4xl font-bold text-gold tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}

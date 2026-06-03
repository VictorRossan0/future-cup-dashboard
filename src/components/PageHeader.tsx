import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ kicker, title, description, right, children }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        {kicker && (
          <div className="text-[10px] uppercase tracking-widest text-gold">{kicker}</div>
        )}
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        )}
        {children}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}

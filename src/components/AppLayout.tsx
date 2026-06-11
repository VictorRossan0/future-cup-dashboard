import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  CalendarDays,
  Trophy,
  BookOpen,
  Brain,
  ListOrdered,
  Activity,
  Swords,
  BarChart3,
  Info,
  FlaskConical,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewStatus } from "@/components/PreviewStatus";

const items = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/grupos", label: "Grupos", icon: ListOrdered },
  { to: "/jogos", label: "Jogos", icon: CalendarDays },
  { to: "/mata-mata", label: "Mata-mata", icon: Swords },
  { to: "/selecoes", label: "Seleções", icon: Trophy },
  { to: "/regras", label: "Regras", icon: BookOpen },
  { to: "/simulacoes", label: "Simulações de IA", icon: Brain },
  { to: "/ranking-ias", label: "Ranking das IAs", icon: BarChart3 },
  { to: "/hall-da-fama", label: "Hall da Fama", icon: Crown },
  { to: "/sobre", label: "Sobre", icon: Info },
  { to: "/metodologia", label: "Metodologia", icon: FlaskConical },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden max-w-full">
      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar shrink-0 sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-green grid place-items-center shadow-glow">
              <Activity className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-sidebar-foreground leading-tight">Copa 2026</div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Intelligence</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <it.icon className="size-4 shrink-0" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Aviso</div>
          <p className="text-xs text-sidebar-foreground/70 leading-relaxed">
            Dados simulados para protótipo. Não são informações oficiais da FIFA.
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden max-w-full">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-sidebar/95 backdrop-blur border-b border-sidebar-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-green grid place-items-center">
                <Activity className="size-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Copa 2026</span>
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-gold">Intelligence</span>
          </div>
          {/* Scrollable pill nav — safe overflow */}
          <nav
            className="flex overflow-x-auto gap-1.5 px-3 pb-2.5 scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {items.map((it) => {
              const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors",
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <it.icon className="size-3.5 shrink-0" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 overflow-x-hidden max-w-full">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground text-center">
          Copa 2026 Intelligence · Dados simulados para protótipo · Não oficial
        </footer>
      </div>

      <div className="overflow-hidden">
        {" "}
        <PreviewStatus />{" "}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating indicator that shows whether the preview build is ready.
 * - "compiling" before hydration completes
 * - "ready" once React has mounted on the client
 * - "error" if a window error is captured
 */
export function PreviewStatus() {
  const [status, setStatus] = useState<"compiling" | "ready" | "error">("compiling");
  const [readyAt, setReadyAt] = useState<Date | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Mark ready on next frame so it reflects actual paint
    const id = requestAnimationFrame(() => {
      setStatus("ready");
      setReadyAt(new Date());
      // Auto-collapse after 4s
      setTimeout(() => setCollapsed(true), 4000);
    });

    const onError = () => setStatus("error");
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  }, []);

  const config = {
    compiling: {
      icon: Loader2,
      label: "Compilando preview…",
      cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      spin: true,
    },
    ready: {
      icon: CheckCircle2,
      label: "Preview pronto",
      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      spin: false,
    },
    error: {
      icon: AlertTriangle,
      label: "Erro no preview",
      cls: "bg-red-500/15 text-red-300 border-red-500/30",
      spin: false,
    },
  }[status];

  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => setCollapsed((c) => !c)}
      aria-label="Status do preview"
      className={cn(
        "fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-elegant backdrop-blur transition-all",
        config.cls,
        collapsed && status === "ready" && "px-2 py-2"
      )}
    >
      <Icon className={cn("size-3.5", config.spin && "animate-spin")} />
      {!(collapsed && status === "ready") && (
        <span className="flex items-center gap-1.5">
          {config.label}
          {readyAt && status === "ready" && (
            <span className="opacity-60">
              · {readyAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (total <= pageSize) {
    return (
      <div className="text-xs text-muted-foreground">
        {total} item(s)
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
      <span className="text-muted-foreground">
        Mostrando <span className="text-foreground font-medium">{start}</span>–
        <span className="text-foreground font-medium">{end}</span> de{" "}
        <span className="text-foreground font-medium">{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
          className="size-8 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2 tabular-nums text-xs text-muted-foreground">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
          className="size-8 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

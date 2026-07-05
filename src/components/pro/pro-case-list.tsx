import Link from "next/link";
import { ChevronRight, FolderOpen } from "lucide-react";

export function ProCaseList({
  cases,
  newCaseLabel,
  emptyHint,
}: {
  cases: { circleId: string; name: string; createdAt: string }[];
  newCaseLabel: string;
  emptyHint: string;
}) {
  if (cases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--marketing-border)] bg-[var(--marketing-mist)]/40 px-6 py-10 text-center">
        <FolderOpen className="mx-auto size-10 text-muted-foreground/60" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">{emptyHint}</p>
        <Link
          href="/pro/setup"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--marketing-navy)] px-5 text-sm font-medium text-white hover:bg-[var(--marketing-navy-soft)]"
        >
          {newCaseLabel}
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {cases.map((circle) => (
        <li key={circle.circleId}>
          <Link
            href={`/pro/circles/${circle.circleId}`}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--marketing-border)] bg-white p-5 transition-all hover:border-[var(--marketing-teal)]/40 hover:shadow-[0_16px_48px_-28px_oklch(0.24_0.03_252_/_0.35)]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--marketing-navy)]/8 text-[var(--marketing-navy)]">
              <FolderOpen className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--marketing-slate)] group-hover:text-[var(--marketing-navy)]">
                {circle.name}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Created{" "}
                {circle.createdAt
                  ? new Date(circle.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <ChevronRight
              className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--marketing-teal)]"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

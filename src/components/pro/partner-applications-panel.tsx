"use client";

import { useTransition } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { approvePartnerApplication, rejectPartnerApplication } from "@/actions/pro/partner";
import type { PartnerApplication } from "@/actions/pro/partner";
import { AdminCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_SECTIONS = [
  { key: "pending" as const, label: "Awaiting review", icon: Clock },
  { key: "approved" as const, label: "Approved", icon: CheckCircle2 },
  { key: "rejected" as const, label: "Rejected", icon: XCircle },
];

function StatusBadge({ status }: { status: PartnerApplication["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        status === "pending" && "bg-amber-100 text-amber-900",
        status === "approved" && "bg-emerald-100 text-emerald-800",
        status === "rejected" && "bg-slate-100 text-slate-700",
      )}
    >
      {status}
    </span>
  );
}

function ApplicationCard({
  app,
  pending,
  onApprove,
  onReject,
}: {
  app: PartnerApplication;
  pending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <AdminCard className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[var(--marketing-slate)]">
              {app.firstName} {app.lastName}
            </p>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <a href={`mailto:${app.email}`} className="hover:text-[var(--marketing-teal)] hover:underline">
              {app.email}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <span className="font-medium text-foreground">{app.practice}</span>
            <span className="text-muted-foreground"> · {app.location}</span>
          </p>
          {app.message && (
            <blockquote className="mt-3 border-l-2 border-[var(--marketing-teal)]/40 pl-3 text-sm italic text-muted-foreground">
              {app.message}
            </blockquote>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Applied {new Date(app.createdAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        {app.status === "pending" && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[140px]">
            <Button type="button" disabled={pending} onClick={() => onApprove(app.id)} className="min-h-10">
              Approve & send invite
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onReject(app.id)}
              className="min-h-10"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </AdminCard>
  );
}

export function PartnerApplicationsPanel({
  applications,
}: {
  applications: PartnerApplication[];
}) {
  const [pending, startTransition] = useTransition();

  function approve(id: string) {
    startTransition(async () => {
      await approvePartnerApplication(id);
      window.location.reload();
    });
  }

  function reject(id: string) {
    const reason = window.prompt("Optional rejection reason for your records:");
    startTransition(async () => {
      await rejectPartnerApplication(id, reason ?? undefined);
      window.location.reload();
    });
  }

  if (applications.length === 0) {
    return (
      <AdminCard className="text-center">
        <Clock className="mx-auto size-8 text-muted-foreground/60" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-[var(--marketing-slate)]">No applications yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          When professionals apply through the partner page, their requests will appear here for
          review. You will be able to approve or reject each one.
        </p>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-8">
      {STATUS_SECTIONS.map(({ key, label, icon: Icon }) => {
        const items = applications.filter((app) => app.status === key);
        if (items.length === 0) return null;

        return (
          <section key={key}>
            <div className="mb-3 flex items-center gap-2">
              <Icon className="size-4 text-[var(--marketing-teal)]" aria-hidden />
              <h2 className="text-sm font-semibold text-[var(--marketing-slate)]">
                {label}
                <span className="ml-2 font-normal text-muted-foreground">({items.length})</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  pending={pending}
                  onApprove={approve}
                  onReject={reject}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

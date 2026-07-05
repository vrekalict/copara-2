"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2, Clock, Mail, Trash2, UserCheck, XCircle } from "lucide-react";
import {
  approvePartnerApplication,
  deletePartnerApplication,
  rejectPartnerApplication,
  resendPartnerApprovalEmail,
  type PartnerApplication,
} from "@/actions/pro/partner";
import { AdminCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_SECTIONS = [
  { key: "pending" as const, label: "Awaiting review", icon: Clock },
  { key: "approved" as const, label: "Approved", icon: CheckCircle2 },
  { key: "activated" as const, label: "Activated", icon: UserCheck },
  { key: "rejected" as const, label: "Rejected", icon: XCircle },
];

function formatSentAt(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ status }: { status: PartnerApplication["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        status === "pending" && "bg-amber-100 text-amber-900",
        status === "approved" && "bg-emerald-100 text-emerald-800",
        status === "activated" && "bg-sky-100 text-sky-900",
        status === "rejected" && "bg-slate-100 text-slate-700",
      )}
    >
      {status}
    </span>
  );
}

function EmailSendMeta({ app }: { app: PartnerApplication }) {
  if (app.status !== "approved" && app.status !== "activated") return null;

  const lastSent = formatSentAt(app.approvalEmailLastSentAt);
  const expires = app.approvalTokenExpiresAt
    ? new Date(app.approvalTokenExpiresAt).getTime() < Date.now()
    : false;

  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <Mail className="size-3.5 shrink-0" aria-hidden />
        Activation email sent {app.approvalEmailSentCount} time
        {app.approvalEmailSentCount === 1 ? "" : "s"}
        {app.approvalEmailSentCount === 0 ? " (not yet sent)" : ""}
      </span>
      {lastSent && <span>Last sent {lastSent}</span>}
      {app.status === "approved" && expires && (
        <span className="font-medium text-amber-800">Activation link expired — resend to issue a new link</span>
      )}
    </p>
  );
}

function ApplicationCard({
  app,
  pending,
  onApprove,
  onReject,
  onResend,
  onDelete,
}: {
  app: PartnerApplication;
  pending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onResend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const canDelete = app.status !== "activated";
  const canResend = app.status === "approved";

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
            {app.reviewedAt &&
              ` · Reviewed ${new Date(app.reviewedAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}`}
          </p>
          <EmailSendMeta app={app} />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[160px]">
          {app.status === "pending" && (
            <>
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
            </>
          )}
          {canResend && (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onResend(app.id)}
              className="min-h-10"
            >
              Resend activation email
            </Button>
          )}
          {canDelete && (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onDelete(app.id)}
              className="min-h-10 text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 size-4" aria-hidden />
              Delete
            </Button>
          )}
        </div>
      </div>
    </AdminCard>
  );
}

export function PartnerApplicationsPanel({
  applications,
}: {
  applications: PartnerApplication[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  function refresh() {
    router.refresh();
  }

  function approve(id: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await approvePartnerApplication(id);
      if ("error" in result && result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }
      if (result.emailSent === false) {
        setFeedback({
          type: "error",
          message: `Approved, but email was not sent: ${result.emailError ?? "Unknown error"}. Use Resend activation email after fixing RESEND_API_KEY.`,
        });
      } else {
        setFeedback({
          type: "success",
          message: `Approved and activation email sent (${result.sendCount ?? 1} total).`,
        });
      }
      refresh();
    });
  }

  function reject(id: string) {
    const reason = window.prompt("Optional rejection reason for your records:");
    if (reason === null) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await rejectPartnerApplication(id, reason || undefined);
      if ("error" in result && result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }
      setFeedback({ type: "success", message: "Application rejected." });
      refresh();
    });
  }

  function resend(id: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await resendPartnerApprovalEmail(id);
      if ("error" in result && result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }
      setFeedback({
        type: "success",
        message: `Activation email sent (${result.sendCount} time${result.sendCount === 1 ? "" : "s"} total).`,
      });
      refresh();
    });
  }

  function remove(id: string) {
    const confirmed = window.confirm(
      "Delete this partner application? This cannot be undone.",
    );
    if (!confirmed) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await deletePartnerApplication(id);
      if ("error" in result && result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }
      setFeedback({ type: "success", message: "Application deleted." });
      refresh();
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
    <div className="space-y-6">
      {feedback && (
        <AdminCard
          className={cn(
            "py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-destructive/30 bg-destructive/5 text-destructive",
          )}
        >
          {feedback.message}
        </AdminCard>
      )}

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
                    onResend={resend}
                    onDelete={remove}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

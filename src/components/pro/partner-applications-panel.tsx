"use client";

import { useTransition } from "react";
import { approvePartnerApplication, rejectPartnerApplication } from "@/actions/pro/partner";
import type { PartnerApplication } from "@/actions/pro/partner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">No partner applications yet.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {app.firstName} {app.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{app.email}</p>
              <p className="mt-2 text-sm">
                {app.practice} · {app.location}
              </p>
              {app.message && (
                <p className="mt-2 text-sm text-muted-foreground">{app.message}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Applied {new Date(app.createdAt).toLocaleString()} · Status: {app.status}
              </p>
            </div>
            {app.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => approve(app.id)}
                  className="min-h-10"
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => reject(app.id)}
                  className="min-h-10"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

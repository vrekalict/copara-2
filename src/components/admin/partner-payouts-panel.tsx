"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  markPartnerReferralPaid,
  revertPartnerReferralToEligible,
  updatePartnerReferralBonusAmount,
  updatePartnerReferralPayoutNotes,
} from "@/actions/admin/partner-payouts";
import type { AdminReferralPayout } from "@/lib/admin/partner-payouts";
import { AdminCard } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "owed", label: "Owed" },
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "ineligible", label: "Ineligible" },
  { key: "all", label: "All" },
] as const;

function formatMoney(amount: number | null) {
  if (amount == null) return "—";
  return `$${amount.toFixed(2)} CAD`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-CA", { dateStyle: "medium" });
}

function partnerLabel(payout: AdminReferralPayout) {
  return payout.partnerPracticeName ?? payout.partnerReferralSlug ?? payout.professionalId.slice(0, 8);
}

function PayoutRow({
  payout,
  pending,
  onDone,
}: {
  payout: AdminReferralPayout;
  pending: boolean;
  onDone: () => void;
}) {
  const [notes, setNotes] = useState(payout.notes ?? "");
  const [amount, setAmount] = useState(
    payout.bonusAmountCad != null ? String(payout.bonusAmountCad) : "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMarkPaid() {
    setMessage(null);
    setError(null);
    const result = await markPartnerReferralPaid(payout.id, notes);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Marked paid.");
    onDone();
  }

  async function handleRevert() {
    setMessage(null);
    setError(null);
    const result = await revertPartnerReferralToEligible(payout.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Reverted to owed.");
    onDone();
  }

  async function handleSaveNotes() {
    setMessage(null);
    setError(null);
    const result = await updatePartnerReferralPayoutNotes(payout.id, notes);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Notes saved.");
    onDone();
  }

  async function handleSaveAmount() {
    setMessage(null);
    setError(null);
    const parsed = Number.parseFloat(amount);
    const result = await updatePartnerReferralBonusAmount(payout.id, parsed);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Amount updated.");
    onDone();
  }

  return (
    <AdminCard className="space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--marketing-slate)]">{partnerLabel(payout)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Referred: {payout.referredName ?? payout.referredEmail}
            {payout.referredName ? ` · ${payout.referredEmail}` : ""}
          </p>
          {payout.partnerReferralSlug && (
            <p className="mt-1 text-xs text-muted-foreground">/r/{payout.partnerReferralSlug}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              payout.bonusStatus === "eligible" && "bg-amber-100 text-amber-900",
              payout.bonusStatus === "paid" && "bg-emerald-100 text-emerald-800",
              payout.bonusStatus === "pending" && "bg-slate-100 text-slate-700",
              payout.bonusStatus === "ineligible" && "bg-slate-100 text-slate-600",
            )}
          >
            {payout.bonusStatus}
          </span>
          <span className="rounded-full bg-[var(--marketing-mist)] px-2.5 py-1 text-xs font-medium text-muted-foreground capitalize">
            {payout.referralStatus}
          </span>
        </div>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bonus</dt>
          <dd className="mt-1 font-semibold tabular-nums text-[var(--marketing-slate)]">
            {formatMoney(payout.bonusAmountCad)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Subscribed</dt>
          <dd className="mt-1">{formatDate(payout.subscribedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Paid out</dt>
          <dd className="mt-1">{formatDate(payout.bonusPaidAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">First invoice</dt>
          <dd className="mt-1 tabular-nums">
            {payout.firstInvoiceCents != null
              ? `$${(payout.firstInvoiceCents / 100).toFixed(2)}`
              : "—"}
          </dd>
        </div>
      </dl>

      {payout.bonusIneligibleReason && (
        <p className="text-sm text-muted-foreground">{payout.bonusIneligibleReason}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`notes-${payout.id}`}>Admin notes</Label>
          <textarea
            id={`notes-${payout.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--marketing-border)] bg-background px-3 py-2 text-sm"
            placeholder="E-transfer reference, payment date, internal notes…"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={handleSaveNotes}
          >
            Save notes
          </Button>
        </div>

        {(payout.bonusStatus === "eligible" ||
          payout.bonusStatus === "paid" ||
          payout.bonusStatus === "pending") && (
          <div className="space-y-2">
            <Label htmlFor={`amount-${payout.id}`}>Bonus amount (CAD)</Label>
            <div className="flex gap-2">
              <Input
                id={`amount-${payout.id}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                className="max-w-[160px]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={handleSaveAmount}
              >
                Update amount
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {payout.bonusStatus === "eligible" && (
          <Button type="button" disabled={pending} onClick={handleMarkPaid}>
            Mark paid
          </Button>
        )}
        {payout.bonusStatus === "paid" && (
          <Button type="button" variant="outline" disabled={pending} onClick={handleRevert}>
            Revert to owed
          </Button>
        )}
      </div>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </AdminCard>
  );
}

export function PartnerPayoutsPanel({
  payouts,
  summary,
  filter,
}: {
  payouts: AdminReferralPayout[];
  summary: {
    owedCount: number;
    owedTotalCad: number;
    paidCount: number;
    paidTotalCad: number;
  };
  filter: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const activeFilter = useMemo(() => {
    const match = FILTERS.find((f) => f.key === filter);
    return match?.key ?? "owed";
  }, [filter]);

  function setFilter(next: (typeof FILTERS)[number]["key"]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "owed") {
      params.delete("filter");
    } else {
      params.set("filter", next);
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  }

  function refresh() {
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total owed</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--marketing-slate)]">
            {formatMoney(summary.owedTotalCad)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.owedCount} eligible {summary.owedCount === 1 ? "payout" : "payouts"}
          </p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total paid</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--marketing-slate)]">
            {formatMoney(summary.paidTotalCad)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.paidCount} completed {summary.paidCount === 1 ? "payout" : "payouts"}
          </p>
        </AdminCard>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeFilter === item.key
                ? "bg-[var(--marketing-navy)] text-white"
                : "bg-[var(--marketing-mist)]/60 text-muted-foreground hover:text-[var(--marketing-slate)]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {payouts.length === 0 ? (
        <AdminCard>
          <p className="text-sm text-muted-foreground">No referrals in this view.</p>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <PayoutRow key={payout.id} payout={payout} pending={pending} onDone={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

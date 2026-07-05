"use client";

import { useActionState } from "react";
import { submitProPartnerApplication } from "@/actions/pro/referrals";
import { PROVINCES } from "@/lib/marketing/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRACTICES = [
  { value: "mediator", label: "Mediator" },
  { value: "family_lawyer", label: "Family lawyer" },
  { value: "parenting_coordinator", label: "Parenting coordinator" },
  { value: "therapist", label: "Therapist / counsellor" },
  { value: "social_worker", label: "Social worker" },
  { value: "other", label: "Other professional" },
] as const;

export function ProAccessForm() {
  const [state, action, pending] = useActionState(submitProPartnerApplication, null);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="font-semibold">Application received.</p>
        <p className="mt-2 text-sm leading-relaxed">
          We will review your professional partner request and email you with next steps for
          dashboard access and your referral link.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="pro-email">Email</Label>
        <Input id="pro-email" name="email" type="email" required autoComplete="email" className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pro-first-name">First name</Label>
        <Input id="pro-first-name" name="firstName" required autoComplete="given-name" className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pro-last-name">Last name</Label>
        <Input id="pro-last-name" name="lastName" required autoComplete="family-name" className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pro-location">Province / territory</Label>
        <select
          id="pro-location"
          name="location"
          required
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Select…</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="pro-practice">Practice</Label>
        <select
          id="pro-practice"
          name="practice"
          required
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Select…</option>
          {PRACTICES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="pro-message">Why Copara? (optional)</Label>
        <textarea
          id="pro-message"
          name="message"
          rows={4}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          placeholder="Tell us about your practice and how you support separated families…"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive sm:col-span-2" role="alert">
          {state.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending} className="min-h-11 w-full sm:w-auto">
          {pending ? "Submitting…" : "Request my free professional access"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { submitEarlyAccess } from "@/actions/marketing/early-access";
import {
  LegalAcceptanceFields,
  QuebecPaidSignupBlocked,
} from "@/components/legal/legal-acceptance-fields";
import { QuebecWaitlistForm } from "@/components/legal/quebec-waitlist-form";
import { canQuebecPaidSignup, isQuebecProvince } from "@/lib/legal/config";
import { PROVINCES } from "@/lib/marketing/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES = [
  { value: "parent", label: "Parent" },
  { value: "mediator", label: "Mediator" },
  { value: "family_lawyer", label: "Family lawyer" },
  { value: "parenting_coordinator", label: "Parenting coordinator" },
  { value: "other", label: "Other" },
] as const;

const INTERESTS = [
  { value: "parent_app", label: "Parent app" },
  { value: "professional_dashboard", label: "Professional dashboard" },
  { value: "both", label: "Both" },
] as const;

export function EarlyAccessForm({ defaultRole }: { defaultRole?: string }) {
  const [state, action, pending] = useActionState(submitEarlyAccess, null);
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");

  const isQuebecBlocked =
    isQuebecProvince(province) && !canQuebecPaidSignup();

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="font-semibold">Thank you. We received your interest.</p>
        <p className="mt-2 text-sm leading-relaxed">
          {state.message ??
            "We will email you when early access opens for your province. No spam, just launch updates."}
        </p>
      </div>
    );
  }

  if (isQuebecBlocked) {
    return (
      <div className="flex flex-col gap-6">
        <QuebecPaidSignupBlocked />
        <QuebecWaitlistForm defaultEmail={email || undefined} />
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" className="min-h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="min-h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Your role</Label>
          <select
            id="role"
            name="role"
            required
            defaultValue={defaultRole ?? "parent"}
            className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="province">Province / territory</Label>
          <select
            id="province"
            name="province"
            required
            value={province}
            onChange={(e) => setProvince(e.target.value)}
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
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="interest">Interested in</Label>
        <select
          id="interest"
          name="interest"
          required
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm"
        >
          {INTERESTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message (optional)</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          placeholder="Tell us about your co-parenting situation or professional practice…"
        />
      </div>

      {province && (
        <LegalAcceptanceFields province={province} idPrefix="early-access" />
      )}

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending || !province}
        className="min-h-11 w-full sm:w-auto"
      >
        {pending ? "Submitting…" : "Request early access"}
      </Button>
    </form>
  );
}

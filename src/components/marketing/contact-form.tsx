"use client";

import { useActionState } from "react";
import { submitContact } from "@/actions/marketing/contact";
import { SITE } from "@/lib/marketing/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="font-semibold">Message received.</p>
        <p className="mt-2 text-sm">
          We saved your message and will respond at{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" name="name" required className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" name="email" type="email" required className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" name="subject" required className="min-h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="min-h-11">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

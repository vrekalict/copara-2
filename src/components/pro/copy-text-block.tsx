"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyTextBlock({
  title,
  description,
  text,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  description?: string;
  text: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/30 p-5">
      <p className="font-semibold text-[var(--marketing-slate)]">{title}</p>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--marketing-border)] bg-white p-3 text-xs leading-relaxed text-muted-foreground">
        {text}
      </pre>
      <Button type="button" variant="outline" onClick={copy} className="mt-3 min-h-10">
        {copied ? copiedLabel : copyLabel}
      </Button>
    </div>
  );
}

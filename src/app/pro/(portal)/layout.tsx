import Link from "next/link";
import { redirect } from "next/navigation";
import { marketingFont } from "@/lib/fonts/marketing";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedPartner } from "@/lib/pro/partner";
import { ProPortalHeader } from "@/components/pro/pro-portal-shell";
import { cn } from "@/lib/utils";

function ProAccessMessage({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className={cn("pro-portal-shell flex min-h-svh flex-col", marketingFont.variable)}>
      <ProPortalHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-4 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--marketing-slate)]">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <Link
          href={ctaHref}
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-[var(--marketing-navy)] px-5 text-sm font-medium text-white hover:bg-[var(--marketing-navy-soft)]"
        >
          {ctaLabel}
        </Link>
      </main>
    </div>
  );
}

export default async function ProPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/pro");
  }

  const access = await requireApprovedPartner(supabase, user.id, user.email);
  if (!access.ok) {
    if (access.reason === "pending") {
      return (
        <ProAccessMessage
          title="Application under review"
          description="Your partner application is pending approval. We will email you when your dashboard access is ready."
          ctaHref="/professionals#request-access"
          ctaLabel="View partner program"
        />
      );
    }

    return (
      <ProAccessMessage
        title="Partner access required"
        description="The professional dashboard is available to approved Copara partners only. Request access first — we will email you an activation link after review."
        ctaHref="/professionals#request-access"
        ctaLabel="Request partner access"
      />
    );
  }

  return (
    <div
      className={cn(
        "pro-portal-shell min-h-svh bg-[var(--marketing-cream)] text-foreground",
        marketingFont.variable,
      )}
    >
      {children}
    </div>
  );
}

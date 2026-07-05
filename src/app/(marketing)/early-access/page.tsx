import { redirect } from "next/navigation";

export default async function EarlyAccessRedirect({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; role?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const next = new URLSearchParams();

  if (params.ref) next.set("ref", params.ref);
  if (params.plan) next.set("plan", params.plan);
  if (params.role === "professional") {
    redirect("/professionals#apply");
  }

  redirect(next.size > 0 ? `/sign-up?${next.toString()}` : "/sign-up");
}

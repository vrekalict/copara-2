import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account/billing");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b px-4 py-3">
        <Link href="/app" className="text-sm font-medium text-primary hover:underline">
          ← Back to Copara
        </Link>
      </header>
      {children}
    </div>
  );
}

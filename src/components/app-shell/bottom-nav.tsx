"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MessageSquare, CalendarDays, Wallet, ShieldCheck, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app/messages", labelKey: "messages", Icon: MessageSquare },
  { href: "/app/calendar", labelKey: "calendar", Icon: CalendarDays },
  { href: "/app/expenses", labelKey: "expenses", Icon: Wallet },
  { href: "/app/vault", labelKey: "vault", Icon: ShieldCheck },
  { href: "/app/more", labelKey: "more", Icon: Menu },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex">
        {items.map(({ href, labelKey, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-xs",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

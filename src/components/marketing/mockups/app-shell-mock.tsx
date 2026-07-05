import {
  CalendarDays,
  Menu,
  MessageSquare,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "messages", label: "Messages", Icon: MessageSquare },
  { key: "calendar", label: "Calendar", Icon: CalendarDays },
  { key: "expenses", label: "Expenses", Icon: Wallet },
  { key: "vault", label: "Vault", Icon: ShieldCheck },
  { key: "more", label: "More", Icon: Menu },
] as const;

export type AppNavKey = (typeof NAV_ITEMS)[number]["key"];

export function AppTopBarMock() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 text-foreground">
      <span className="text-base font-semibold">Copara</span>
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
          A
        </span>
      </div>
    </header>
  );
}

export function AppBottomNavMock({ active = "messages" }: { active?: AppNavKey }) {
  return (
    <nav className="border-t border-border bg-background" aria-hidden>
      <ul className="flex">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <li key={key} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs">
            <Icon
              className={cn(
                "size-5",
                active === key ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                active === key ? "font-medium text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppPageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-lg font-semibold text-foreground">{children}</h1>;
}

export function AppSectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-medium text-muted-foreground">{children}</h2>;
}

export function AppCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>{children}</div>
  );
}

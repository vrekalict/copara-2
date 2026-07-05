import { cn } from "@/lib/utils";
import { AppBottomNavMock, AppTopBarMock, type AppNavKey } from "./app-shell-mock";

export function PhoneFrame({
  children,
  className,
  label,
  activeNav = "messages",
  readable = false,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  activeNav?: AppNavKey;
  readable?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[300px] lg:max-w-[340px]", className)}>
      <div
        className="overflow-hidden rounded-[2rem] border-[7px] border-slate-800 bg-slate-800 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.45)]"
        role="img"
        aria-label={label}
      >
        <div className="flex h-6 items-center justify-center bg-slate-800">
          <div className="h-1 w-16 rounded-full bg-slate-600" />
        </div>
        <div className={cn("app-preview bg-background", readable && "app-preview--readable")}>
          <AppTopBarMock />
          {children}
          <AppBottomNavMock active={activeNav} />
        </div>
        <div className="h-5 bg-slate-800" />
      </div>
    </div>
  );
}

export function DesktopAppFrame({
  children,
  className,
  label,
  activeNav = "messages",
  readable = false,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  activeNav?: AppNavKey;
  readable?: boolean;
}) {
  return (
    <div className={cn("desktop-app-frame mx-auto w-full max-w-lg", className)}>
      <div
        className="overflow-hidden rounded-xl border border-[var(--marketing-border)] bg-white shadow-[0_32px_80px_-40px_rgba(15,23,42,0.35)]"
        role="img"
        aria-label={label}
      >
        <div className="flex items-center gap-2 border-b border-border bg-neutral-100 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-sm font-medium text-neutral-600">copara.ca/app</span>
        </div>
        <div
          className={cn(
            "desktop-app-frame__screen app-preview overflow-hidden bg-white",
            readable && "app-preview--readable",
          )}
        >
          <AppTopBarMock />
          <div className="desktop-app-frame__body overflow-y-auto">{children}</div>
          <AppBottomNavMock active={activeNav} />
        </div>
      </div>
    </div>
  );
}

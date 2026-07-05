"use client";

import { Button } from "@/components/ui/button";
import {
  AppCard,
  AppPageTitle,
  AppSectionLabel,
} from "./app-shell-mock";
import { DesktopAppFrame, PhoneFrame } from "./phone-frame";

function MessagesScreenContent() {
  return (
    <div className="flex min-h-[400px] flex-col bg-white">
      <div className="border-b border-border px-4 py-2 text-right">
        <span className="inline-flex size-8 items-center justify-center rounded-md border border-border text-neutral-500">
          ···
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-3 p-4">
        <li className="max-w-[88%] self-start rounded-2xl bg-neutral-100 px-4 py-3 text-[15px] leading-snug text-neutral-900">
          Can we move Friday pickup to 4:30? I have a work call until 4.
        </li>
        <li className="max-w-[88%] self-end rounded-2xl bg-neutral-900 px-4 py-3 text-[15px] leading-snug text-white">
          You always change plans last minute.
        </li>
      </ul>
      <div className="flex flex-col gap-2 border-t border-border bg-neutral-50 px-4 py-3 text-[15px]">
        <p className="text-neutral-800">
          Tone:{" "}
          <span className="font-semibold capitalize text-amber-700">Tense</span>
        </p>
        <p className="font-medium text-neutral-600">Suggestions</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal border-neutral-300 bg-white px-3 py-2 text-left text-[14px] leading-snug text-neutral-900"
        >
          I&apos;d prefer we stick to 4:00 if possible. If 4:30 works better, please
          confirm by Wednesday.
        </Button>
      </div>
      <div className="flex gap-2 border-t border-border bg-white p-4">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-neutral-600">
          +
        </span>
        <div className="h-10 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-[15px] leading-10 text-neutral-500">
          Type a message...
        </div>
        <Button size="sm" className="h-10 shrink-0 px-4">
          Send
        </Button>
      </div>
    </div>
  );
}

function CalendarScreenContent() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <AppPageTitle>Calendar</AppPageTitle>
      <section className="flex flex-col gap-3">
        <AppSectionLabel>Upcoming</AppSectionLabel>
        <ul className="flex flex-col divide-y divide-border">
          <li className="flex flex-col gap-2 py-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">Parenting time · Alex</p>
                <p className="text-sm text-muted-foreground">
                  Fri, Mar 14, 3:00 PM · Parenting time
                </p>
                <p className="text-sm text-muted-foreground">School parking lot</p>
              </div>
              <Button type="button" size="sm" variant="outline">
                Check in
              </Button>
            </div>
          </li>
        </ul>
      </section>
      <AppCard>
        <h2 className="font-medium">Schedule templates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Apply a preset pattern to generate recurring events.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <select className="h-8 rounded-lg border border-border bg-background px-2 text-sm">
            <option>Week on / week off</option>
          </select>
          <Button type="button" size="sm">
            Save template
          </Button>
        </div>
      </AppCard>
      <section className="flex flex-col gap-3">
        <AppSectionLabel>Change requests</AppSectionLabel>
        <div className="rounded-lg border border-border p-3 text-sm">
          <p className="font-medium">Friday exchange · Swap day</p>
          <p className="text-muted-foreground">Move Saturday exchange to 10 AM</p>
          <p className="capitalize text-muted-foreground">Pending</p>
          <div className="mt-2 flex gap-2">
            <Button type="button" size="sm">
              Approve
            </Button>
            <Button type="button" size="sm" variant="outline">
              Decline
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ExpensesPhoneContent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <AppPageTitle>Expenses</AppPageTitle>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        To balance the account, Jordan owes you <strong>$214.50</strong>
      </div>
      <ul className="flex flex-col gap-3">
        <li className="rounded-lg border border-border p-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Soccer registration</p>
              <p className="text-muted-foreground">Activities · $180.00 · Split 50/50</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="button" size="sm" variant="outline" className="flex-1">
              Decline
            </Button>
            <Button type="button" size="sm" className="flex-1">
              Approve
            </Button>
          </div>
        </li>
        <li className="rounded-lg border border-border p-3 text-sm">
          <p className="font-semibold text-foreground">Prescription refill</p>
          <p className="text-muted-foreground">Medical · $42.00</p>
          <p className="mt-1 text-emerald-700">Approved</p>
        </li>
      </ul>
    </div>
  );
}

function ExpensesDashboardPanel() {
  const categories = [
    { label: "Activities", pct: 52, amount: "$324" },
    { label: "Medical", pct: 28, amount: "$174" },
    { label: "School", pct: 20, amount: "$124" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-[var(--marketing-border)] bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Reports by category</p>
        <p className="mt-1 text-2xl font-bold text-slate-heading">$622.00</p>
        <p className="text-sm text-muted-foreground">Last 90 days in your circle</p>
      </div>
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-foreground">{cat.label}</span>
              <span className="text-muted-foreground">{cat.amount}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">Balance due</p>
        <p className="mt-1 text-xl font-bold text-slate-heading">$214.50</p>
        <p className="mt-1 text-sm text-muted-foreground">Jordan owes Alex</p>
        <Button type="button" variant="outline" size="sm" className="mt-3">
          Request reimbursement
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <Button type="button" variant="outline" size="sm">
          Export PDF
        </Button>
      </div>
    </div>
  );
}

function JournalScreenContent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <AppPageTitle>Journal</AppPageTitle>
        <p className="mt-1 text-sm text-muted-foreground">Circle updates for both parents</p>
      </div>
      <ul className="flex flex-col gap-3">
        <li className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-primary">Alex · Today</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            First day back at school went well. Maya said she liked her new teacher.
          </p>
        </li>
        <li className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-primary">Jordan · Yesterday</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            &ldquo;Dad, the cat tried to steal my toast again.&rdquo; Thought you would want the report.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-square rounded-md bg-neutral-100" />
            ))}
          </div>
        </li>
      </ul>
      <Button type="button" className="w-full">
        New journal entry
      </Button>
    </div>
  );
}

function AlbumsScreenContent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <AppPageTitle>Albums</AppPageTitle>
        <p className="mt-1 text-sm text-muted-foreground">Private to your co-parenting circle</p>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="font-medium text-foreground">Spring soccer</p>
        <p className="text-sm text-muted-foreground">12 photos · Updated 2 days ago</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square rounded-md bg-neutral-200" />
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Button type="button" size="sm" variant="outline">
            Download
          </Button>
          <Button type="button" size="sm" variant="outline">
            Share in circle
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExportsScreenContent() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-xl font-semibold">Exports & summaries</h1>
        <p className="text-sm text-muted-foreground">
          Generate tamper-evident PDFs and AI dispute summaries.
        </p>
      </div>
      <AppCard className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Export type</label>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>Message thread export</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">From</label>
            <input type="date" className="h-10 rounded-md border border-input px-3 text-sm" readOnly defaultValue="2026-03-01" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">To</label>
            <input type="date" className="h-10 rounded-md border border-input px-3 text-sm" readOnly defaultValue="2026-04-30" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked readOnly />
          Pickup thread
        </label>
        <Button type="button">Generate export</Button>
      </AppCard>
    </div>
  );
}

function VaultScreenContent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Vault</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Medical, school, and emergency info per child
        </p>
      </div>
      <div className="rounded-xl border border-border p-4">
        <p className="font-medium">Maya</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Medical: Peanut allergy. EpiPen in backpack.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          School: Ms. Chen, Room 204
        </p>
        <p className="mt-3 text-xs text-primary underline">Immunization record.pdf</p>
      </div>
    </div>
  );
}

export function MessagesMockup({
  variant = "phone",
  readable = false,
}: {
  variant?: "phone" | "desktop";
  readable?: boolean;
}) {
  const content = <MessagesScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame
        label="Copara messages with Steady Send tone review"
        activeNav="messages"
        readable={readable}
        className={readable ? "max-w-xl" : undefined}
      >
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara messages with Steady Send tone review" activeNav="messages" readable={readable}>
      {content}
    </PhoneFrame>
  );
}

export function CalendarMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <CalendarScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara shared custody calendar" activeNav="calendar">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara shared custody calendar" activeNav="calendar">
      {content}
    </PhoneFrame>
  );
}

export function ExpensesMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <ExpensesPhoneContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara shared expenses" activeNav="expenses">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara shared expenses" activeNav="expenses">
      {content}
    </PhoneFrame>
  );
}

export function ExpensesMarketingVisual() {
  return (
    <div className="grid items-end gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <PhoneFrame label="Copara expense approvals on mobile" activeNav="expenses" readable className="lg:-rotate-2">
        <ExpensesPhoneContent />
      </PhoneFrame>
      <ExpensesDashboardPanel />
    </div>
  );
}

export function JournalMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <JournalScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara circle journal" activeNav="more">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara circle journal" activeNav="more">
      {content}
    </PhoneFrame>
  );
}

export function AlbumsMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <AlbumsScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara private photo albums" activeNav="more">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara private photo albums" activeNav="more">
      {content}
    </PhoneFrame>
  );
}

export function ExportsMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <ExportsScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara tamper-evident exports" activeNav="more">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara tamper-evident exports" activeNav="more">
      {content}
    </PhoneFrame>
  );
}

export function VaultMockup({ variant = "phone" }: { variant?: "phone" | "desktop" }) {
  const content = <VaultScreenContent />;
  if (variant === "desktop") {
    return (
      <DesktopAppFrame label="Copara child info vault" activeNav="vault">
        {content}
      </DesktopAppFrame>
    );
  }
  return (
    <PhoneFrame label="Copara child info vault" activeNav="vault">
      {content}
    </PhoneFrame>
  );
}

export function HeroAppPreview() {
  return <MessagesMockup variant="desktop" readable />;
}

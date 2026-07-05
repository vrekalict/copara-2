import Link from "next/link";
import { Scale, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const PATHS = [
  {
    icon: Users,
    eyebrow: "For parents",
    title: "Coordinate without turning every thread into a fight",
    body: "Neutral messaging, shared schedules, expense tracking, and organized exports in one Canadian-focused workspace.",
    href: "/early-access",
    cta: "Join early access",
    featured: true,
  },
  {
    icon: Scale,
    eyebrow: "For professionals",
    title: "Read permitted records without sorting screenshots",
    body: "Design partner access for mediators, family lawyers, and parenting coordinators. Dual-parent invites and read-only visibility where permitted.",
    href: "/professionals",
    cta: "Professional access",
    featured: false,
  },
];

export function AudiencePaths() {
  return (
    <div className="audience-paths">
      {PATHS.map((path) => (
        <Link
          key={path.eyebrow}
          href={path.href}
          className={cn(
            "audience-path group",
            path.featured && "audience-path--featured",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <path.icon className="size-5" aria-hidden />
          </div>
          <p className="eyebrow mt-6">{path.eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-heading sm:text-2xl">
            {path.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {path.body}
          </p>
          <span className="mt-6 text-sm font-semibold text-primary">{path.cta} →</span>
        </Link>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogCategory } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { cn } from "@/lib/utils";

const ALL = "All" as const;

export function BlogCategoryNav({ active }: { active: BlogCategory | typeof ALL }) {
  const searchParams = useSearchParams();

  function hrefFor(category: BlogCategory | typeof ALL) {
    if (category === ALL) return "/blog";
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    return `/blog?${params.toString()}`;
  }

  const items: (BlogCategory | typeof ALL)[] = [ALL, ...BLOG_CATEGORIES];

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item}
          href={hrefFor(item)}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
            active === item
              ? "border-primary bg-primary text-primary-foreground"
              : "border-[var(--marketing-border)] bg-background text-muted-foreground hover:text-foreground",
          )}
          aria-current={active === item ? "page" : undefined}
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}

export { ALL as BLOG_CATEGORY_ALL };

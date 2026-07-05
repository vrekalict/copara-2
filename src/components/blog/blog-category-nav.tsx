"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BLOG_CATEGORIES, BLOG_CATEGORY_ALL } from "@/lib/blog/constants";
import type { BlogCategory } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

export function BlogCategoryNav({ active }: { active: BlogCategory | typeof BLOG_CATEGORY_ALL }) {
  const searchParams = useSearchParams();

  function hrefFor(category: BlogCategory | typeof BLOG_CATEGORY_ALL) {
    if (category === BLOG_CATEGORY_ALL) return "/blog";
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    return `/blog?${params.toString()}`;
  }

  const items: (BlogCategory | typeof BLOG_CATEGORY_ALL)[] = [BLOG_CATEGORY_ALL, ...BLOG_CATEGORIES];

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

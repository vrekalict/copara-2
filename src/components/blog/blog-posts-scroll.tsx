"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "./blog-card";
import { cn } from "@/lib/utils";

const CARD_GAP_PX = 20;

export function BlogPostsScroll({ posts }: { posts: BlogPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, posts.length]);

  function scrollBy(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-blog-card]");
    const step = card ? card.offsetWidth + CARD_GAP_PX : 340;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (posts.length === 0) return null;

  const showControls = posts.length > 1;

  return (
    <div className="relative">
      {showControls && canScrollLeft && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-mist to-transparent"
          aria-hidden
        />
      )}
      {showControls && canScrollRight && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-mist to-transparent"
          aria-hidden
        />
      )}

      {showControls && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll to previous posts"
            className={cn(
              "absolute left-0 top-[calc(50%-1.5rem)] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--marketing-border)] bg-white text-[var(--marketing-slate)] shadow-md transition-opacity hover:bg-white/95 sm:flex",
              !canScrollLeft && "pointer-events-none opacity-0",
            )}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Scroll to next posts"
            className={cn(
              "absolute right-0 top-[calc(50%-1.5rem)] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--marketing-border)] bg-white text-[var(--marketing-slate)] shadow-md transition-opacity hover:bg-white/95 sm:flex",
              !canScrollRight && "pointer-events-none opacity-0",
            )}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className="-mx-5 flex gap-5 overflow-x-auto overscroll-x-contain px-5 pb-3 scroll-smooth snap-x snap-mandatory sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {posts.map((post) => (
          <div
            key={post.slug}
            data-blog-card
            role="listitem"
            className="w-[min(82vw,340px)] shrink-0 snap-start sm:w-[340px]"
          >
            <BlogCard post={post} className="h-full" />
          </div>
        ))}
      </div>

      {showControls && canScrollRight && (
        <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">
          Swipe for more articles
        </p>
      )}
    </div>
  );
}

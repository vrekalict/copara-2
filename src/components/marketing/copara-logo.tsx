"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LOGO_DISPLAY,
  logoSrc,
  type LogoLayout,
  type LogoVariant,
} from "@/lib/brand/assets";
import { cn } from "@/lib/utils";

function CoparaLogoSvg({
  variant,
  className,
}: {
  variant: LogoVariant;
  className?: string;
}) {
  const markFill = variant === "light" ? "white" : "var(--marketing-navy)";
  const textClass =
    variant === "light" ? "text-white" : "text-[var(--marketing-navy)]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          fill={variant === "light" ? "white" : "var(--marketing-accent)"}
          fillOpacity={variant === "light" ? "0.12" : "1"}
        />
        <circle cx="12" cy="16" r="5.5" stroke={markFill} strokeWidth="2" fill="none" />
        <circle cx="20" cy="16" r="5.5" stroke={markFill} strokeWidth="2" fill="none" />
        <path
          d="M12 16h8"
          stroke={variant === "light" ? "var(--marketing-accent-light)" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("text-xl font-semibold tracking-tight", textClass)}>Copara</span>
    </span>
  );
}

export function CoparaLogo({
  className,
  variant = "dark",
  layout = "desktop",
  priority = false,
}: {
  className?: string;
  /** `dark` = navy logo on light backgrounds; `light` = white logo on navy backgrounds. */
  variant?: LogoVariant;
  layout?: LogoLayout;
  priority?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(false);
  const src = logoSrc(variant, layout);
  const { width, height } = LOGO_DISPLAY[layout];

  if (useFallback) {
    return <CoparaLogoSvg variant={variant} className={className} />;
  }

  return (
    <span className={cn("relative inline-flex shrink-0 items-center", className)}>
      <Image
        src={src}
        alt="Copara"
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "h-9 w-auto max-w-[10rem] object-contain object-left",
          layout === "mobile" && "h-9 max-w-9",
        )}
        onError={() => setUseFallback(true)}
      />
    </span>
  );
}

/** App shell / compact mark (no wordmark). Falls back to SVG icon only on mobile layout. */
export function CoparaMark({
  className,
  variant = "dark",
  priority = false,
}: {
  className?: string;
  variant?: LogoVariant;
  priority?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(false);
  const src = variant === "light" ? "/brand/mark-light.png" : "/brand/mark-dark.png";
  const { width, height } = LOGO_DISPLAY.mark;

  if (useFallback) {
    return <CoparaLogoSvg variant={variant} className={className} />;
  }

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Image
        src={src}
        alt="Copara"
        width={width}
        height={height}
        priority={priority}
        className="size-8 object-contain"
        onError={() => setUseFallback(true)}
      />
    </span>
  );
}

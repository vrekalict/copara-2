/** Brand hex values aligned with marketing CSS tokens in globals.css */
export const BRAND_COLORS = {
  navy: "#111439",
  teal: "#5BA89F",
  tealLight: "#8EC4BE",
  white: "#FFFFFF",
} as const;

export function CoparaMarkSvg({
  size,
  variant = "header",
}: {
  size: number;
  variant?: "header" | "app";
}) {
  const { navy, teal, tealLight, white } = BRAND_COLORS;
  const isHeader = variant === "header";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect
        width="32"
        height="32"
        rx="8"
        fill={isHeader ? white : teal}
        fillOpacity={isHeader ? 0.12 : 1}
      />
      <circle
        cx="12"
        cy="16"
        r="5.5"
        stroke={isHeader ? white : navy}
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="20"
        cy="16"
        r="5.5"
        stroke={isHeader ? white : navy}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 16h8"
        stroke={isHeader ? tealLight : white}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppIconMark({
  size,
  maskable = false,
}: {
  size: number;
  maskable?: boolean;
}) {
  const inset = maskable ? size * 0.14 : 0;
  const markSize = size - inset * 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.navy,
      }}
    >
      <CoparaMarkSvg size={markSize} variant="header" />
    </div>
  );
}

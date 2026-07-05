import { ImageResponse } from "next/og";
import { SITE } from "@/lib/marketing/site";

export const runtime = "edge";
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg, #f0f4f8 0%, #faf9f6 50%, #ffffff 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <span style={{ fontSize: 36, fontWeight: 600, color: "#334155" }}>
            {SITE.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#1e293b",
            lineHeight: 1.15,
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          Co-parenting communication, made calmer and clearer.
        </p>
        <p style={{ fontSize: 24, color: "#64748b", marginTop: 24, maxWidth: 800 }}>
          Canadian co-parenting · English + French · Tamper-evident records
        </p>
      </div>
    ),
    { ...size },
  );
}

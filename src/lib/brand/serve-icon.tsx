import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { AppIconMark } from "@/lib/app-icon";

export async function serveBrandIcon(
  publicPath: string,
  fallbackSize: number,
  maskable = false,
) {
  const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  try {
    const buffer = await readFile(filePath);
    return new Response(buffer, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return new ImageResponse(<AppIconMark size={fallbackSize} maskable={maskable} />, {
      width: fallbackSize,
      height: fallbackSize,
    });
  }
}

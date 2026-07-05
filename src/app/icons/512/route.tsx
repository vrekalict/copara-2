import { BRAND_ASSETS } from "@/lib/brand/assets";
import { serveBrandIcon } from "@/lib/brand/serve-icon";

export const runtime = "nodejs";

export async function GET() {
  return serveBrandIcon(BRAND_ASSETS.icons.pwa512, 512);
}

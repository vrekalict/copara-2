import { BRAND_ASSETS } from "@/lib/brand/assets";
import { serveBrandIcon } from "@/lib/brand/serve-icon";

export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return serveBrandIcon(BRAND_ASSETS.icons.apple180, 180);
}

import { BRAND_ASSETS } from "@/lib/brand/assets";
import { serveBrandIcon } from "@/lib/brand/serve-icon";

export const runtime = "nodejs";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  return serveBrandIcon(BRAND_ASSETS.icons.favicon32, 32);
}

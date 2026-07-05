import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  buildStaffPath,
  getStaffBasePath,
  isInternalStaffPath,
  isStaffRequestPath,
  staffPathToInternal,
} from "@/lib/admin/staff-path";
import { pathRequiresLegalAcceptance, userHasLegalAcceptance } from "@/lib/auth/legal-gate";

function redirectWwwToCanonicalHost(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host");
  if (!host?.startsWith("www.")) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://copara.ca";
  let canonicalHost: string;
  try {
    canonicalHost = new URL(siteUrl).host;
  } catch {
    return null;
  }

  if (host !== `www.${canonicalHost}`) return null;

  const url = request.nextUrl.clone();
  url.host = canonicalHost;
  url.protocol = "https:";
  return NextResponse.redirect(url, 308);
}

export async function updateSession(request: NextRequest) {
  const wwwRedirect = redirectWwwToCanonicalHost(request);
  if (wwwRedirect) return wwwRedirect;

  const pathname = request.nextUrl.pathname;

  // Never expose internal /admin URLs — staff tools use COPARA_STAFF_PATH only.
  if (isInternalStaffPath(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const staffRoute = isStaffRequestPath(pathname);
  const internalPath = staffRoute ? staffPathToInternal(pathname) : pathname;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiresAuth =
    internalPath.startsWith("/app") ||
    internalPath.startsWith("/onboarding") ||
    internalPath.startsWith("/subscribe") ||
    internalPath.startsWith("/account") ||
    internalPath.startsWith("/admin") ||
    internalPath === "/complete-signup";

  if (!user && requiresAuth) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user && internalPath === "/complete-signup") {
    const hasLegal = await userHasLegalAcceptance(supabase, user.id);
    if (hasLegal) {
      const next = request.nextUrl.searchParams.get("next");
      const destination = next?.startsWith("/") ? next : "/app";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  if (user && pathRequiresLegalAcceptance(internalPath)) {
    const hasLegal = await userHasLegalAcceptance(supabase, user.id);
    if (!hasLegal) {
      const completeUrl = new URL("/complete-signup", request.url);
      completeUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(completeUrl);
    }
  }

  if (staffRoute && getStaffBasePath()) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    for (const cookie of response.cookies.getAll()) {
      rewriteResponse.cookies.set(cookie);
    }
    return rewriteResponse;
  }

  return response;
}

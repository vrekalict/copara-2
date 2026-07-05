import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getStaffBasePath,
  isInternalStaffPath,
  isStaffRequestPath,
  staffPathToInternal,
} from "@/lib/admin/staff-path";

export async function updateSession(request: NextRequest) {
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
    internalPath.startsWith("/admin");

  if (!user && requiresAuth) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (staffRoute && getStaffBasePath()) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    response.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });
    return rewriteResponse;
  }

  return response;
}

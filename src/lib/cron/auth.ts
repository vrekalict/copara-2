export function verifyCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return { ok: false as const, status: 503, error: "Cron not configured." };
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  return { ok: true as const };
}

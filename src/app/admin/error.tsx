"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        The page could not load. If you were uploading a cover image, try a file under 5 MB.
        Otherwise confirm <code className="text-xs">COPARA_ADMIN_EMAILS</code> and{" "}
        <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> are set on Vercel, then redeploy.
      </p>
      {isDev && error.message && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error.message}
        </p>
      )}
      {error.digest && (
        <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-10 w-fit items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Try again
      </button>
    </main>
  );
}

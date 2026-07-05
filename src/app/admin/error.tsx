"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Staff tools error</h1>
      <p className="text-sm text-muted-foreground">
        The admin page could not load. Confirm{" "}
        <code className="text-xs">COPARA_STAFF_PATH</code>,{" "}
        <code className="text-xs">COPARA_ADMIN_EMAILS</code>, and{" "}
        <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> are set on Vercel, then redeploy.
      </p>
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

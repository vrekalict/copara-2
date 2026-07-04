export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted-foreground">
        Accord couldn&apos;t reach the server. Messages you send now will be
        queued and delivered once you&apos;re back online.
      </p>
    </main>
  );
}

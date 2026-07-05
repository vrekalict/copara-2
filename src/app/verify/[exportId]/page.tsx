import { VerifyExportView } from "@/components/exports/verify-export-view";

export default async function VerifyExportPage({
  params,
}: {
  params: Promise<{ exportId: string }>;
}) {
  const { exportId } = await params;

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col gap-6 px-6 py-12">
      <VerifyExportView exportId={exportId} />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Braces, ChevronDown, ChevronUp, FileJson } from "lucide-react";
import { importBlogPostsFromJson } from "@/actions/admin/blog";
import { AdminCard, AdminInfoBox } from "@/components/admin/admin-shell";
import { BLOG_IMPORT_SAMPLE } from "@/lib/blog/parse-import";
import { Button } from "@/components/ui/button";

export function BlogJsonImport() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [json, setJson] = useState("");
  const [result, setResult] = useState<
    | {
        type: "success";
        imported: number;
        updated: number;
        skipped: number;
        failed: { slug: string; error: string }[];
      }
    | { type: "error"; message: string }
    | null
  >(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setJson(String(reader.result ?? ""));
      setResult(null);
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function loadSample() {
    setJson(JSON.stringify(BLOG_IMPORT_SAMPLE, null, 2));
    setResult(null);
  }

  function handleImport() {
    startTransition(async () => {
      setResult(null);
      const response = await importBlogPostsFromJson(json);

      if (!response.ok) {
        setResult({ type: "error", message: response.error });
        return;
      }

      setResult({
        type: "success",
        imported: response.imported,
        updated: response.updated,
        skipped: response.skipped,
        failed: response.failed,
      });

      if (response.imported > 0 || response.updated > 0) {
        setJson("");
        router.refresh();
      }
    });
  }

  return (
    <AdminCard className="p-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left sm:p-6"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--marketing-teal)]/10">
            <Braces className="size-4 text-[var(--marketing-teal)]" aria-hidden />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--marketing-slate)]">Import from JSON</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Bulk-import or re-import posts from ChatGPT. Matching slugs update existing posts.
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--marketing-border)] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <AdminInfoBox title="Expected format">
            <p className="mb-2">A JSON array of posts, or a single post object. Required fields per post:</p>
            <code className="block whitespace-pre-wrap rounded-md bg-white/80 p-2 text-xs leading-relaxed text-foreground">
              title, slug, excerpt, seoDescription, category, body, publishedAt (YYYY-MM-DD), status
              (&quot;draft&quot; | &quot;published&quot;), featured (boolean), author (optional)
            </code>
            <p className="mt-2">
              Categories: Communication, Schedules, Expenses, Records, Professionals. Body supports
              markdown: <code className="text-xs">## headings</code>,{" "}
              <code className="text-xs">**bold**</code>, <code className="text-xs">- bullets</code>, and{" "}
              <code className="text-xs">[links](url)</code>. Re-uploading the same slug overwrites that
              post; cover images uploaded in the CMS are kept unless you replace them manually.
            </p>
          </AdminInfoBox>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={loadSample}>
              Load sample JSON
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <FileJson className="mr-2 size-4" aria-hidden />
              Upload .json file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <textarea
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setResult(null);
            }}
            rows={12}
            placeholder='[{"title": "...", "slug": "...", ...}]'
            className="w-full rounded-xl border border-input bg-white px-3 py-2 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />

          {result?.type === "error" && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {result.message}
            </p>
          )}

          {result?.type === "success" && (
            <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <p>
                {result.imported > 0 && (
                  <>
                    Created <strong>{result.imported}</strong>
                  </>
                )}
                {result.imported > 0 && result.updated > 0 && " · "}
                {result.updated > 0 && (
                  <>
                    Updated <strong>{result.updated}</strong>
                  </>
                )}
                {result.imported === 0 && result.updated === 0 && result.failed.length === 0 && (
                  <>No changes made.</>
                )}
                {result.skipped > 0 && (
                  <>
                    {" "}
                    · skipped <strong>{result.skipped}</strong>
                  </>
                )}
                {result.failed.length > 0 && (
                  <>
                    {" "}
                    · failed <strong>{result.failed.length}</strong>
                  </>
                )}
              </p>
              {result.failed.length > 0 && (
                <ul className="list-disc pl-4 text-xs">
                  {result.failed.map((item) => (
                    <li key={item.slug}>
                      {item.slug}: {item.error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Button type="button" disabled={isPending || !json.trim()} onClick={handleImport}>
            {isPending ? "Importing…" : "Import posts"}
          </Button>
        </div>
      )}
    </AdminCard>
  );
}

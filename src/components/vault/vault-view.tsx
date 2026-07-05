"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { FileText, X } from "lucide-react";
import { addChild } from "@/actions/children";
import {
  createVaultDocument,
  deleteVaultDocument,
  updateChildVault,
} from "@/actions/vault";
import { createClient } from "@/lib/supabase/client";
import {
  VAULT_FILE_BUCKET,
  formatEmergencyContacts,
  isAllowedVaultFile,
  vaultFileStoragePath,
} from "@/lib/vault-files";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ChildRow = {
  id: string;
  first_name: string;
  notes_medical: string | null;
  notes_school: string | null;
  emergency_contacts: { name?: string; phone?: string }[] | null;
};

type VaultItemRow = {
  id: string;
  child_id: string | null;
  title: string;
  file_url: string | null;
  visibility: { roles?: string[] } | null;
  created_at: string;
};

type ActionState = { error?: string; success?: boolean } | null;

function VaultDocumentLink({ path, title }: { path: string; title: string }) {
  const t = useTranslations("vault");
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.storage
      .from(VAULT_FILE_BUCKET)
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  const isImage =
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".png") ||
    path.endsWith(".gif") ||
    path.endsWith(".webp");

  if (!url) {
    return <span className="text-xs text-muted-foreground">{t("loadingFile")}</span>;
  }

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={title}
          className="mt-1 max-h-24 rounded-md border border-border object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary underline"
    >
      <FileText className="size-3" />
      {t("viewDocument")}
    </a>
  );
}

function ChildVaultSection({
  circleId,
  child,
  documents,
}: {
  circleId: string;
  child: ChildRow;
  documents: VaultItemRow[];
}) {
  const t = useTranslations("vault");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [profileState, profileAction, profilePending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await updateChildVault(formData)) ?? null,
    null,
  );

  const [docState, docAction, docPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await createVaultDocument(formData)) ?? null;
      if (result?.success) {
        setUploadFile(null);
        setFilePath(null);
        setUploadError(null);
      }
      return result;
    },
    null,
  );

  const [, deleteAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await deleteVaultDocument(formData);
      return null;
    },
    null,
  );

  async function handleFileSelect(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setUploadError(null);

    const allowed = isAllowedVaultFile(file);
    if (!allowed.ok) {
      setUploadError(
        allowed.reason === "too_large" ? t("fileTooLarge") : t("fileType"),
      );
      return;
    }

    setUploading(true);
    setUploadFile(file);

    try {
      const path = vaultFileStoragePath(circleId, file);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(VAULT_FILE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadError(error.message);
        setUploadFile(null);
        setFilePath(null);
        return;
      }

      setFilePath(path);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearFile() {
    setUploadFile(null);
    setFilePath(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <section className="rounded-xl border border-border p-4">
      <h2 className="text-base font-semibold">{child.first_name}</h2>

      <form action={profileAction} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="circleId" value={circleId} />
        <input type="hidden" name="childId" value={child.id} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`medical-${child.id}`}>{t("medicalNotes")}</Label>
          <textarea
            id={`medical-${child.id}`}
            name="notesMedical"
            rows={3}
            defaultValue={child.notes_medical ?? ""}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`school-${child.id}`}>{t("schoolNotes")}</Label>
          <textarea
            id={`school-${child.id}`}
            name="notesSchool"
            rows={3}
            defaultValue={child.notes_school ?? ""}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`emergency-${child.id}`}>{t("emergencyContacts")}</Label>
          <textarea
            id={`emergency-${child.id}`}
            name="emergencyContacts"
            rows={3}
            placeholder={t("emergencyPlaceholder")}
            defaultValue={formatEmergencyContacts(child.emergency_contacts)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        {profileState?.error && (
          <p className="text-sm text-destructive">{profileState.error}</p>
        )}
        {profileState?.success && (
          <p className="text-sm text-green-600">{t("saved")}</p>
        )}

        <Button type="submit" size="sm" disabled={profilePending} className="self-start">
          {profilePending ? t("saving") : t("saveProfile")}
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{t("documents")}</h3>
        {documents.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("noDocuments")}</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{doc.title}</p>
                  {doc.visibility?.roles?.includes("professional") && (
                    <p className="text-xs text-muted-foreground">{t("sharedWithPro")}</p>
                  )}
                  {doc.file_url && (
                    <VaultDocumentLink path={doc.file_url} title={doc.title} />
                  )}
                </div>
                <form action={deleteAction}>
                  <input type="hidden" name="itemId" value={doc.id} />
                  <Button type="submit" size="sm" variant="outline">
                    {t("delete")}
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={docAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <input type="hidden" name="childId" value={child.id} />
          <input type="hidden" name="filePath" value={filePath ?? ""} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`doc-title-${child.id}`}>{t("documentTitle")}</Label>
            <Input id={`doc-title-${child.id}`} name="title" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`doc-file-${child.id}`}>{t("documentFile")}</Label>
            <input
              ref={fileInputRef}
              id={`doc-file-${child.id}`}
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              className="text-sm"
              onChange={(e) => void handleFileSelect(e.target.files)}
              disabled={uploading}
            />
            {uploadFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="truncate">{uploadFile.name}</span>
                <button type="button" onClick={clearFile} aria-label={t("removeFile")}>
                  <X className="size-4" />
                </button>
              </div>
            )}
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="shareWithProfessional" />
            {t("shareWithProfessional")}
          </label>

          {docState?.error && <p className="text-sm text-destructive">{docState.error}</p>}
          {docState?.success && <p className="text-sm text-green-600">{t("documentAdded")}</p>}

          <Button
            type="submit"
            size="sm"
            disabled={docPending || uploading || (uploadFile !== null && !filePath)}
            className="self-start"
          >
            {docPending ? t("saving") : t("addDocument")}
          </Button>
        </form>
      </div>
    </section>
  );
}

function CircleDocumentsSection({
  circleId,
  documents,
}: {
  circleId: string;
  documents: VaultItemRow[];
}) {
  const t = useTranslations("vault");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [docState, docAction, docPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = (await createVaultDocument(formData)) ?? null;
      if (result?.success) {
        setUploadFile(null);
        setFilePath(null);
        setUploadError(null);
      }
      return result;
    },
    null,
  );

  const [, deleteAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await deleteVaultDocument(formData);
      return null;
    },
    null,
  );

  async function handleFileSelect(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setUploadError(null);

    const allowed = isAllowedVaultFile(file);
    if (!allowed.ok) {
      setUploadError(
        allowed.reason === "too_large" ? t("fileTooLarge") : t("fileType"),
      );
      return;
    }

    setUploading(true);
    setUploadFile(file);

    try {
      const path = vaultFileStoragePath(circleId, file);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(VAULT_FILE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) {
        setUploadError(error.message);
        setUploadFile(null);
        setFilePath(null);
        return;
      }

      setFilePath(path);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-xl border border-border p-4">
      <h2 className="text-base font-semibold">{t("circleDocuments")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("circleDocumentsHint")}</p>

      {documents.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-start justify-between gap-2 rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">{doc.title}</p>
                {doc.file_url && (
                  <VaultDocumentLink path={doc.file_url} title={doc.title} />
                )}
              </div>
              <form action={deleteAction}>
                <input type="hidden" name="itemId" value={doc.id} />
                <Button type="submit" size="sm" variant="outline">
                  {t("delete")}
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={docAction} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="circleId" value={circleId} />
        <input type="hidden" name="filePath" value={filePath ?? ""} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="circle-doc-title">{t("documentTitle")}</Label>
          <Input id="circle-doc-title" name="title" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="circle-doc-file">{t("documentFile")}</Label>
          <input
            ref={fileInputRef}
            id="circle-doc-file"
            type="file"
            accept="image/*,application/pdf,.doc,.docx"
            className="text-sm"
            onChange={(e) => void handleFileSelect(e.target.files)}
            disabled={uploading}
          />
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        </div>

        {docState?.error && <p className="text-sm text-destructive">{docState.error}</p>}

        <Button
          type="submit"
          size="sm"
          disabled={docPending || uploading || (uploadFile !== null && !filePath)}
          className="self-start"
        >
          {docPending ? t("saving") : t("addDocument")}
        </Button>
      </form>
    </section>
  );
}

export function VaultView({
  circleId,
  children,
  vaultItems,
}: {
  circleId: string;
  children: ChildRow[];
  vaultItems: VaultItemRow[];
}) {
  const t = useTranslations("vault");

  const [addState, addAction, addPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await addChild(formData)) ?? null,
    null,
  );

  const circleDocs = vaultItems.filter((item) => !item.child_id);

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div>
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {children.length === 0 && (
        <section className="rounded-xl border border-dashed border-border p-4">
          <h2 className="font-medium">{t("addChildTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("addChildHint")}</p>
          <form action={addAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <input type="hidden" name="circleId" value={circleId} />
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="firstName">{t("firstName")}</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="dob">{t("dob")}</Label>
              <Input id="dob" name="dob" type="date" />
            </div>
            <Button type="submit" disabled={addPending}>
              {addPending ? t("saving") : t("addChild")}
            </Button>
          </form>
          {addState?.error && <p className="mt-2 text-sm text-destructive">{addState.error}</p>}
        </section>
      )}

      {children.map((child) => (
        <ChildVaultSection
          key={child.id}
          circleId={circleId}
          child={child}
          documents={vaultItems.filter((item) => item.child_id === child.id)}
        />
      ))}

      <CircleDocumentsSection circleId={circleId} documents={circleDocs} />
    </div>
  );
}

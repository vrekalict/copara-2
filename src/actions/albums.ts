"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ALBUM_PHOTOS_BUCKET,
  isValidAlbumPhotoPath,
} from "@/lib/album-photos";

export async function createAlbum(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!circleId || !title) return { error: "Enter an album title." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: album, error } = await supabase
    .from("albums")
    .insert({
      circle_id: circleId,
      title,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !album) return { error: error?.message ?? "Could not create album." };

  revalidatePath("/app/albums");
  return { success: true, albumId: album.id };
}

export async function addAlbumPhoto(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const albumId = String(formData.get("albumId") ?? "");
  const filePath = String(formData.get("filePath") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!circleId || !albumId || !filePath) {
    return { error: "Photo file is required." };
  }

  if (!isValidAlbumPhotoPath(filePath, circleId, albumId)) {
    return { error: "Invalid photo path." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .eq("circle_id", circleId)
    .maybeSingle();
  if (!album) return { error: "Album not found." };

  const { data: fileCheck, error: fileError } = await supabase.storage
    .from(ALBUM_PHOTOS_BUCKET)
    .createSignedUrl(filePath, 60);
  if (fileError || !fileCheck?.signedUrl) {
    return { error: "Photo not found. Upload again." };
  }

  const mime = filePath.toLowerCase().endsWith(".png")
    ? "image/png"
    : filePath.toLowerCase().endsWith(".gif")
      ? "image/gif"
      : filePath.toLowerCase().endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

  const { error } = await supabase.from("album_photos").insert({
    album_id: albumId,
    circle_id: circleId,
    file_path: filePath,
    mime,
    caption,
    uploaded_by: user.id,
  });

  if (error) return { error: error.message };

  await supabase
    .from("albums")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", albumId);

  revalidatePath("/app/albums");
  revalidatePath(`/app/albums/${albumId}`);
  return { success: true };
}

export async function deleteAlbumPhoto(formData: FormData) {
  const photoId = String(formData.get("photoId") ?? "");
  const albumId = String(formData.get("albumId") ?? "");
  if (!photoId) return { error: "Missing photo." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: photo } = await supabase
    .from("album_photos")
    .select("file_path, album_id")
    .eq("id", photoId)
    .maybeSingle();

  if (!photo) return { error: "Photo not found." };

  await supabase.storage.from(ALBUM_PHOTOS_BUCKET).remove([photo.file_path]);

  const { error } = await supabase.from("album_photos").delete().eq("id", photoId);
  if (error) return { error: error.message };

  await supabase
    .from("albums")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", photo.album_id);

  revalidatePath("/app/albums");
  if (albumId) revalidatePath(`/app/albums/${albumId}`);
  return { success: true };
}

export async function deleteAlbum(formData: FormData) {
  const albumId = String(formData.get("albumId") ?? "");
  if (!albumId) return { error: "Missing album." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: photos } = await supabase
    .from("album_photos")
    .select("file_path")
    .eq("album_id", albumId);

  const paths = (photos ?? []).map((p) => p.file_path).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from(ALBUM_PHOTOS_BUCKET).remove(paths);
  }

  const { error } = await supabase.from("albums").delete().eq("id", albumId);
  if (error) return { error: error.message };

  revalidatePath("/app/albums");
  redirect("/app/albums");
}

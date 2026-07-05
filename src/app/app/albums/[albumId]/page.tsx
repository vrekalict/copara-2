import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { AlbumDetailView } from "@/components/albums/album-detail-view";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, album_photos(id, file_path, mime, caption)")
    .eq("id", albumId)
    .eq("circle_id", circle.circleId)
    .maybeSingle();

  if (!album) notFound();

  const photos = Array.isArray(album.album_photos) ? album.album_photos : [];

  return (
    <AlbumDetailView
      circleId={circle.circleId}
      albumId={album.id}
      title={album.title}
      photos={photos as Parameters<typeof AlbumDetailView>[0]["photos"]}
    />
  );
}

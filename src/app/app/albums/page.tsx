import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { AlbumsView } from "@/components/albums/albums-view";

export default async function AlbumsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const { data: albums } = await supabase
    .from("albums")
    .select("id, title, updated_at, album_photos(id, file_path, created_at)")
    .eq("circle_id", circle.circleId)
    .order("updated_at", { ascending: false });

  const summaries = (albums ?? []).map((album) => {
    const photos = Array.isArray(album.album_photos) ? album.album_photos : [];
    const sorted = [...photos].sort(
      (a, b) =>
        new Date(b.created_at as string).getTime() -
        new Date(a.created_at as string).getTime(),
    );
    return {
      id: album.id,
      title: album.title,
      updated_at: album.updated_at,
      photo_count: photos.length,
      cover_path: (sorted[0]?.file_path as string | undefined) ?? null,
    };
  });

  return <AlbumsView circleId={circle.circleId} albums={summaries} />;
}

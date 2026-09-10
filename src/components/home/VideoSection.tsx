import { getDb } from "@/lib/db";
import { normalizeGalleryItems } from "@/lib/youtube";
import HomeVideoGallery from "./HomeVideoGallery";

/** Homepage videos from admin gallery (Videos tab). Hidden when empty. */
export default async function VideoSection() {
  const db = await getDb();
  const videos = normalizeGalleryItems(db.gallery || [])
    .filter((item) => item.type === "video")
    .slice(0, 4); // newest first (gallery unshifts on add)
  if (!videos.length) return null;
  return <HomeVideoGallery videos={videos} variant="home" />;
}

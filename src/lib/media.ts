/** Detect video media from URL or File. */

/** Host-only YouTube check (avoids circular import with youtube.ts). */
export function isYouTubeMediaUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  const s = String(src).trim().toLowerCase();
  if (!s) return false;
  return (
    s.includes("youtube.com/") ||
    s.includes("youtu.be/") ||
    s.includes("youtube-nocookie.com/") ||
    /^[a-z0-9_-]{11}$/i.test(s.trim())
  );
}

export function isVideoUrl(src: string | null | undefined): boolean {
  if (!src) return false;
  const s = String(src).trim().toLowerCase();
  if (!s) return false;
  if (s.startsWith("data:video/")) return true;
  if (isYouTubeMediaUrl(src)) return true;
  if (s.includes("/video/") || s.includes("video%2f")) return true;
  return /\.(mp4|webm|ogg|ogv|mov|m4v|avi|mkv)(\?|#|$)/i.test(s);
}

export function isVideoFile(file: File | null | undefined): boolean {
  return Boolean(file?.type?.startsWith("video/"));
}

/** Prefer first image for OG / list thumbnails; fall back to first media. */
export function getPrimaryImage(media: string[] | null | undefined, fallback = "/product.webp"): string {
  const list = Array.isArray(media) ? media.filter(Boolean) : [];
  const image = list.find((src) => !isVideoUrl(src));
  return image || list[0] || fallback;
}

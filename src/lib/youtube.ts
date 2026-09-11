import { isVideoUrl } from "@/lib/media";

export type GalleryMediaType = "image" | "video";

export type GalleryItem = {
  id: string;
  url: string;
  date: string;
  type: GalleryMediaType;
  youtubeUrl?: string;
  youtubeId?: string;
};

/** Gallery uploaded videos must stay under 10MB. */
export const GALLERY_VIDEO_MAX_BYTES = 10 * 1024 * 1024;

/** Parse YouTube watch / youtu.be / Shorts / embed / live URLs (or bare 11-char ids). */
export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    const parts = url.pathname.split("/").filter(Boolean);
    const markers = ["shorts", "embed", "live", "v"];
    for (let i = 0; i < parts.length - 1; i++) {
      if (markers.includes(parts[i].toLowerCase())) {
        const id = parts[i + 1];
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
    }
  }

  return null;
}

export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(id: string, opts?: { autoplay?: boolean; mute?: boolean }): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  // Default autoplay on (gallery lightbox); product gallery passes autoplay explicitly
  if (opts?.autoplay !== false) {
    params.set("autoplay", "1");
  }
  if (opts?.mute === true) {
    params.set("mute", "1");
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function isYouTubeShort(item: GalleryItem | null | undefined): boolean {
  if (!item?.youtubeId) return false;
  const u = String(item.youtubeUrl || "").toLowerCase();
  return u.includes("/shorts/");
}

export function normalizeGalleryItem(raw: unknown): GalleryItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = String(item.id || "").trim();
  if (!id) return null;

  const youtubeUrl = item.youtubeUrl != null ? String(item.youtubeUrl).trim() : "";
  const youtubeIdRaw =
    item.youtubeId != null ? String(item.youtubeId).trim() : "";
  const parsedId =
    (youtubeIdRaw && /^[a-zA-Z0-9_-]{11}$/.test(youtubeIdRaw) ? youtubeIdRaw : null) ||
    parseYouTubeId(youtubeUrl);

  const url = String(item.url || "").trim();
  const explicitVideo = String(item.type || "").toLowerCase() === "video";
  const wantsVideo =
    explicitVideo || Boolean(youtubeUrl && parsedId) || (url && isVideoUrl(url));

  if (wantsVideo) {
    if (parsedId) {
      return {
        id,
        type: "video",
        youtubeId: parsedId,
        youtubeUrl: youtubeUrl || youtubeWatchUrl(parsedId),
        url: url || youtubeThumb(parsedId),
        date: String(item.date || "").trim() || new Date().toISOString().split("T")[0],
      };
    }
    if (url) {
      return {
        id,
        type: "video",
        url,
        date: String(item.date || "").trim() || new Date().toISOString().split("T")[0],
      };
    }
    return null;
  }

  if (!url) return null;

  return {
    id,
    type: "image",
    url,
    date: String(item.date || "").trim() || new Date().toISOString().split("T")[0],
  };
}

export function normalizeGalleryItems(raw: unknown): GalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeGalleryItem).filter((x): x is GalleryItem => Boolean(x));
}

export function isGalleryVideo(item: GalleryItem | null | undefined): boolean {
  return item?.type === "video";
}

export function isYouTubeGalleryVideo(item: GalleryItem | null | undefined): boolean {
  return item?.type === "video" && Boolean(item.youtubeId);
}

export function isFileGalleryVideo(item: GalleryItem | null | undefined): boolean {
  return item?.type === "video" && !item.youtubeId && Boolean(item.url);
}

/** Normalize product.videos into gallery-compatible video items for the storefront. */
export function normalizeProductVideos(raw: unknown): GalleryItem[] {
  if (!Array.isArray(raw)) return [];
  const out: GalleryItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const id = String(item.id || "").trim() || Math.random().toString(36).slice(2, 10);
    const youtubeUrl = item.youtubeUrl != null ? String(item.youtubeUrl).trim() : "";
    const youtubeId =
      (item.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(String(item.youtubeId))
        ? String(item.youtubeId)
        : null) || parseYouTubeId(youtubeUrl);
    const url = String(item.url || "").trim();

    if (youtubeId) {
      out.push({
        id,
        type: "video",
        youtubeId,
        youtubeUrl: youtubeUrl || youtubeWatchUrl(youtubeId),
        url: url || youtubeThumb(youtubeId),
        date: "",
      });
      continue;
    }
    if (url) {
      out.push({
        id,
        type: "video",
        url,
        date: "",
      });
    }
  }
  return out;
}

/** Persist-ready product video from YouTube URL or uploaded file URL. */
export function buildProductVideo(input: {
  url?: string;
  youtubeUrl?: string;
  id?: string;
}): { id: string; url: string; youtubeUrl?: string; youtubeId?: string } | null {
  const id = String(input.id || "").trim() || Math.random().toString(36).slice(2, 10);
  const youtubeUrl = String(input.youtubeUrl || "").trim();
  const normalizedYt = youtubeUrl
    ? youtubeUrl.startsWith("http")
      ? youtubeUrl
      : `https://${youtubeUrl}`
    : "";
  const youtubeId = parseYouTubeId(normalizedYt) || parseYouTubeId(input.url);
  const url = String(input.url || "").trim();

  if (youtubeId) {
    return {
      id,
      youtubeId,
      youtubeUrl: normalizedYt || youtubeWatchUrl(youtubeId),
      url: youtubeThumb(youtubeId),
    };
  }
  if (url) {
    return { id, url };
  }
  return null;
}

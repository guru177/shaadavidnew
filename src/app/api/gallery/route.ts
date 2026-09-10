import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { isVideoUrl } from "@/lib/media";
import {
  normalizeGalleryItem,
  normalizeGalleryItems,
  parseYouTubeId,
  youtubeThumb,
  youtubeWatchUrl,
} from "@/lib/youtube";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(normalizeGalleryItems(db.gallery || []));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestedType = String(body?.type || "").toLowerCase();
    const youtubeUrl = String(body?.youtubeUrl || "").trim();
    const url = String(body?.url || "").trim();

    const youtubeId = parseYouTubeId(youtubeUrl) || parseYouTubeId(url);
    const isVideo =
      requestedType === "video" ||
      Boolean(youtubeUrl && youtubeId) ||
      (url && isVideoUrl(url));

    let newItem: Record<string, unknown>;

    if (isVideo) {
      if (youtubeId) {
        newItem = {
          id: Math.random().toString(36).substring(2, 10),
          type: "video",
          youtubeId,
          youtubeUrl: youtubeUrl || youtubeWatchUrl(youtubeId),
          url: youtubeThumb(youtubeId),
          date: new Date().toISOString().split("T")[0],
        };
      } else if (url) {
        newItem = {
          id: Math.random().toString(36).substring(2, 10),
          type: "video",
          url,
          date: new Date().toISOString().split("T")[0],
        };
      } else {
        return NextResponse.json(
          { error: "Upload a video file (max 10MB) or paste a YouTube / Shorts URL" },
          { status: 400 }
        );
      }
    } else {
      if (!url) {
        return NextResponse.json({ error: "URL required" }, { status: 400 });
      }
      newItem = {
        id: Math.random().toString(36).substring(2, 10),
        type: "image",
        url,
        date: new Date().toISOString().split("T")[0],
      };
    }

    const normalized = normalizeGalleryItem(newItem);
    if (!normalized) {
      return NextResponse.json({ error: "Invalid gallery item" }, { status: 400 });
    }

    const db = await getDb();
    if (!db.gallery) db.gallery = [];
    db.gallery.unshift(normalized);
    await saveDb(db);

    return NextResponse.json(normalized, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    if (!db.gallery) db.gallery = [];

    db.gallery = db.gallery.filter((g: { id?: string }) => g.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}

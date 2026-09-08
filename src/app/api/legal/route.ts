import { NextResponse } from "next/server";
import { getLegalPage, getLegalPages, saveLegalPage, saveLegalPages } from "@/lib/legal";
import { isLegalSlug } from "@/types/legal";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const page = getLegalPage(slug);
      if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(page);
    }
    return NextResponse.json(getLegalPages());
  } catch {
    return NextResponse.json({ error: "Failed to load legal pages" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body?.slug && isLegalSlug(body.slug)) {
      const saved = saveLegalPage({
        slug: body.slug,
        title: body.title,
        lastUpdated: body.lastUpdated,
        content: body.content,
      });
      return NextResponse.json(saved);
    }

    if (body && typeof body === "object") {
      return NextResponse.json(saveLegalPages(body));
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to save legal pages" }, { status: 500 });
  }
}

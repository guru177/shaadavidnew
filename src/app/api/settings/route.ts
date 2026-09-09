import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings";
import type { SiteSettings } from "@/types/settings";

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as SiteSettings;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }
    const saved = await saveSettings(body);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

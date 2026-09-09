import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  getAdminCredentials,
  setAdminSessionCookie,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    let creds: { username: string; password: string };
    try {
      creds = getAdminCredentials();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Admin auth is not configured for production.";
      return NextResponse.json({ error: message }, { status: 503 });
    }

    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, username });
    setAdminSessionCookie(res, username);
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}

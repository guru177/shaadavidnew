import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
};

export async function GET() {
  const db = await getDb();
  const list = (db.contactMessages || []) as ContactMessage[];
  // Newest first
  return NextResponse.json(
    [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (name.length > 120 || email.length > 180 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    const entry: ContactMessage = {
      id: `CM-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const db = await getDb();
    if (!db.contactMessages) db.contactMessages = [];
    db.contactMessages.unshift(entry);
    await saveDb(db);

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    if (!db.contactMessages) db.contactMessages = [];
    const index = db.contactMessages.findIndex((m: ContactMessage) => m.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (typeof body.read === "boolean") {
      db.contactMessages[index].read = body.read;
    }
    await saveDb(db);
    return NextResponse.json(db.contactMessages[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const idsBody = await request.json().catch(() => null);
    const ids: string[] = id
      ? [id]
      : Array.isArray(idsBody?.ids)
        ? idsBody.ids.map(String)
        : [];

    if (!ids.length) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDb();
    if (!db.contactMessages) db.contactMessages = [];
    const before = db.contactMessages.length;
    const idSet = new Set(ids);
    db.contactMessages = db.contactMessages.filter((m: ContactMessage) => !idSet.has(m.id));
    if (db.contactMessages.length === before) {
      return NextResponse.json({ error: "No matching messages" }, { status: 404 });
    }
    await saveDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MAX_BYTES = 80 * 1024 * 1024; // 80MB — product videos can be large
const ALLOWED_PREFIXES = ["image/", "video/"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mime = String(file.type || "");
    if (mime && !ALLOWED_PREFIXES.some((p) => mime.startsWith(p))) {
      return NextResponse.json(
        { error: "Only image or video files are allowed" },
        { status: 400 }
      );
    }

    if (typeof file.size === "number" && file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 80MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const finalFilename = `${uniqueSuffix}-${filename}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, finalFilename);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;

    return NextResponse.json(
      { url: publicUrl, type: mime.startsWith("video/") ? "video" : "image" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

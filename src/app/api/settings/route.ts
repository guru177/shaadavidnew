import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings, saveSettings, publicSettings } from "@/lib/settings";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminAuth";
import type { SiteSettings } from "@/types/settings";

async function isAdminRequest(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
    return Boolean(token && verifyAdminSessionToken(token));
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const settings = await getSettings();
    if (await isAdminRequest()) {
      return NextResponse.json(settings);
    }
    return NextResponse.json(publicSettings(settings));
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

    // Preserve existing secrets when client sends masked placeholders / empty leave-as-is UX
    const current = await getSettings();
    const next: SiteSettings = {
      ...body,
      razorpay: {
        keyId: body.razorpay?.keyId ?? "",
        keySecret:
          body.razorpay?.keySecret === "••••••••"
            ? current.razorpay.keySecret
            : (body.razorpay?.keySecret ?? "").trim(),
      },
      aiTutor: {
        groqApiKey:
          body.aiTutor?.groqApiKey === "••••••••"
            ? current.aiTutor?.groqApiKey || ""
            : (body.aiTutor?.groqApiKey ?? "").trim(),
        geminiApiKey:
          body.aiTutor?.geminiApiKey === "••••••••"
            ? current.aiTutor?.geminiApiKey || ""
            : (body.aiTutor?.geminiApiKey ?? "").trim(),
      },
      email: {
        ...current.email,
        ...body.email,
        resendApiKey:
          body.email?.resendApiKey === "••••••••"
            ? current.email?.resendApiKey || ""
            : (body.email?.resendApiKey ?? "").trim(),
        emailFrom: (body.email?.emailFrom ?? "").trim(),
        customerEmailsEnabled: body.email?.customerEmailsEnabled !== false,
      },
      notifications: {
        ...current.notifications,
        ...body.notifications,
        callMeBotApiKey:
          body.notifications?.callMeBotApiKey === "••••••••"
            ? current.notifications?.callMeBotApiKey || ""
            : (body.notifications?.callMeBotApiKey ?? "").trim(),
        notifyEmail: (body.notifications?.notifyEmail ?? "").trim(),
        notifyWhatsApp: (body.notifications?.notifyWhatsApp ?? "").trim(),
        newOrderEmailEnabled: Boolean(body.notifications?.newOrderEmailEnabled),
        newOrderWhatsAppEnabled: Boolean(body.notifications?.newOrderWhatsAppEnabled),
      },
    };

    const saved = await saveSettings(next);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

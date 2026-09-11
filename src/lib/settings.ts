import { getDb, saveDb } from "@/lib/db";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/types/settings";

function mergeDeep<T extends Record<string, unknown>>(base: T, overlay?: Partial<T> | null): T {
  if (!overlay || typeof overlay !== "object") return { ...base };
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overlay) as (keyof T)[]) {
    const b = base[key];
    const o = overlay[key];
    if (
      b &&
      o &&
      typeof b === "object" &&
      typeof o === "object" &&
      !Array.isArray(b) &&
      !Array.isArray(o)
    ) {
      out[key as string] = mergeDeep(
        b as Record<string, unknown>,
        o as Record<string, unknown>
      );
    } else if (o !== undefined) {
      out[key as string] = o;
    }
  }
  return out as T;
}

export async function getSettings(): Promise<SiteSettings> {
  const db = await getDb();
  const raw = (db.settings || {}) as Partial<SiteSettings>;
  const merged = mergeDeep(DEFAULT_SETTINGS, raw);
  const savedTpl = (raw.whatsappTemplates || {}) as Partial<
    SiteSettings["whatsappTemplates"]
  >;
  // Legacy single template → Confirmed when Confirmed was never customized
  if (savedTpl.orderStatus && !savedTpl.confirmed) {
    merged.whatsappTemplates.confirmed = savedTpl.orderStatus;
  }
  // Migrate legacy default OG asset when still pointing at the old hero graphic
  const og = (merged.seo?.ogImage || "").trim();
  if (!og || og === "/hero-graphic.webp" || og === "hero-graphic.webp") {
    merged.seo.ogImage = "/og-image.png";
  }
  return merged;
}

export async function saveSettings(next: SiteSettings): Promise<SiteSettings> {
  const db = await getDb();
  const merged = mergeDeep(DEFAULT_SETTINGS, next);
  db.settings = merged;
  await saveDb(db);
  return merged;
}

/** Local mock keys for checkout testing without a Razorpay account */
export const RAZORPAY_LOCAL_TEST_KEY_ID = "rzp_test_ShaadavidLocal";
export const RAZORPAY_LOCAL_TEST_KEY_SECRET = "local_test_secret_shaadavid";

export async function getRazorpayKeyId(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return (
    s.razorpay.keyId?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    process.env.RAZORPAY_KEY_ID?.trim() ||
    ""
  );
}

export async function getRazorpayKeySecret(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return (
    s.razorpay.keySecret?.trim() ||
    process.env.RAZORPAY_KEY_SECRET?.trim() ||
    ""
  );
}

/** Admin settings override env when filled (same pattern as Razorpay). */
export async function getGroqApiKey(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return s.aiTutor?.groqApiKey?.trim() || process.env.GROQ_API_KEY?.trim() || "";
}

export async function getGeminiApiKey(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return s.aiTutor?.geminiApiKey?.trim() || process.env.GEMINI_API_KEY?.trim() || "";
}

/** Resend API key — Admin Settings override env when filled. */
export async function getResendApiKey(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return s.email?.resendApiKey?.trim() || process.env.RESEND_API_KEY?.trim() || "";
}

/** From address for transactional mail — settings override env. */
export async function getEmailFrom(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  return s.email?.emailFrom?.trim() || process.env.EMAIL_FROM?.trim() || "";
}

/** Strip server secrets before returning settings to anonymous clients. */
export function publicSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    razorpay: {
      keyId: settings.razorpay?.keyId || "",
      keySecret: "",
    },
    aiTutor: {
      groqApiKey: "",
      geminiApiKey: "",
    },
    email: {
      ...settings.email,
      resendApiKey: "",
    },
    notifications: {
      ...settings.notifications,
      callMeBotApiKey: "",
    },
  };
}

export async function isRazorpayLocalMock(settings?: SiteSettings): Promise<boolean> {
  const keyId = await getRazorpayKeyId(settings);
  const secret = await getRazorpayKeySecret(settings);
  return (
    Boolean(keyId && secret) &&
    keyId === RAZORPAY_LOCAL_TEST_KEY_ID &&
    secret === RAZORPAY_LOCAL_TEST_KEY_SECRET
  );
}

function isLocalHostUrl(url: string): boolean {
  try {
    const u = new URL(ensureAbsoluteOrigin(url));
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "0.0.0.0";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

/** Always return an origin with protocol (required by `new URL()` / metadataBase). */
function ensureAbsoluteOrigin(url: string): string {
  const raw = url.trim().replace(/\/$/, "");
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  // Host-only values from Admin / Vercel (e.g. shaadavid.vercel.app)
  if (/^localhost(?::\d+)?$/i.test(raw) || /^127\.0\.0\.1(?::\d+)?$/.test(raw)) {
    return `http://${raw}`;
  }
  return `https://${raw}`;
}

function normalizeSiteUrl(url: string): string {
  return ensureAbsoluteOrigin(url);
}

/**
 * Public site origin for absolute links / Open Graph.
 * Never emit localhost URLs in production — WhatsApp/Facebook cannot fetch them.
 */
export async function getSiteUrl(settings?: SiteSettings): Promise<string> {
  const s = settings || (await getSettings());
  const fromSettings = normalizeSiteUrl(s.siteUrl || "");
  const fromEnv = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "");
  const fromVercelProd = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL || "");
  const fromVercel = normalizeSiteUrl(process.env.VERCEL_URL || "");

  const candidates = [fromSettings, fromEnv, fromVercelProd, fromVercel];
  for (const c of candidates) {
    if (c && !isLocalHostUrl(c)) return c;
  }

  // Local dev only
  if (fromSettings) return fromSettings;
  if (fromEnv) return fromEnv;
  return "http://localhost:3000";
}

export { applyTemplate } from "@/lib/template";

export {
  formatPhoneDisplay,
  toTelHref,
  toWhatsAppHref,
  buildAddressLines,
} from "@/lib/contactFormat";

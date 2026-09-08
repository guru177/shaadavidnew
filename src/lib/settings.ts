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

export function getSettings(): SiteSettings {
  const db = getDb();
  const raw = (db.settings || {}) as Partial<SiteSettings>;
  const merged = mergeDeep(DEFAULT_SETTINGS, raw);
  const savedTpl = (raw.whatsappTemplates || {}) as Partial<
    SiteSettings["whatsappTemplates"]
  >;
  // Legacy single template → Confirmed when Confirmed was never customized
  if (savedTpl.orderStatus && !savedTpl.confirmed) {
    merged.whatsappTemplates.confirmed = savedTpl.orderStatus;
  }
  return merged;
}

export function saveSettings(next: SiteSettings): SiteSettings {
  const db = getDb();
  const merged = mergeDeep(DEFAULT_SETTINGS, next);
  db.settings = merged;
  saveDb(db);
  return merged;
}

/** Local mock keys for checkout testing without a Razorpay account */
export const RAZORPAY_LOCAL_TEST_KEY_ID = "rzp_test_ShaadavidLocal";
export const RAZORPAY_LOCAL_TEST_KEY_SECRET = "local_test_secret_shaadavid";

export function getRazorpayKeyId(settings?: SiteSettings): string {
  const s = settings || getSettings();
  return (
    s.razorpay.keyId?.trim() ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    process.env.RAZORPAY_KEY_ID?.trim() ||
    ""
  );
}

export function getRazorpayKeySecret(settings?: SiteSettings): string {
  const s = settings || getSettings();
  return (
    s.razorpay.keySecret?.trim() ||
    process.env.RAZORPAY_KEY_SECRET?.trim() ||
    ""
  );
}

export function isRazorpayLocalMock(settings?: SiteSettings): boolean {
  const keyId = getRazorpayKeyId(settings);
  const secret = getRazorpayKeySecret(settings);
  return (
    Boolean(keyId && secret) &&
    keyId === RAZORPAY_LOCAL_TEST_KEY_ID &&
    secret === RAZORPAY_LOCAL_TEST_KEY_SECRET
  );
}

export function getSiteUrl(settings?: SiteSettings): string {
  const s = settings || getSettings();
  return (s.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

export { applyTemplate } from "@/lib/template";

export {
  formatPhoneDisplay,
  toTelHref,
  toWhatsAppHref,
  buildAddressLines,
} from "@/lib/contactFormat";

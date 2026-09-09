/** Edge-safe admin session helpers (Web Crypto — usable from middleware). */

export const ADMIN_SESSION_COOKIE = "sda_admin_session";

const DEV_DEFAULT_SECRET = "shaadavid-dev-session-secret-change-me";
const encoder = new TextEncoder();

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

function getSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_SECRET?.trim();
  if (isProduction()) {
    if (!fromEnv || fromEnv === DEV_DEFAULT_SECRET) return null;
    return fromEnv;
  }
  return fromEnv || process.env.RAZORPAY_KEY_SECRET?.trim() || DEV_DEFAULT_SECRET;
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function verifyAdminSessionTokenEdge(
  token?: string | null
): Promise<{ username: string } | null> {
  if (!token) return null;
  try {
    const secret = getSecret();
    if (!secret) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [username, expStr, sig] = parts;
    const body = `${username}.${expStr}`;
    const expected = await hmacHex(secret, body);
    if (!timingSafeEqualHex(sig, expected)) return null;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return { username };
  } catch {
    return null;
  }
}

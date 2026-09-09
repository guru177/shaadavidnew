import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "sda_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

const DEV_DEFAULT_USER = "shadavid";
const DEV_DEFAULT_PASSWORD = "shadavid@123";
const DEV_DEFAULT_SECRET = "shaadavid-dev-session-secret-change-me";

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

function assertProductionSecrets() {
  if (!isProduction()) return;

  const user = process.env.ADMIN_USER?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!user || !password || !secret) {
    throw new Error(
      "Production requires ADMIN_USER, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET environment variables."
    );
  }
  if (user === DEV_DEFAULT_USER || password === DEV_DEFAULT_PASSWORD || secret === DEV_DEFAULT_SECRET) {
    throw new Error(
      "Production admin credentials must not use the development defaults. Set unique ADMIN_* values."
    );
  }
}

function getSecret() {
  assertProductionSecrets();
  if (isProduction()) {
    return process.env.ADMIN_SESSION_SECRET!.trim();
  }
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.RAZORPAY_KEY_SECRET?.trim() ||
    DEV_DEFAULT_SECRET
  );
}

export function getAdminCredentials() {
  assertProductionSecrets();
  if (isProduction()) {
    return {
      username: process.env.ADMIN_USER!.trim(),
      password: process.env.ADMIN_PASSWORD!.trim(),
    };
  }
  return {
    username: process.env.ADMIN_USER?.trim() || DEV_DEFAULT_USER,
    password: process.env.ADMIN_PASSWORD?.trim() || DEV_DEFAULT_PASSWORD,
  };
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createAdminSessionToken(username: string) {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const body = `${username}.${exp}`;
  return `${body}.${sign(body)}`;
}

export function verifyAdminSessionToken(token?: string | null): { username: string } | null {
  if (!token) return null;
  try {
    if (isProduction()) {
      assertProductionSecrets();
    }
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [username, expStr, sig] = parts;
    const body = `${username}.${expStr}`;
    const expected = sign(body);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return { username };
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(res: NextResponse, username: string) {
  const token = createAdminSessionToken(username);
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminAuthenticated(request: NextRequest) {
  return Boolean(verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

export function requireAdminApi(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Helper for generating a strong session secret locally (docs only). */
export function suggestSessionSecret() {
  return randomBytes(32).toString("hex");
}

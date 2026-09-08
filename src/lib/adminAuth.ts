import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "sda_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    "shaadavid-dev-session-secret-change-me"
  );
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USER || "shadavid",
    password: process.env.ADMIN_PASSWORD || "shadavid@123",
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
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expStr, sig] = parts;
  const body = `${username}.${expStr}`;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  return { username };
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

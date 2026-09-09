import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionTokenEdge,
} from "@/lib/adminSessionEdge";

const PUBLIC_API_PREFIXES = [
  "/api/razorpay/create-order",
  "/api/razorpay/verify",
  "/api/razorpay/webhook",
  "/api/orders/track",
  "/api/orders/history",
  "/api/chat",
  "/api/admin/login",
];

function isPublicApi(pathname: string, method: string) {
  if (PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  // Public reads
  if (method === "GET") {
    if (
      pathname === "/api/products" ||
      pathname === "/api/reviews" ||
      pathname === "/api/blogs" ||
      pathname === "/api/gallery" ||
      pathname === "/api/testimonials" ||
      pathname === "/api/legal" ||
      pathname === "/api/settings" ||
      pathname === "/api/coupons/validate"
    ) {
      return true;
    }
  }
  // Public order create (COD / checkout)
  if (method === "POST" && pathname === "/api/orders") return true;
  // Public contact form
  if (method === "POST" && pathname === "/api/contact") return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authed = Boolean(await verifyAdminSessionTokenEdge(token));

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/admin/login" && authed && method === "GET") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/") && !isPublicApi(pathname, method)) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

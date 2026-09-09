/** Shared helpers for public-site mobile chrome (Buy CTA bar). */

export function hidesMobileBuyCta(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/product") || pathname.startsWith("/admin");
}

export function showsMobileBuyCta(pathname: string | null | undefined): boolean {
  return !hidesMobileBuyCta(pathname);
}

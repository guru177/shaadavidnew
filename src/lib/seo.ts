import type { Metadata } from "next";
import { getSettings, getSiteUrl } from "@/lib/settings";
import {
  DEFAULT_SETTINGS,
  SEO_PAGE_PATHS,
  type SeoPageKey,
  type SiteSettings,
} from "@/types/settings";

type BuildOpts = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  /** When true, do not append site name template */
  absoluteTitle?: boolean;
  settings?: SiteSettings;
};

export function absoluteUrl(path: string, siteUrl?: string): string {
  const base = (siteUrl || getSiteUrl()).replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function toAbsoluteImage(image: string | undefined, siteUrl?: string): string {
  const base = (siteUrl || getSiteUrl()).replace(/\/$/, "");
  const fallback = DEFAULT_SETTINGS.seo.ogImage;
  const src = (image || fallback || "/logo.png").trim();
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${base}${src.startsWith("/") ? src : `/${src}`}`;
}

export function parseKeywords(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function buildPageMetadata(opts: BuildOpts): Metadata {
  const settings = opts.settings || getSettings();
  const siteUrl = getSiteUrl(settings);
  const url = absoluteUrl(opts.path, siteUrl);
  const image = toAbsoluteImage(opts.image || settings.seo.ogImage, siteUrl);
  const keywords = parseKeywords(opts.keywords || settings.seo.keywords);
  const title = opts.absoluteTitle
    ? { absolute: opts.title }
    : opts.title;

  return {
    title,
    description: opts.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: settings.siteName,
      images: [{ url: image }],
      type: opts.type || "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function metadataForSeoPage(key: SeoPageKey): Metadata {
  const settings = getSettings();
  const page = settings.seoPages?.[key] || DEFAULT_SETTINGS.seoPages[key];
  const path = SEO_PAGE_PATHS[key];
  const isHome = key === "home";

  return buildPageMetadata({
    title: page.title || (isHome ? settings.seo.title : key),
    description: page.description || settings.seo.description,
    keywords: page.keywords || settings.seo.keywords,
    path,
    image: settings.seo.ogImage,
    absoluteTitle: isHome,
    settings,
  });
}

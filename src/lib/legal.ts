import "server-only";
import { getDb, saveDb } from "@/lib/db";
import {
  DEFAULT_LEGAL_PAGES,
  LEGAL_SLUGS,
  isLegalSlug,
  type LegalPage,
  type LegalPagesMap,
  type LegalSlug,
} from "@/types/legal";

export function getLegalPages(): LegalPagesMap {
  const db = getDb();
  const stored = (db.legalPages || {}) as Partial<LegalPagesMap>;
  const merged = { ...DEFAULT_LEGAL_PAGES };

  for (const slug of LEGAL_SLUGS) {
    const item = stored[slug];
    if (item && typeof item === "object") {
      merged[slug] = {
        ...DEFAULT_LEGAL_PAGES[slug],
        ...item,
        slug,
        title: item.title || DEFAULT_LEGAL_PAGES[slug].title,
        content: item.content || DEFAULT_LEGAL_PAGES[slug].content,
        lastUpdated: item.lastUpdated || DEFAULT_LEGAL_PAGES[slug].lastUpdated,
      };
    }
  }

  return merged;
}

export function getLegalPage(slug: string): LegalPage | null {
  if (!isLegalSlug(slug)) return null;
  return getLegalPages()[slug];
}

export function saveLegalPage(page: LegalPage): LegalPage {
  if (!isLegalSlug(page.slug)) {
    throw new Error("Invalid legal page slug");
  }

  const db = getDb();
  if (!db.legalPages) db.legalPages = {};

  const next: LegalPage = {
    slug: page.slug,
    title: String(page.title || DEFAULT_LEGAL_PAGES[page.slug].title).trim(),
    lastUpdated: String(page.lastUpdated || new Date().toISOString().split("T")[0]),
    content: String(page.content || "").trim(),
  };

  db.legalPages[page.slug as LegalSlug] = next;
  saveDb(db);
  return next;
}

export function saveLegalPages(pages: Partial<LegalPagesMap>): LegalPagesMap {
  const db = getDb();
  if (!db.legalPages) db.legalPages = {};

  for (const slug of LEGAL_SLUGS) {
    const page = pages[slug];
    if (!page) continue;
    db.legalPages[slug] = {
      slug,
      title: String(page.title || DEFAULT_LEGAL_PAGES[slug].title).trim(),
      lastUpdated: String(page.lastUpdated || new Date().toISOString().split("T")[0]),
      content: String(page.content || "").trim(),
    };
  }

  saveDb(db);
  return getLegalPages();
}

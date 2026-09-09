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

export async function getLegalPages(): Promise<LegalPagesMap> {
  const db = await getDb();
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

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  if (!isLegalSlug(slug)) return null;
  return (await getLegalPages())[slug];
}

export async function saveLegalPage(page: LegalPage): Promise<LegalPage> {
  if (!isLegalSlug(page.slug)) {
    throw new Error("Invalid legal page slug");
  }

  const db = await getDb();
  if (!db.legalPages) db.legalPages = {};

  const next: LegalPage = {
    slug: page.slug,
    title: String(page.title || DEFAULT_LEGAL_PAGES[page.slug].title).trim(),
    lastUpdated: String(page.lastUpdated || new Date().toISOString().split("T")[0]),
    content: String(page.content || "").trim(),
  };

  db.legalPages[page.slug as LegalSlug] = next;
  await saveDb(db);
  return next;
}

export async function saveLegalPages(pages: Partial<LegalPagesMap>): Promise<LegalPagesMap> {
  const db = await getDb();
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

  await saveDb(db);
  return await getLegalPages();
}

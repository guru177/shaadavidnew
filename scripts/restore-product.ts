/**
 * Restore the English Companion product (and its reviews) into Neon
 * WITHOUT wiping orders, contacts, settings, etc.
 *
 * Usage (PowerShell):
 *   $env:DATABASE_URL = "postgresql://…"; npx tsx scripts/restore-product.ts
 * Or put DATABASE_URL in .env.local and run:
 *   npm run db:restore-product
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const APP_STATE_ID = 1;
const PRODUCT_ID = "prod-english-companion";
const PRODUCT_SLUG = "english-companion";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function loadSeedFile(): Record<string, any> {
  const candidates = [
    path.join(process.cwd(), "database.seed.json"),
    path.join(process.cwd(), "database.json"),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      console.log(`Reading product from ${path.basename(file)}`);
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
  }
  throw new Error("No database.seed.json or database.json found");
}

async function main() {
  loadEnvLocal();
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error(
      "DATABASE_URL is required. Add it to .env.local (Neon pooled URL) then re-run."
    );
  }

  const seed = loadSeedFile();
  const seedProducts = Array.isArray(seed.products) ? seed.products : [];
  const product = seedProducts.find(
    (p: any) => p?.id === PRODUCT_ID || p?.slug === PRODUCT_SLUG
  );
  if (!product) {
    throw new Error(`Product ${PRODUCT_SLUG} not found in seed file`);
  }

  // Ensure product is active / in stock for storefront (clear soft-delete)
  const restoredProduct = {
    ...product,
    id: PRODUCT_ID,
    slug: PRODUCT_SLUG,
    deletedAt: null,
    inStock: product.inStock !== false,
    stock: typeof product.stock === "number" ? product.stock : 49,
  };

  const seedReviews = Array.isArray(seed.reviews)
    ? seed.reviews.filter((r: any) => r?.productId === PRODUCT_ID)
    : [];

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.appState.findUnique({ where: { id: APP_STATE_ID } });
    const data: Record<string, any> = existing?.data
      ? { ...(existing.data as object) }
      : { ...seed };

    if (!Array.isArray(data.products)) data.products = [];
    if (!Array.isArray(data.reviews)) data.reviews = [];

    const idx = data.products.findIndex(
      (p: any) => p?.id === PRODUCT_ID || p?.slug === PRODUCT_SLUG
    );
    if (idx >= 0) {
      // Seed fields win; deletedAt must be null (undefined would keep soft-delete)
      data.products[idx] = { ...data.products[idx], ...restoredProduct, deletedAt: null };
      console.log("Updated existing product in AppState (undeleted)");
    } else {
      data.products.unshift(restoredProduct);
      console.log("Inserted product into AppState");
    }

    // Merge missing reviews for this product (do not wipe others)
    const reviewIds = new Set(data.reviews.map((r: any) => String(r?.id)));
    let addedReviews = 0;
    for (const rev of seedReviews) {
      if (!rev?.id || reviewIds.has(String(rev.id))) continue;
      data.reviews.push(rev);
      reviewIds.add(String(rev.id));
      addedReviews += 1;
    }
    if (addedReviews) console.log(`Added ${addedReviews} product reviews`);

    const nextVersion = (existing?.version ?? 0) + 1;
    if (existing) {
      await prisma.appState.update({
        where: { id: APP_STATE_ID },
        data: { data: data as object, version: nextVersion },
      });
    } else {
      await prisma.appState.create({
        data: { id: APP_STATE_ID, data: data as object, version: 1 },
      });
    }

    console.log(`Done. Product /product/${PRODUCT_SLUG} restored (version ${existing ? nextVersion : 1}).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

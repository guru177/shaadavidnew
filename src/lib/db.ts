import "server-only";
import fs from "fs/promises";
import path from "path";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const DB_PATH = path.join(process.cwd(), "database.json");
const SEED_PATH = path.join(process.cwd(), "database.seed.json");
const APP_STATE_ID = 1;

export type AppDb = {
  testimonials: any[];
  orders: any[];
  blogs: any[];
  products: any[];
  reviews: any[];
  users: any[];
  gallery: any[];
  coupons?: any[];
  settings: any;
  legalPages: any;
  [key: string]: any;
};

export const EMPTY_DB: AppDb = {
  testimonials: [],
  orders: [],
  blogs: [],
  products: [],
  reviews: [],
  users: [],
  gallery: [],
  coupons: [],
  settings: null,
  legalPages: null,
};

type CacheEntry = { data: AppDb; version: number; loadedAt: number };
let memoryCache: CacheEntry | null = null;
const CACHE_TTL_MS = 2_000;
let schemaEnsured = false;

function asAppDb(raw: unknown): AppDb {
  if (!raw || typeof raw !== "object") return { ...EMPTY_DB };
  return { ...EMPTY_DB, ...(raw as Record<string, unknown>) } as AppDb;
}

function isBuildTime() {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-export" ||
    process.env.npm_lifecycle_event === "build"
  );
}

function isPrismaMissingTable(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

async function readJsonFile(filePath: string): Promise<AppDb | null> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return asAppDb(JSON.parse(text));
  } catch {
    return null;
  }
}

async function loadSeedDb(): Promise<AppDb> {
  return (
    (await readJsonFile(DB_PATH)) ||
    (await readJsonFile(SEED_PATH)) ||
    { ...EMPTY_DB }
  );
}

/** Best-effort DDL when migrate did not run (e.g. pooled URL during deploy). */
async function ensureAppStateTable(): Promise<void> {
  if (schemaEnsured) return;
  const prisma = getPrisma();
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AppState" (
      "id" INTEGER NOT NULL,
      "data" JSONB NOT NULL,
      "version" INTEGER NOT NULL DEFAULT 1,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
    );
  `);
  schemaEnsured = true;
}

async function ensurePostgresRow(): Promise<{ data: AppDb; version: number }> {
  const prisma = getPrisma();

  const loadExisting = async () =>
    prisma.appState.findUnique({ where: { id: APP_STATE_ID } });

  let existing;
  try {
    existing = await loadExisting();
  } catch (error) {
    if (!isPrismaMissingTable(error)) throw error;
    await ensureAppStateTable();
    existing = await loadExisting();
  }

  if (existing) {
    return { data: asAppDb(existing.data), version: existing.version };
  }

  const seed = await loadSeedDb();

  const created = await prisma.appState.create({
    data: {
      id: APP_STATE_ID,
      data: seed as object,
      version: 1,
    },
  });

  return { data: asAppDb(created.data), version: created.version };
}

async function getDbFromPostgres(): Promise<AppDb> {
  if (memoryCache && Date.now() - memoryCache.loadedAt < CACHE_TTL_MS) {
    return structuredClone(memoryCache.data);
  }

  const { data, version } = await ensurePostgresRow();
  memoryCache = { data, version, loadedAt: Date.now() };
  return structuredClone(data);
}

async function saveDbToPostgres(data: AppDb): Promise<boolean> {
  const prisma = getPrisma();
  try {
    return await saveDbToPostgresInner(prisma, data);
  } catch (error) {
    if (!isPrismaMissingTable(error)) throw error;
    await ensureAppStateTable();
    return await saveDbToPostgresInner(prisma, data);
  }
}

async function saveDbToPostgresInner(
  prisma: ReturnType<typeof getPrisma>,
  data: AppDb
): Promise<boolean> {
  const current = await prisma.appState.findUnique({ where: { id: APP_STATE_ID } });
  const expectedVersion = current?.version ?? memoryCache?.version ?? 1;
  const nextVersion = expectedVersion + 1;
  const payload = asAppDb(data) as object;

  if (!current) {
    await prisma.appState.create({
      data: { id: APP_STATE_ID, data: payload, version: 1 },
    });
    memoryCache = { data: asAppDb(data), version: 1, loadedAt: Date.now() };
    return true;
  }

  const result = await prisma.appState.updateMany({
    where: { id: APP_STATE_ID, version: expectedVersion },
    data: { data: payload, version: nextVersion },
  });

  if (result.count === 0) {
    // Retry once against latest version (last-write-wins with bump)
    const latest = await prisma.appState.findUnique({ where: { id: APP_STATE_ID } });
    if (!latest) return false;
    await prisma.appState.update({
      where: { id: APP_STATE_ID },
      data: { data: payload, version: latest.version + 1 },
    });
    memoryCache = {
      data: asAppDb(data),
      version: latest.version + 1,
      loadedAt: Date.now(),
    };
    return true;
  }

  memoryCache = { data: asAppDb(data), version: nextVersion, loadedAt: Date.now() };
  return true;
}

async function getDbFromFile(): Promise<AppDb> {
  return loadSeedDb();
}

async function saveDbToFile(data: AppDb): Promise<boolean> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(asAppDb(data), null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write database.json:", error);
    return false;
  }
}

/** Load the full app database (Postgres when DATABASE_URL is set, else local JSON). */
export async function getDb(): Promise<AppDb> {
  try {
    const onVercel = Boolean(process.env.VERCEL);
    if (onVercel && !hasDatabaseUrl() && !isBuildTime()) {
      throw new Error(
        "DATABASE_URL is required on Vercel. Connect Neon and set DATABASE_URL (see docs/DEPLOY.md)."
      );
    }
    if (hasDatabaseUrl()) return await getDbFromPostgres();
    return await getDbFromFile();
  } catch (error) {
    console.error("Failed to read database:", error);
    // Prerender must not fail the Vercel build when Neon is cold / not migrated yet.
    if (isBuildTime()) {
      return loadSeedDb();
    }
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      throw error instanceof Error ? error : new Error("Database unavailable");
    }
    return { ...EMPTY_DB };
  }
}

/** Persist the full app database. Returns false on failure. */
export async function saveDb(data: AppDb | Record<string, unknown>): Promise<boolean> {
  try {
    const payload = asAppDb(data);
    if (hasDatabaseUrl()) return await saveDbToPostgres(payload);
    return await saveDbToFile(payload);
  } catch (error) {
    console.error("Failed to write database:", error);
    return false;
  }
}

/** Invalidate in-memory cache (e.g. after external seed). */
export function invalidateDbCache() {
  memoryCache = null;
}

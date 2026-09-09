/**
 * Seed Neon (or any Postgres with DATABASE_URL) from database.json / database.seed.json.
 *
 * Usage:
 *   npx tsx scripts/seed-db.ts
 *
 * Requires DATABASE_URL in the environment (or .env / .env.local).
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const APP_STATE_ID = 1;

function loadSeed(): Record<string, unknown> {
  const candidates = [
    path.join(process.cwd(), "database.json"),
    path.join(process.cwd(), "database.seed.json"),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      console.log(`Loaded seed from ${path.basename(file)}`);
      return raw;
    }
  }
  throw new Error("No database.json or database.seed.json found to seed from");
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is required. Set it in .env.local or the shell.");
  }

  const prisma = new PrismaClient();
  const data = loadSeed();

  const existing = await prisma.appState.findUnique({ where: { id: APP_STATE_ID } });
  if (existing) {
    await prisma.appState.update({
      where: { id: APP_STATE_ID },
      data: { data: data as object, version: existing.version + 1 },
    });
    console.log(`Updated AppState (version ${existing.version + 1})`);
  } else {
    await prisma.appState.create({
      data: { id: APP_STATE_ID, data: data as object, version: 1 },
    });
    console.log("Created AppState (version 1)");
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});

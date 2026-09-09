/**
 * Run `prisma migrate deploy` preferring Neon's direct (unpooled) URL.
 * Pooled / PgBouncer URLs often fail or skip DDL during migrate.
 */
import { spawnSync } from "node:child_process";

const url =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL_UNPOOLED?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  console.warn(
    "[migrate-on-build] No DATABASE_URL / DIRECT_URL set — skipping prisma migrate deploy."
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: url },
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);

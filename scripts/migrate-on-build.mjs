/**
 * Run `prisma migrate deploy` preferring Neon's direct (unpooled) URL.
 * Pooled / PgBouncer URLs often hang on advisory locks (P1002) during migrate.
 */
import { spawnSync } from "node:child_process";

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 5_000;

function pickMigrateUrl() {
  return (
    process.env.DIRECT_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ""
  );
}

/** Neon pooler hosts look like ep-xxx-pooler.region… — migrate needs the non-pooler host. */
function toDirectUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("-pooler.")) {
      u.hostname = u.hostname.replace("-pooler.", ".");
      return u.toString();
    }
  } catch {
    /* keep original */
  }
  return url;
}

function sleepMs(ms) {
  spawnSync(process.execPath, ["-e", `Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,${ms})`], {
    stdio: "ignore",
  });
}

function runMigrate(databaseUrl) {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "pipe",
    encoding: "utf8",
    shell: true,
  });
}

const raw = pickMigrateUrl();
if (!raw) {
  console.warn(
    "[migrate-on-build] No DATABASE_URL / DIRECT_URL set — skipping prisma migrate deploy."
  );
  process.exit(0);
}

const url = toDirectUrl(raw);
if (url !== raw) {
  console.warn(
    "[migrate-on-build] Using non-pooler host for migrate (stripped -pooler from hostname)."
  );
}

let lastStatus = 1;
let lastOut = "";

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  console.log(`[migrate-on-build] prisma migrate deploy (attempt ${attempt}/${MAX_ATTEMPTS})`);
  const result = runMigrate(url);
  const out = `${result.stdout || ""}${result.stderr || ""}`;
  lastOut = out;
  lastStatus = result.status ?? 1;

  if (out) process.stdout.write(out);

  if (lastStatus === 0) {
    process.exit(0);
  }

  const isLockTimeout =
    out.includes("P1002") ||
    /advisory lock/i.test(out) ||
    /timed out/i.test(out);

  if (!isLockTimeout || attempt === MAX_ATTEMPTS) break;

  const delay = BASE_DELAY_MS * attempt;
  console.warn(`[migrate-on-build] Lock/timeout — retrying in ${delay}ms…`);
  sleepMs(delay);
}

const isLockTimeout =
  lastOut.includes("P1002") ||
  /advisory lock/i.test(lastOut) ||
  /timed out/i.test(lastOut);

if (isLockTimeout) {
  // Schema is usually already applied; runtime ensureAppStateTable covers cold starts.
  console.warn(
    "[migrate-on-build] Giving up on advisory lock (P1002). Continuing build. Set Vercel DIRECT_URL to Neon’s unpooled (non-pooler) connection string to avoid this."
  );
  process.exit(0);
}

process.exit(lastStatus);

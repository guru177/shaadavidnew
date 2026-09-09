/** Collision-safe ID helpers for the JSON DB. */

/** Sequential IDs: ORD-0001, ORD-0002, … (skips any IDs already in the DB). */
export function generateOrderId(db: { orders?: { id: string }[] }) {
  const existing = new Set((db.orders || []).map((o) => String(o.id)));
  for (let n = 1; n < 1_000_000; n += 1) {
    const id = `ORD-${String(n).padStart(4, "0")}`;
    if (!existing.has(id)) return id;
  }
  return `ORD-${Date.now().toString().slice(-8)}`;
}

export function generateUserId(db: { users?: { id: string }[] }) {
  const existing = new Set((db.users || []).map((u) => u.id));
  for (let i = 0; i < 40; i += 1) {
    const id = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existing.has(id)) return id;
  }
  return `USR-${Date.now().toString().slice(-6)}`;
}

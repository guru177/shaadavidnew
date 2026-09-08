/** Collision-safe ID helpers for the JSON DB. */

export function generateOrderId(db: { orders?: { id: string }[] }) {
  const existing = new Set((db.orders || []).map((o) => o.id));
  for (let i = 0; i < 40; i += 1) {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
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

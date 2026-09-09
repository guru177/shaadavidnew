/** Collision-safe ID helpers for the JSON DB. */

/** Sequential IDs: ORD-0001, ORD-0002, … (fills lowest free slot). */
export function generateOrderId(db: { orders?: { id: string }[] }) {
  const existing = new Set((db.orders || []).map((o) => String(o.id)));
  for (let n = 1; n < 1_000_000; n += 1) {
    const id = `ORD-${String(n).padStart(4, "0")}`;
    if (!existing.has(id)) return id;
  }
  return `ORD-${Date.now().toString().slice(-8)}`;
}

/**
 * Reassign remaining orders to ORD-0001, ORD-0002, … in chronological order.
 * Used after deletes so the sequence resets cleanly.
 */
export function renumberOrders<T extends { id: string; date?: string }>(
  orders: T[],
  parseDate?: (date?: string) => Date | null
): T[] {
  const sorted = [...orders].sort((a, b) => {
    const ta = parseDate?.(a.date)?.getTime() ?? Date.parse(String(a.date || "")) || 0;
    const tb = parseDate?.(b.date)?.getTime() ?? Date.parse(String(b.date || "")) || 0;
    if (ta !== tb) return ta - tb;
    return String(a.id).localeCompare(String(b.id));
  });

  return sorted.map((order, index) => ({
    ...order,
    id: `ORD-${String(index + 1).padStart(4, "0")}`,
  }));
}

export function generateUserId(db: { users?: { id: string }[] }) {
  const existing = new Set((db.users || []).map((u) => u.id));
  for (let i = 0; i < 40; i += 1) {
    const id = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existing.has(id)) return id;
  }
  return `USR-${Date.now().toString().slice(-6)}`;
}

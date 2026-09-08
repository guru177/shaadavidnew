/** Best-effort transactional email via Resend. No-ops if unset. */

type OrderEmailKind = "confirmation" | "status";

export async function sendOrderEmail(order: any, kind: OrderEmailKind) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.info("[email] skipped — RESEND_API_KEY or EMAIL_FROM not set");
    return { skipped: true };
  }

  const to =
    order?.customerDetails?.email ||
    order?.shippingAddress?.email ||
    order?.email;
  // Mobile-first store: skip if no email on order
  if (!to || !String(to).includes("@")) {
    console.info("[email] skipped — no customer email on order", order?.id);
    return { skipped: true };
  }

  const subject =
    kind === "confirmation"
      ? `Order confirmed — ${order.id}`
      : `Order update — ${order.id} is ${order.status}`;

  const trackBase = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const trackUrl = `${trackBase}/track?order=${encodeURIComponent(order.id)}`;

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#0c1622;line-height:1.5">
      <h2 style="margin:0 0 12px">Shaa David's Academy</h2>
      <p>Hi ${order.customerDetails?.name || order.shippingAddress?.name || "there"},</p>
      <p>${
        kind === "confirmation"
          ? "Thank you for your order. Payment received and your book will be packed soon."
          : `Your order status is now <strong>${order.status}</strong>.`
      }</p>
      <p><strong>Order:</strong> ${order.id}<br/>
      <strong>Amount:</strong> ${order.amount}<br/>
      <strong>Product:</strong> ${order.product}</p>
      <p><a href="${trackUrl}">Track your order</a></p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Resend failed", text);
    return { ok: false };
  }
  return { ok: true };
}

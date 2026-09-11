import "server-only";
import { getEmailFrom, getResendApiKey, getSettings, getSiteUrl } from "@/lib/settings";
import type { SiteSettings } from "@/types/settings";

function digitsOnly(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function formatAdminOrderMessage(order: any, siteUrl: string) {
  const name = order?.customerDetails?.name || order?.shippingAddress?.name || "Customer";
  const mobile = order?.customerDetails?.mobile || order?.shippingAddress?.mobile || "—";
  const track = `${siteUrl.replace(/\/$/, "")}/admin/orders`;
  return [
    `🛒 *New order — Shaa David's Academy*`,
    ``,
    `*Order:* ${order?.id || "—"}`,
    `*Amount:* ${order?.amount || "—"}`,
    `*Payment:* ${order?.paymentMethod || "—"} · ${order?.paymentStatus || "—"}`,
    `*Status:* ${order?.status || "—"}`,
    `*Product:* ${order?.product || "—"}`,
    ``,
    `*Customer:* ${name}`,
    `*Mobile:* ${mobile}`,
    order?.shippingAddress?.city
      ? `*Ship to:* ${order.shippingAddress.city}${order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""} ${order.shippingAddress.pincode || ""}`
      : null,
    order?.razorpayPaymentId ? `*Payment ID:* ${order.razorpayPaymentId}` : null,
    ``,
    `Open admin: ${track}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendAdminEmail(order: any, settings: SiteSettings, siteUrl: string) {
  if (!settings.notifications?.newOrderEmailEnabled) {
    return { skipped: true, reason: "disabled" };
  }

  const apiKey = await getResendApiKey(settings);
  const from = await getEmailFrom(settings);
  if (!apiKey || !from) {
    console.info("[notify] admin email skipped — Resend API key or From address not set");
    return { skipped: true, reason: "no_resend" };
  }

  const to =
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    settings.notifications?.notifyEmail?.trim() ||
    settings.contact?.email?.trim() ||
    "";

  if (!to || !to.includes("@")) {
    console.info("[notify] admin email skipped — no notify email configured");
    return { skipped: true, reason: "no_to" };
  }

  const name = order?.customerDetails?.name || order?.shippingAddress?.name || "Customer";
  const mobile = order?.customerDetails?.mobile || order?.shippingAddress?.mobile || "—";
  const adminOrders = `${siteUrl.replace(/\/$/, "")}/admin/orders`;

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#0c1622;line-height:1.55;max-width:560px">
      <h2 style="margin:0 0 8px">New order received</h2>
      <p style="margin:0 0 16px;color:#395c80">Shaa David's Academy</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Order</td><td style="padding:6px 0;font-weight:700">${order?.id || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Amount</td><td style="padding:6px 0;font-weight:700">${order?.amount || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Payment</td><td style="padding:6px 0">${order?.paymentMethod || "—"} · ${order?.paymentStatus || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Status</td><td style="padding:6px 0">${order?.status || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Product</td><td style="padding:6px 0">${order?.product || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Mobile</td><td style="padding:6px 0">${mobile}</td></tr>
      </table>
      <p style="margin:20px 0 0"><a href="${adminOrders}" style="display:inline-block;background:#29425e;color:#fff;text-decoration:none;padding:10px 16px;border-radius:999px;font-weight:600">Open in admin</a></p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New order ${order?.id || ""} — ${order?.amount || ""}`.trim(),
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[notify] admin email failed", text);
    return { ok: false, error: text };
  }
  return { ok: true };
}

async function sendViaCallMeBot(phone: string, apiKey: string, text: string) {
  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);
  const res = await fetch(url.toString(), { method: "GET" });
  const body = await res.text();
  if (!res.ok) {
    console.error("[notify] CallMeBot failed", res.status, body.slice(0, 200));
    return { ok: false, error: body };
  }
  return { ok: true };
}

async function sendViaWhatsAppCloud(phone: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneNumberId) return { skipped: true, reason: "no_cloud" };

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[notify] WhatsApp Cloud failed", errText.slice(0, 300));
    return { ok: false, error: errText };
  }
  return { ok: true };
}

async function sendAdminWhatsApp(order: any, settings: SiteSettings, siteUrl: string) {
  if (!settings.notifications?.newOrderWhatsAppEnabled) {
    return { skipped: true, reason: "disabled" };
  }

  const phoneRaw =
    settings.notifications?.notifyWhatsApp?.trim() ||
    settings.contact?.whatsapp?.trim() ||
    settings.contact?.phone?.trim() ||
    "";
  const phone = digitsOnly(phoneRaw);
  if (phone.length < 10) {
    console.info("[notify] WhatsApp skipped — no notify phone configured");
    return { skipped: true, reason: "no_phone" };
  }

  const text = formatAdminOrderMessage(order, siteUrl);
  const callMeBotKey =
    settings.notifications?.callMeBotApiKey?.trim() ||
    process.env.CALLMEBOT_API_KEY?.trim() ||
    "";

  // Prefer Meta Cloud API when configured, else CallMeBot
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return sendViaWhatsAppCloud(phone, text);
  }
  if (callMeBotKey) {
    return sendViaCallMeBot(phone, callMeBotKey, text);
  }

  console.info(
    "[notify] WhatsApp skipped — set CallMeBot API key in Admin → Settings → Notifications, or WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID"
  );
  return { skipped: true, reason: "no_provider" };
}

/** Fire-and-forget friendly: notify shop owner of a brand-new order. */
export async function notifyAdminNewOrder(order: any) {
  try {
    const settings = await getSettings();
    const siteUrl = await getSiteUrl(settings);
    const [email, whatsapp] = await Promise.allSettled([
      sendAdminEmail(order, settings, siteUrl),
      sendAdminWhatsApp(order, settings, siteUrl),
    ]);
    return {
      email: email.status === "fulfilled" ? email.value : { ok: false, error: String(email.reason) },
      whatsapp:
        whatsapp.status === "fulfilled" ? whatsapp.value : { ok: false, error: String(whatsapp.reason) },
    };
  } catch (err) {
    console.error("[notify] notifyAdminNewOrder failed", err);
    return { ok: false, error: err instanceof Error ? err.message : "notify failed" };
  }
}

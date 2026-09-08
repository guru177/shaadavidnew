/** Client-safe contact helpers (no Node/fs imports). */

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "#";
  return digits.startsWith("91") ? `tel:+${digits}` : `tel:+91${digits}`;
}

export function toWhatsAppHref(whatsapp: string, text?: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return "#";
  const phone = digits.length === 10 ? `91${digits}` : digits;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${q}`;
}

export function buildAddressLines(contact: {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}): string[] {
  return [
    contact.addressLine1 || "",
    contact.addressLine2 || "",
    [contact.city, contact.state].filter(Boolean).join(", "),
    [contact.pincode, contact.country].filter(Boolean).join(" "),
  ].filter(Boolean);
}

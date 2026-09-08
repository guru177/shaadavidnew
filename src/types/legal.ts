export const LEGAL_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
  "refund-policy",
  "cookie-policy",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  lastUpdated: string;
  content: string;
};

export type LegalPagesMap = Record<LegalSlug, LegalPage>;

export const LEGAL_NAV: { slug: LegalSlug; title: string; href: string }[] = [
  { slug: "privacy-policy", title: "Privacy Policy", href: "/legal/privacy-policy" },
  { slug: "terms-and-conditions", title: "Terms & Conditions", href: "/legal/terms-and-conditions" },
  { slug: "refund-policy", title: "Refund Policy", href: "/legal/refund-policy" },
  { slug: "cookie-policy", title: "Cookie Policy", href: "/legal/cookie-policy" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

export const DEFAULT_LEGAL_PAGES: LegalPagesMap = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    lastUpdated: today(),
    content: [
      "### Introduction",
      "Shaa David's Academy (“we”, “us”, or “our”) respects your privacy. This policy explains how we collect, use, and protect information when you visit our website or purchase products such as Shaa David's English Companion.",
      "### Information we collect",
      "We may collect your name, phone number, email address, shipping address, and payment-related details when you place an order or contact us. We also collect basic technical data such as browser type and pages visited to improve the site.",
      "### How we use your information",
      "We use your information to process orders, arrange delivery, send order updates (including WhatsApp notifications when you opt in), respond to support requests, and improve our services.",
      "### Sharing of information",
      "We do not sell your personal information. We may share data with trusted providers who help us operate the site (for example payment gateways and logistics partners), only as needed to fulfil your order or comply with law.",
      "### Data security",
      "We take reasonable technical and organisational measures to protect your data. No method of transmission over the internet is fully secure, so we cannot guarantee absolute security.",
      "### Your choices",
      "You may request access, correction, or deletion of your personal data by contacting us using the details on our Contact page.",
      "### Updates",
      "We may update this policy from time to time. The “Last updated” date at the top of this page will reflect the latest revision.",
      "### Contact",
      "For privacy questions, email us at the address listed in our site settings / Contact page.",
    ].join("\n\n"),
  },
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    lastUpdated: today(),
    content: [
      "### Agreement",
      "By accessing this website or purchasing from Shaa David's Academy, you agree to these Terms & Conditions. If you do not agree, please do not use the site or place an order.",
      "### Products & pricing",
      "Product descriptions, prices, and availability are shown on the product pages and may change without prior notice. Prices are listed in INR unless stated otherwise. Payment is processed through our authorised payment partners.",
      "### Orders",
      "Placing an order constitutes an offer to buy. We may accept or decline an order (for example if stock is unavailable or payment fails). You will receive confirmation once payment is successful.",
      "### Shipping & delivery",
      "Delivery timelines are estimates and may vary by location. You are responsible for providing accurate shipping details. Risk of loss passes to you upon delivery to the address provided.",
      "### Intellectual property",
      "All content on this site—including text, branding, images, and course materials—is owned by Shaa David's Academy or its licensors. You may not copy, redistribute, or resell materials without written permission.",
      "### Acceptable use",
      "You agree not to misuse the website, attempt unauthorised access, or use our content for unlawful purposes.",
      "### Limitation of liability",
      "To the fullest extent permitted by law, Shaa David's Academy is not liable for indirect or consequential losses arising from use of the site or products. Our total liability for any claim related to a purchase is limited to the amount you paid for that order.",
      "### Governing law",
      "These terms are governed by the laws of India. Disputes shall be subject to the courts of Kerala, India, unless otherwise required by law.",
      "### Contact",
      "Questions about these terms can be sent via our Contact page.",
    ].join("\n\n"),
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    lastUpdated: today(),
    content: [
      "### Overview",
      "We want you to be satisfied with your purchase from Shaa David's Academy. This Refund Policy explains when refunds or replacements may apply.",
      "### Physical products",
      "If you receive a damaged or incorrect product, please contact us within 7 days of delivery with your order ID and clear photos of the issue. Eligible cases may be offered a replacement or refund at our discretion.",
      "### Change of mind",
      "Because of the nature of educational products and fulfilment costs, change-of-mind returns may not always be available. Contact us and we will review your request case by case.",
      "### Digital / access components",
      "If a product includes digital access or downloadable materials that have already been delivered or activated, refunds may be limited once access has been granted.",
      "### How to request",
      "Email or WhatsApp us with your order ID, reason for the request, and supporting details. We aim to respond within 2–3 business days.",
      "### Refund method & timeline",
      "Approved refunds are issued to the original payment method. Banking timelines vary; please allow additional time for the amount to reflect in your account.",
      "### Contact",
      "For refund support, use the Contact page or the phone / WhatsApp number shown on the website.",
    ].join("\n\n"),
  },
  "cookie-policy": {
    slug: "cookie-policy",
    title: "Cookie Policy",
    lastUpdated: today(),
    content: [
      "### What are cookies?",
      "Cookies are small text files stored on your device when you visit a website. They help the site work properly and help us understand how it is used.",
      "### How we use cookies",
      "We may use cookies and similar technologies to keep the site secure, remember preferences, measure traffic, and improve performance and content.",
      "### Types of cookies",
      "Essential cookies are needed for basic site functions. Analytics cookies help us understand page visits in aggregate. Preference cookies remember choices you make on the site.",
      "### Third-party cookies",
      "Some features (such as payment or embedded media) may set cookies from third-party providers. Those providers have their own privacy and cookie policies.",
      "### Managing cookies",
      "Most browsers let you block or delete cookies. If you disable essential cookies, some parts of the site may not work correctly.",
      "### Updates",
      "We may update this Cookie Policy when our practices change. Please check this page periodically for the latest information.",
      "### Contact",
      "For questions about cookies, contact us through the Contact page.",
    ].join("\n\n"),
  },
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

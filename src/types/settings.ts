export type SiteSettings = {
  siteName: string;
  siteUrl: string;
  tagline: string;

  contact: {
    email: string;
    phone: string;
    phoneSecondary: string;
    whatsapp: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };

  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalPath: string;
  };

  razorpay: {
    keyId: string;
    keySecret: string;
  };

  commerce: {
    gstin: string;
    taxPercent: number;
    hsn: string;
    enableCod: boolean;
  };

  whatsappTemplates: {
    /** @deprecated kept for older saved settings; prefer status-specific templates */
    orderStatus?: string;
    pending: string;
    confirmed: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    refunded: string;
    signature: string;
  };
};

function defaultStatusTemplate(statusWord: string, extraLine?: string) {
  return [
    "Hi {{name}},",
    "",
    `Your {{siteName}} order *{{orderId}}* is now *${statusWord}*.`,
    ...(extraLine ? [extraLine, ""] : []),
    "{{productLine}}",
    "{{amountLine}}",
    "",
    "Track your order here:",
    "{{trackUrl}}",
    "",
    "{{signature}}",
  ].join("\n");
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Shaa David's Academy",
  siteUrl: "http://localhost:3000",
  tagline: "Where Language Meets Opportunity",

  contact: {
    email: "info@shaadavid.com",
    phone: "+917907075923",
    phoneSecondary: "",
    whatsapp: "917907075923",
    addressLine1: "MG Road, Ernakulam",
    addressLine2: "",
    city: "Kochi",
    state: "Kerala",
    pincode: "682011",
    country: "India",
  },

  social: {
    facebook: "",
    instagram: "https://www.instagram.com/shaa_davids_english_companion/",
    twitter: "",
    youtube: "",
    linkedin: "",
  },

  seo: {
    title: "Shaa David | Learn English Through Malayalam",
    description:
      "The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar. Master English with Shaa David.",
    keywords: "Learn English, Malayalam to English, Shaa David, Spoken English Malayalam",
    ogTitle: "Shaa David | Learn English Through Malayalam",
    ogDescription:
      "The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar.",
    ogImage: "/hero-graphic.webp",
    canonicalPath: "/",
  },

  razorpay: {
    keyId: "",
    keySecret: "",
  },

  commerce: {
    gstin: "",
    taxPercent: 0,
    hsn: "4901",
    enableCod: true,
  },

  whatsappTemplates: {
    pending: defaultStatusTemplate("Pending confirmation", "We are reviewing your order."),
    confirmed: defaultStatusTemplate("Confirmed", "Payment received — we are preparing your order."),
    shipped: defaultStatusTemplate("Shipped", "Your package is on the way."),
    delivered: defaultStatusTemplate("Delivered", "Hope you enjoy the book!"),
    cancelled: defaultStatusTemplate(
      "Cancelled",
      "Your order has been cancelled. If you already paid, contact us for help."
    ),
    refunded: defaultStatusTemplate(
      "Refunded",
      "Your refund has been processed. It may take a few business days to reflect in your account."
    ),
    signature: "Thank you — Shaa David's Academy",
  },
};

export type PageSeo = {
  title: string;
  description: string;
  keywords: string;
};

export type SeoPageKey =
  | "home"
  | "about"
  | "shop"
  | "blogs"
  | "gallery"
  | "services"
  | "contact"
  | "track"
  | "orders"
  | "checkout";

export const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  about: "/about",
  shop: "/shop",
  blogs: "/blogs",
  gallery: "/gallery",
  services: "/services",
  contact: "/contact",
  track: "/track",
  orders: "/orders",
  checkout: "/checkout",
};

export const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  home: "Home",
  about: "About",
  shop: "Shop",
  blogs: "Blogs listing",
  gallery: "Gallery",
  services: "Services",
  contact: "Contact",
  track: "Track order",
  orders: "Order history",
  checkout: "Checkout",
};

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

  /** Per-route SEO for static public pages */
  seoPages: Record<SeoPageKey, PageSeo>;

  razorpay: {
    keyId: string;
    keySecret: string;
  };

  /** AI English Tutor — server-only keys (never expose on public settings GET) */
  aiTutor: {
    groqApiKey: string;
    geminiApiKey: string;
  };

  /** Transactional email via Resend (customer + admin alerts) */
  email: {
    resendApiKey: string;
    /** e.g. Shaa David <orders@yourdomain.com> */
    emailFrom: string;
    /** Send confirmation/status emails to customers when they provide an email */
    customerEmailsEnabled: boolean;
  };

  commerce: {
    gstin: string;
    taxPercent: number;
    hsn: string;
    enableCod: boolean;
  };

  /** Admin alerts when a new order is placed */
  notifications: {
    newOrderEmailEnabled: boolean;
    newOrderWhatsAppEnabled: boolean;
    /** Empty → use contact.email */
    notifyEmail: string;
    /** Empty → use contact.whatsapp / phone */
    notifyWhatsApp: string;
    /** CallMeBot API key — free personal WhatsApp alerts (https://www.callmebot.com/blog/free-api-whatsapp-messages/) */
    callMeBotApiKey: string;
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
    ogImage: "/og-image.png",
    canonicalPath: "/",
  },

  seoPages: {
    home: {
      title: "Shaa David | Learn English Through Malayalam",
      description:
        "The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar. Master English with Shaa David.",
      keywords: "Learn English, Malayalam to English, Shaa David, Spoken English Malayalam",
    },
    about: {
      title: "About Us",
      description:
        "Discover the story behind Shaa David and our approach to mastering spoken English for Malayalis.",
      keywords: "About Shaa David, English teacher Kerala, Malayalam English coach",
    },
    shop: {
      title: "Shop",
      description: "Browse books and learning companions from Shaa David's Academy.",
      keywords: "Buy English book Malayalam, Shaa David book, English Companion shop",
    },
    blogs: {
      title: "Blog",
      description:
        "Tips, stories, and lessons on learning English through Malayalam from Shaa David's Academy.",
      keywords: "English learning blog, Malayalam tips, spoken English articles",
    },
    gallery: {
      title: "Gallery",
      description: "Explore moments and memories from Shaa David's English Companion journey.",
      keywords: "Shaa David gallery, English Companion photos",
    },
    services: {
      title: "Our Services",
      description:
        "Expert counseling and educational support for parents and students to overcome academic and behavioral challenges.",
      keywords: "English counseling, student support Kerala, Shaa David services",
    },
    contact: {
      title: "Contact",
      description: "Get in touch with Shaa David's Academy for orders, support, and course questions.",
      keywords: "Contact Shaa David, WhatsApp support, Kochi English academy",
    },
    track: {
      title: "Track order",
      description: "Track your Shaa David's Academy order with order ID and mobile number.",
      keywords: "Track order, shipping status, Shaa David order",
    },
    orders: {
      title: "Order history",
      description: "Look up past orders from Shaa David's Academy.",
      keywords: "Order history, past purchases",
    },
    checkout: {
      title: "Checkout",
      description: "Complete your purchase securely at Shaa David's Academy.",
      keywords: "Checkout, buy book",
    },
  },

  razorpay: {
    keyId: "",
    keySecret: "",
  },

  aiTutor: {
    groqApiKey: "",
    geminiApiKey: "",
  },

  email: {
    resendApiKey: "",
    emailFrom: "",
    customerEmailsEnabled: true,
  },

  commerce: {
    gstin: "",
    taxPercent: 0,
    hsn: "4901",
    enableCod: true,
  },

  notifications: {
    newOrderEmailEnabled: true,
    newOrderWhatsAppEnabled: true,
    notifyEmail: "",
    notifyWhatsApp: "",
    callMeBotApiKey: "",
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

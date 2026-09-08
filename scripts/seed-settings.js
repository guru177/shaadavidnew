const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "database.json");
const db = JSON.parse(fs.readFileSync(file, "utf8"));
if (!db.settings) {
  db.settings = {
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
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
    seo: {
      title: "Shaa David | Learn English Through Malayalam",
      description:
        "The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar. Master English with Shaa David.",
      keywords:
        "Learn English, Malayalam to English, Shaa David, Spoken English Malayalam",
      ogTitle: "Shaa David | Learn English Through Malayalam",
      ogDescription:
        "The complete guide to learning English easily through Malayalam. Speak confidently without fear of grammar.",
      ogImage: "/hero-graphic.webp",
      canonicalPath: "/",
    },
    razorpay: { keyId: "", keySecret: "" },
    whatsappTemplates: {
      orderStatus:
        "Hi {{name}},\n\nYour {{siteName}} order *{{orderId}}* is now *{{status}}*.\n{{productLine}}\n{{amountLine}}\n\nTrack your order here:\n{{trackUrl}}\n\n{{signature}}",
      signature: "Thank you — Shaa David's Academy",
    },
  };
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
  console.log("settings seeded");
} else {
  console.log("settings already exists");
}

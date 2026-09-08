const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "database.json");
const db = JSON.parse(fs.readFileSync(file, "utf8"));
const tpl = (db.settings && db.settings.whatsappTemplates) || {};
const legacy = tpl.orderStatus || "";

db.settings = db.settings || {};
db.settings.whatsappTemplates = {
  pending:
    tpl.pending ||
    "Hi {{name}},\n\nYour {{siteName}} order *{{orderId}}* is now *Pending confirmation*.\nWe are reviewing your order.\n\n{{productLine}}\n{{amountLine}}\n\nTrack your order here:\n{{trackUrl}}\n\n{{signature}}",
  confirmed:
    tpl.confirmed ||
    legacy ||
    "Hi {{name}},\n\nYour {{siteName}} order *{{orderId}}* is now *Confirmed*.\nPayment received — we are preparing your order.\n\n{{productLine}}\n{{amountLine}}\n\nTrack your order here:\n{{trackUrl}}\n\n{{signature}}",
  shipped:
    tpl.shipped ||
    "Hi {{name}},\n\nYour {{siteName}} order *{{orderId}}* is now *Shipped*.\nYour package is on the way.\n\n{{productLine}}\n{{amountLine}}\n\nTrack your order here:\n{{trackUrl}}\n\n{{signature}}",
  delivered:
    tpl.delivered ||
    "Hi {{name}},\n\nYour {{siteName}} order *{{orderId}}* is now *Delivered*.\nHope you enjoy the book!\n\n{{productLine}}\n{{amountLine}}\n\nTrack your order here:\n{{trackUrl}}\n\n{{signature}}",
  signature: tpl.signature || "Thank you — Shaa David's Academy",
};

fs.writeFileSync(file, JSON.stringify(db, null, 2));
console.log("whatsapp templates updated");

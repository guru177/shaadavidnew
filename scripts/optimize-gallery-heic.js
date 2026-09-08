const fs = require("fs");
const path = require("path");
const convert = require("heic-convert");
const sharp = require("sharp");

const files = [
  "IMG_6612",
  "IMG_6603",
  "IMG_6608",
  "IMG_6611",
  "IMG_6606",
  "IMG_6613",
  "IMG_6595",
  "IMG_6602",
  "IMG_6597",
  "IMG_6600",
  "IMG_6589",
  "IMG_6601",
  "IMG_6605",
  "IMG_6599",
  "IMG_6594",
  "IMG_6598",
  "IMG_6596",
  "IMG_6591",
  "IMG_6592",
  "IMG_6593",
  "IMG_6590",
  "IMG_6586",
  "IMG_6588",
  "IMG_6587",
  "IMG_6585",
];

const downloads = "c:\\Users\\Hariprasad\\Downloads";
const outDir = path.join(process.cwd(), "public", "gallery");
fs.mkdirSync(outDir, { recursive: true });

// clean previous test outputs
for (const f of fs.readdirSync(outDir)) {
  fs.unlinkSync(path.join(outDir, f));
}

(async () => {
  let i = 1;
  for (const name of files) {
    const src = path.join(downloads, `${name}.HEIC`);
    if (!fs.existsSync(src)) {
      console.error("Missing", src);
      continue;
    }
    const destName = `gallery-${String(i).padStart(2, "0")}.webp`;
    const dest = path.join(outDir, destName);
    console.log(`Converting ${name} -> ${destName}`);
    const inputBuffer = fs.readFileSync(src);
    const jpegBuffer = await convert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 0.92,
    });
    await sharp(Buffer.from(jpegBuffer))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);
    const size = fs.statSync(dest).size;
    console.log(`  ok ${(size / 1024).toFixed(0)} KB`);
    i += 1;
  }
  console.log("Done. Files:", fs.readdirSync(outDir).length);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

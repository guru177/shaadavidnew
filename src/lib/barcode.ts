/**
 * Code 39 barcode → SVG / data URI (order IDs like ORD-0001).
 * Supports 0-9, A-Z, space, and - . $ / + %
 */

const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  $: "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn", // start/stop
};

function normalizeCode39(value: string) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^0-9A-Z\-. $/+%]/g, "")
    .trim();
}

/** Encode value as Code 39 SVG barcode. */
export function code39Svg(value: string, opts?: { height?: number; moduleWidth?: number }) {
  const text = normalizeCode39(value) || "ORDER";
  const height = opts?.height ?? 52;
  const narrow = opts?.moduleWidth ?? 1.5;
  const wide = narrow * 2.4;
  const gap = narrow;

  const full = `*${text}*`;
  let x = 0;
  const bars: string[] = [];

  for (let i = 0; i < full.length; i += 1) {
    const pattern = CODE39[full[i]];
    if (!pattern) continue;
    for (let j = 0; j < pattern.length; j += 1) {
      const isBar = j % 2 === 0;
      const w = pattern[j] === "w" ? wide : narrow;
      if (isBar) {
        bars.push(
          `<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${height}" fill="#0c1622"/>`
        );
      }
      x += w;
    }
    x += gap;
  }

  const width = Math.ceil(x);
  const safeLabel = text.replace(/[<>&"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safeLabel}">${bars.join("")}</svg>`;
}

export function code39DataUri(value: string, opts?: { height?: number; moduleWidth?: number }) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code39Svg(value, opts))}`;
}

// Generate favicon.png, apple-touch-icon.png, and og-image.png from the
// brand source at public/renoxium.png. Run with: node scripts/gen-icons.mjs
//
// Outputs land in public/ and are picked up by the Vite build.

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');
const SRC = resolve(PUBLIC, 'renoxium.svg');

const BG = '#14151B';      // brand dark
const ACCENT = '#4FB3FF';  // brand electric blue
const INK = '#F4EFE6';     // cream

async function main() {
  const srcBuf = await readFile(SRC);

  // ── 1. favicon.png (256x256, dark bg, R glyph centered) ────────────────
  // Bigger output than 32x32 so browsers can downsample crisply for various sizes.
  // SVG source has transparent background, so the glyph composites cleanly
  // on the dark canvas without any frame artefacts.
  const FAV = 256;
  const favGlyph = await sharp(srcBuf, { density: 600 })
    .resize({ width: Math.round(FAV * 0.66), height: Math.round(FAV * 0.66), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: FAV, height: FAV, channels: 4, background: BG },
  })
    .composite([{ input: favGlyph, gravity: 'center' }])
    .png()
    .toFile(resolve(PUBLIC, 'favicon.png'));

  console.log(`✓ favicon.png (${FAV}x${FAV})`);

  // ── 2. apple-touch-icon.png (1024x1024, dark bg, comfortable padding) ──
  // iOS expects a square that it will round itself. We render at 1024 so iOS
  // can downsample to its needed size (180, 167, 152, etc.) without blur.
  const ATI = 1024;
  const atiGlyph = await sharp(srcBuf, { density: 1200 })
    .resize({ width: Math.round(ATI * 0.6), height: Math.round(ATI * 0.6), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: ATI, height: ATI, channels: 4, background: BG },
  })
    .composite([{ input: atiGlyph, gravity: 'center' }])
    .png()
    .toFile(resolve(PUBLIC, 'apple-touch-icon.png'));

  console.log(`✓ apple-touch-icon.png (${ATI}x${ATI})`);

  // ── 3. og-image.png (1200x630, social share card) ──────────────────────
  // Composition (left to right):
  //   - Dark canvas with subtle radial glows in electric blue
  //   - R glyph on the left, anchored vertically center, scaled ~80% of height
  //   - On the right, an SVG with the eyebrow / headline / sub
  //   - Faint film-grain noise overlay
  const OG_W = 1200;
  const OG_H = 630;

  // Background canvas: solid dark + two soft radial glows rendered via SVG
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
    <defs>
      <radialGradient id="g1" cx="50%" cy="-10%" r="65%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.10" />
        <stop offset="60%" stop-color="${ACCENT}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="100%" cy="100%" r="55%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.07" />
        <stop offset="60%" stop-color="${ACCENT}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="${BG}" />
    <rect width="100%" height="100%" fill="url(#g1)" />
    <rect width="100%" height="100%" fill="url(#g2)" />
  </svg>`;

  // R glyph — sized to ~85% of canvas height, anchored at left
  const glyphHeight = Math.round(OG_H * 0.78);
  const ogGlyph = await sharp(srcBuf, { density: 1200 })
    .resize({ height: glyphHeight, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Right-side text composition as SVG (so we get crisp typography without
  // needing a font file at runtime — we use the system serif/sans webfont
  // names; sharp's librsvg falls back gracefully if the exact face is missing).
  const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
    <defs>
      <style>
        .eyebrow { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 18px; letter-spacing: 2.4px; fill: ${INK}; opacity: 0.62; }
        .h1      { font-family: Fraunces, Georgia, serif; font-size: 92px; font-weight: 400; letter-spacing: -3px; fill: ${INK}; }
        .h1-it   { font-family: Fraunces, Georgia, serif; font-size: 92px; font-weight: 400; font-style: italic; letter-spacing: -3px; fill: ${ACCENT}; }
        .sub     { font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif; font-size: 22px; fill: ${INK}; opacity: 0.68; }
        .footer  { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 13px; letter-spacing: 2.6px; fill: ${INK}; opacity: 0.40; }
      </style>
    </defs>
    <text x="540" y="190" class="eyebrow">RENOXIUM · SENIOR ENGINEERING STUDIO</text>
    <text x="540" y="305" class="h1">A studio that</text>
    <text x="540" y="395" class="h1-it">ships.</text>
    <text x="540" y="455" class="sub">A boutique team in Dubai. Briefs to prototypes</text>
    <text x="540" y="485" class="sub">in a week, v1 in a quarter.</text>
    <text x="540" y="585" class="footer">RENOXIUM.COM</text>
    <circle cx="1135" cy="582" r="5" fill="${ACCENT}" opacity="0.95"/>
  </svg>`;

  await sharp(Buffer.from(bgSvg))
    .composite([
      { input: ogGlyph, top: Math.round((OG_H - glyphHeight) / 2), left: 60 },
      { input: Buffer.from(textSvg), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, 'og-image.png'));

  console.log(`✓ og-image.png (${OG_W}x${OG_H})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

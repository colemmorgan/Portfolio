// Generates resized WebP variants of each photo in public/photos for use with
// srcset/sizes, so the browser can pick an appropriately sized image instead
// of everyone downloading the full-resolution source.
//
// Usage: node scripts/generate-photo-variants.mjs

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PHOTOS_DIR = path.resolve(import.meta.dirname, "../public/photos");
const WIDTHS = [400, 600, 800, 1000, 1200];
const QUALITY = 80;

const files = (await readdir(PHOTOS_DIR)).filter((f) => /\.png$/i.test(f));

for (const file of files) {
  const name = path.basename(file, ".png");
  const srcPath = path.join(PHOTOS_DIR, file);
  const metadata = await sharp(srcPath).metadata();

  for (const width of WIDTHS) {
    if (metadata.width && width > metadata.width) continue;

    const outPath = path.join(PHOTOS_DIR, `${name}-${width}.webp`);
    await sharp(srcPath).resize(width).webp({ quality: QUALITY }).toFile(outPath);
    console.log(`wrote ${path.relative(process.cwd(), outPath)}`);
  }
}

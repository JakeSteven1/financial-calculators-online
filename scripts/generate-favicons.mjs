// Generates favicons and app icons in public/, and a trimmed header logo, from
// the logo in src/assets.
// The sketch's thin lines vanish at tab size, so favicon.ico is rendered from
// public/favicon.svg, a bold hand-drawn trace of the same calculator.
// Run with `npm run favicons` after changing the logo. Output is committed.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const LOGO = new URL('../src/assets/calculator-logo.png', import.meta.url).pathname;
const OUT = new URL('../public/', import.meta.url).pathname;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/** The logo's line art on a white square with a margin; thin sketch lines are thickened for small sizes. */
async function icon(size, { margin = 0.12, thicken = 0 } = {}) {
  let art = sharp(LOGO).trim({ threshold: 20 });
  if (thicken) {
    // Blur the alpha channel and re-threshold it to widen the strokes before downscaling.
    const { data, info } = await art.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = await sharp(data, { raw: info }).extractChannel(3).blur(thicken).linear(4, 0).raw().toBuffer();
    for (let i = 0; i < alpha.length; i++) data[i * 4 + 3] = alpha[i];
    art = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }
  const inner = Math.round(size * (1 - 2 * margin));
  const scaled = await art.resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: scaled, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** A single-image .ico holding a PNG (supported by every current browser). */
function ico(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8); // palette size
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // offset of image data
  return Buffer.concat([header, png]);
}

await writeFile(`${OUT}favicon.ico`, ico(await sharp(`${OUT}favicon.svg`, { density: 288 }).resize(32, 32).png({ compressionLevel: 9 }).toBuffer(), 32));
await writeFile(`${OUT}apple-touch-icon.png`, await icon(180, { thicken: 0.6 }));
await writeFile(`${OUT}icon-192.png`, await icon(192, { thicken: 0.6 }));
await writeFile(`${OUT}icon-512.png`, await icon(512));
// The header uses the logo cropped to its artwork (the original is mostly empty margin).
await sharp(LOGO).trim({ threshold: 20 }).png({ compressionLevel: 9 }).toFile(new URL('../src/assets/calculator-logo-trimmed.png', import.meta.url).pathname);
console.log('favicons written to public/, trimmed logo to src/assets/');

// Full-page screenshots of representative pages at desktop and mobile widths.
// Usage: node scripts/screenshots.mjs <label>   → screenshots/<label>/*.png
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { serveDist } from './smoke.mjs';

const label = process.argv[2] ?? 'current';
const PAGES = {
  home: '/',
  hub: '/home-calculators-online/',
  mortgage: '/mortgage-loan-calculator-online/',
  compound: '/compound-interest-calculator-online/',
  mean: '/mean-online-calculator/',
};
const WIDTHS = { desktop: 1280, mobile: 390 };

const out = new URL(`../screenshots/${label}/`, import.meta.url).pathname;
await mkdir(out, { recursive: true });
const server = await serveDist();
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch();
for (const [device, width] of Object.entries(WIDTHS)) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  await ctx.route(/googlesyndication|doubleclick/, (r) => r.abort());
  for (const [name, path] of Object.entries(PAGES)) {
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelectorAll('astro-island').forEach((i) => i.scrollIntoView()));
    await page.waitForFunction(() => [...document.querySelectorAll('astro-island')].every((i) => !i.hasAttribute('ssr')), null, { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}${name}-${device}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(`screenshots saved to screenshots/${label}/`);

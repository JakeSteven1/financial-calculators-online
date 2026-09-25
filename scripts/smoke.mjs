// Headless smoke test of the built site at 390px: every page in dist/ must load
// without console errors, hydrate its islands, have exactly one H1, and not
// scroll sideways. Run after `npm run build`.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };

export function serveDist(port = 0) {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    try {
      const body = await readFile(join(DIST, path));
      res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

export async function listPages() {
  const entries = await readdir(DIST, { recursive: true });
  return entries
    .filter((f) => f.endsWith('index.html'))
    .map((f) => `/${f.replace(/index\.html$/, '')}`)
    .sort();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = await serveDist();
  const base = `http://localhost:${server.address().port}`;
  const pages = await listPages();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } });
  // Third-party ads are not under test; block them so runs are offline and deterministic.
  await ctx.route(/googlesyndication|doubleclick|google\.com/, (r) => r.abort());
  let bad = 0;
  for (const path of pages) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/googlesyndication|adsbygoogle|ERR_FAILED|ERR_BLOCKED/.test(m.text())) errs.push(m.text()); });
    page.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith(base)) errs.push(`${r.status()} ${r.url().slice(base.length)}`); });
    await page.goto(base + path, { waitUntil: 'load' });
    if (await page.$('astro-island')) {
      await page.evaluate(() => document.querySelectorAll('astro-island').forEach((i) => i.scrollIntoView()));
      await page
        .waitForFunction(() => [...document.querySelectorAll('astro-island')].every((i) => !i.hasAttribute('ssr')), null, { timeout: 8000 })
        .catch(() => errs.push('island not hydrated'));
    }
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) errs.push('horizontal overflow at 390px');
    const h1 = await page.$$eval('h1', (els) => els.length);
    if (h1 !== 1) errs.push(`h1 count ${h1}`);
    if (errs.length) { bad++; console.log(path, '->', errs.join(' | ')); }
    await page.close();
  }
  console.log(`smoke: checked ${pages.length} pages at 390px, problems on ${bad}`);
  await browser.close();
  server.close();
  process.exit(bad ? 1 : 0);
}

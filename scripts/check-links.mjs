// Checks every internal href/src in dist/ resolves to a built file, and reports
// how many distinct pages link to each calculator (the goal is at least 3).
// Run after `npm run build`. Exits 1 on broken links or under-linked calculators.
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { CALCULATORS } from '../src/data/calculators.ts';

const DIST = new URL('../dist/', import.meta.url).pathname;
const MIN_INBOUND = 3;

const files = (await readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'));
const broken = [];
const inbound = new Map(CALCULATORS.map((c) => [`/${c.slug}/`, new Set()]));
let checked = 0;

for (const file of files) {
  const html = await readFile(DIST + file, 'utf8');
  const from = `/${file.replace(/index\.html$/, '')}`;
  for (const [, attr, url] of html.matchAll(/\s(href|src|srcset|content)="([^"]+)"/g)) {
    const targets = attr === 'srcset' ? url.split(',').map((u) => u.trim().split(/\s+/)[0]) : [url];
    for (let target of targets) {
      target = target.replace(/^https:\/\/financialcalculatoronlinefree\.com(?=\/)/, '');
      if (attr === 'content' && !target.startsWith('/')) continue;
      if (!target.startsWith('/') || target.startsWith('//')) continue;
      const path = decodeURIComponent(target.split(/[?#]/)[0]);
      checked++;
      const exists = path.endsWith('/') ? existsSync(`${DIST}${path}index.html`) : existsSync(DIST + path);
      if (!exists) broken.push(`${from} -> ${target}`);
      else if (attr === 'href' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) broken.push(`${from} -> ${target} (no trailing slash)`);
      if (attr === 'href' && path !== from && inbound.has(path)) inbound.get(path).add(from);
    }
  }
}

for (const b of [...new Set(broken)]) console.log(`broken: ${b}`);
const weak = [...inbound].filter(([, s]) => s.size < MIN_INBOUND);
for (const [path, s] of weak) console.log(`under-linked: ${path} has ${s.size} inbound page(s)`);
const counts = [...inbound.values()].map((s) => s.size);
console.log(`links: ${checked} internal URLs checked, ${new Set(broken).size} broken; calculator inbound pages min ${Math.min(...counts)}, max ${Math.max(...counts)}`);
process.exit(broken.length || weak.length ? 1 : 0);

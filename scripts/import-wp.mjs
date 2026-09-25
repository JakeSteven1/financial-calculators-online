// Pulls pages and posts from the live WordPress REST API and writes them to
// src/content/pages/<slug>.md. Calculator widgets (Elementor HTML blocks,
// scripts, forms) are dropped; the prose is kept for the rebuilt pages.
import { mkdir, writeFile } from 'node:fs/promises';
import TurndownService from 'turndown';

const ORIGIN = 'https://financialcalculatoronlinefree.com';
const OUT_DIR = new URL('../src/content/pages/', import.meta.url);

async function fetchAll(type) {
  const items = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${ORIGIN}/wp-json/wp/v2/${type}?per_page=100&page=${page}`);
    if (!res.ok) break; // WP returns 400 past the last page
    const batch = await res.json();
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

function makeTurndown(dropHtmlWidgets) {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
  td.remove(['script', 'style', 'noscript', 'form', 'input', 'button', 'select', 'textarea', 'svg', 'iframe', 'canvas', 'label']);
  td.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);
  td.addRule('drop-images', { filter: 'img', replacement: () => '' });
  if (!dropHtmlWidgets) return td;
  td.addRule('drop-widgets', {
    filter: (node) => {
      const type = node.getAttribute?.('data-widget_type') ?? '';
      return /^(html|shortcode|button|image|spacer|divider|icon)\./.test(type);
    },
    replacement: () => '',
  });
  return td;
}
// Some pages keep all their prose inside an HTML widget; those get a second
// pass that keeps widget text (scripts and form controls are still dropped).
const tdStrict = makeTurndown(true);
const tdLoose = makeTurndown(false);

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

function convert(td, html) {
  let md = td.turndown(html);
  // Make internal link targets root-relative; leave URLs shown as text alone.
  md = md.replaceAll(`](${ORIGIN}/`, '](/').replaceAll(`](${ORIGIN})`, '](/)');
  md = md.replace(/^# .*$/m, ''); // the rebuilt page renders its own H1
  md = md.replace(/^(\d{1,2}|calculate)$/gm, ''); // Elementor step numbers / eyebrow labels
  md = md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  return md + '\n';
}

function toMarkdown(html) {
  const md = convert(tdStrict, html);
  return md.length >= 400 ? md : convert(tdLoose, html);
}

const yamlString = (s) => JSON.stringify(decodeEntities(s ?? '').replace(/\s+/g, ' ').trim());

await mkdir(OUT_DIR, { recursive: true });
const items = [...(await fetchAll('pages')), ...(await fetchAll('posts'))];
for (const item of items) {
  const seo = item.yoast_head_json ?? {};
  const description = seo.description ?? seo.og_description ?? item.excerpt?.rendered?.replace(/<[^>]+>/g, '') ?? '';
  const front = [
    '---',
    `title: ${yamlString(item.title.rendered)}`,
    `seoTitle: ${yamlString(seo.title ?? item.title.rendered)}`,
    `description: ${yamlString(description)}`,
    `wpId: ${item.id}`,
    `wpType: ${item.type}`,
    `modified: ${JSON.stringify(item.modified_gmt)}`,
    '---',
    '',
  ].join('\n');
  await writeFile(new URL(`${item.slug}.md`, OUT_DIR), front + toMarkdown(item.content.rendered));
  console.log(`${item.type} ${item.slug}`);
}
console.log(`Imported ${items.length} items`);

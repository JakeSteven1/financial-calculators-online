// Greps the visible text of every built page for WordPress import artifacts:
// stray "#" and Markdown, "£", broken link markup, HTML entities shown as text, mojibake, shortcodes, empty
// headings, doubled spaces, and list markers that did not become lists.
// Run after `npm run build`. Exits 1 if anything is found.
import { readFile, readdir } from 'node:fs/promises';
import { decodeHTML } from 'entities';

const DIST = new URL('../dist/', import.meta.url).pathname;

const CHECKS = [
  ['stray #', /(^|[^\w&/])#(?![\d])|#{2,}/],
  ['stray markdown', /\*\*|(^|\s)\*(\s|$)|(^|\s)__?\S|\\[#*_.()[\]]/],
  ['pound sign', /£/],
  ['broken link markup', /^\[$|^\]\(|\]\(\/[^)\s]*\)/],
  ['entity as text', /&(?:[a-z]{2,8}|#\d{2,5}|#x[\da-f]{2,4});/i],
  ['mojibake', /â€|Ã[\u0080-ÿ]|Â[ -¿ ]|ï»¿|�/],
  ['shortcode', /\[\/?[a-z_][\w-]*(?:\s[^\]]*)?\]/i],
  ['doubled space', /\S {2,}\S/],
  ['unconverted list', /(^|\n)\s*(?:[-*•]|\d+\.) \S.*\n\s*(?:[-*•]|\d+\.) \S/],
];

/** Text nodes of the page, one line per block, with markup (and so real entities) decoded. */
function visibleText(html) {
  const text = html
    .replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(p|div|li|h[1-6]|tr|td|th|br|section|article|summary|details|ul|ol|table|header|footer|nav|main|dt|dd|pre)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(nbsp|#160);/g, ' ');
  // Decode once, as the browser does; an entity still present afterwards was double-encoded and shows as text.
  return decodeHTML(text).replace(/\u00a0/g, ' ');
}

const EMPTY_HEADING = /<h([1-6])\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>|<(?:span|strong|em|b|a)\b[^>]*>\s*<\/(?:span|strong|em|b|a)>)*<\/h\1>/i;

const files = (await readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'));
let hits = 0;
for (const file of files.sort()) {
  const html = await readFile(DIST + file, 'utf8');
  const found = [];
  if (EMPTY_HEADING.test(html)) found.push(['empty heading', html.match(EMPTY_HEADING)[0]]);
  const lines = visibleText(html).split('\n').map((l) => l.trim()).filter(Boolean);
  const text = lines.join('\n');
  for (const [name, re] of CHECKS) {
    if (name === 'unconverted list') {
      const m = text.match(re);
      if (m) found.push([name, m[0].trim()]);
      continue;
    }
    for (const line of lines) if (re.test(line)) found.push([name, line.slice(0, 160)]);
  }
  for (const [name, sample] of found) console.log(`${file}: [${name}] ${sample}`);
  hits += found.length;
}
console.log(`artifacts: ${hits} hit(s) across ${files.length} HTML files`);
process.exit(hits ? 1 : 0);

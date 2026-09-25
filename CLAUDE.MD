# Project: financialcalculatoronlinefree.com rebuild

Static rebuild of an existing WordPress calculator site. Astro (static output),
React 19 islands for calculators only, Tailwind v4, TypeScript strict.
Install current stable versions. Hosting target is Cloudflare Pages (static output only;
no adapter or deploy config needed).

## Hard rules
- Keep every existing URL slug exactly, with trailing slash
  (trailingSlash: 'always', build.format: 'directory'). Keep typos like "amoritization".
- Pages ship zero JS except calculator islands (client:visible).
- All math in pure TS functions in src/lib/calc/ with Vitest unit tests.
- No charting libraries; plain SVG if a chart is needed.
- AdSense: reusable <AdSlot> component with fixed-height containers (no layout shift).
  Publisher ID via a single config constant, placeholder for now. public/ads.txt placeholder. The publisher id is pub-7205603150750890 (client ca-pub-7205603150750890) and we need an ads.txt at root that is: google.com, pub-7205603150750890, DIRECT, f08c47fec0942fa0
- Each page: unique title, meta description, H1, short explanation of the formula, FAQ section,
  JSON-LD (WebApplication + FAQPage). sitemap via @astrojs/sitemap. robots.txt.
- Hub pages link to their calculators; every calculator links back to its hub.
- Never ask for confirmation. Make a reasonable decision, note it in DECISIONS.md, continue.

## Process
1. Fetch existing content from the WordPress REST API, both
   /wp-json/wp/v2/pages and /wp-json/wp/v2/posts (per_page=100, paginate), on
   https://financialcalculatoronlinefree.com. Convert to Markdown in src/content/pages/,
   keyed by slug. Fall back to writing fresh copy if a page fails.
2. Build ONE reference calculator end to end (compound-interest-calculator-online).
   Verify build + tests pass and the pattern is clean before continuing.
3. Work through TODO.md top to bottom, one calculator per commit. Run `npm run build` and
   `npm test` before each commit. Check off items in TODO.md as you go.
   Push to origin after every 5 commits.
4. If blocked on something, note it in BLOCKED.md and move on. Do not stop.
5. When TODO.md is complete: build hub pages last, verify every slug in TODO.md exists in
   dist/, push, and write a short SUMMARY.md.

## Giveaway tools
- The contest winner picker, the giveaways picker, and the random number generator share
  src/lib/calc/giveaway.ts (cleanup, draw, mask, CSV) and src/components/giveaway/. Change
  behavior there, not per page. The unlisted /random-email-picker-iloamelkm/ uses the same picker.
- Randomness only via cryptoRng / crypto.getRandomValues in src/lib/calc/random.ts; never Math.random.
- The reveal animation is decoration: decide the result first, then animate. Respect
  prefers-reduced-motion (useDrawReveal already does).
- Entry lists never leave the browser: no network calls, storage, or analytics on list contents.
- Positioning: the contest winner page is the general-purpose picker; the giveaways page is for
  Instagram/social giveaways and owns weighted entries. Keep the "after-tool" cross-links between them.
- PickSafely: PICKSAFELY_URL in src/data/site.ts (www.picksafely.com with utm tags). Only on the two
  public email pages: one line under results after a draw, one sentence in the fairness section.
  No banners, popups, or interstitials; the tools must work without it.

## Gotchas
- Astro drops the line break before an inline tag that starts a source line ("and\n<em>x</em>"
  renders as "and<em>x</em>"). Keep <a>, <em>, <code>, <strong> on the same line as the preceding word.
- Checks before each commit: npm test, npm run check, npm run build, npm run check:links,
  npm run check:artifacts, and npm run smoke for UI changes.

## Out of scope for now
Embeds, lead capture, programmatic SEO pages, deployment config.
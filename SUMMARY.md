# Rebuild summary

Static Astro rebuild of financialcalculatoronlinefree.com, ready for Cloudflare Pages (`npm run build` → `dist/`).

## What was built
- **66 pages**: 59 calculators (every TODO.md calculator plus the compound interest reference), the homepage,
  5 hub pages, and the privacy policy. Every slug in TODO.md exists in `dist/` with a trailing slash,
  including the `amoritization` spelling.
- **Content**: 67 WordPress pages imported to `src/content/pages/*.md` (`npm run import:wp`); WordPress had 0 posts.
  The original prose renders under each calculator.
- **Per page**: unique title (original Yoast title), meta description, one H1, a "How it's calculated" formula
  section, FAQ, and JSON-LD (`WebApplication` + `FAQPage` + `BreadcrumbList` on calculators; `CollectionPage` + `FAQPage`
  on hubs). Sitemap from `@astrojs/sitemap` (66 URLs), `robots.txt`, `ads.txt`.
- **JS**: pages ship no first-party JS except calculator islands (`client:visible`). The only other scripts are the
  AdSense loader and Astro's island bootstrap.
- **Math**: 43 pure TS modules in `src/lib/calc/`, 175 Vitest tests. Shared libraries for loans/amortization,
  statistics, TVM, retirement, and text stats. Charts are plain SVG.
- **Ads**: `<AdSlot>` with fixed-height containers (no layout shift); publisher ID set once in `src/data/site.ts`.

## Verification
- `npm test`: 175 passed. `npm run build`: 66 pages. `astro check`: 0 errors.
- Headless Chromium at 390px on every page: all islands hydrate, no console errors, no horizontal overflow, one H1 each.
- Internal links: 0 broken, all root-relative with a trailing slash. Hubs link to every calculator in them;
  every calculator links back to its hub.

## Needs your attention (see BLOCKED.md)
1. **ads.txt uses `pub-7205603150750890` but the publisher ID is `pub-2644536267352236`.** One is likely wrong.
2. No AdSense ad unit IDs yet, so ad slots are empty placeholders.
3. `/random-email-picker-iloamelkm/` (unlisted premium page) was not rebuilt; decide whether to keep, redirect, or retire it.
4. Add a `/free-online-financial-calculators/ → /` 301 when you set up Cloudflare Pages.

Behavior changes from the WordPress versions (bug fixes, updated data, expanded inputs) are listed in DECISIONS.md.

## Commands
- `npm run dev`: local dev server
- `npm run build`: static build to `dist/`
- `npm test`: unit tests
- `npm run check`: type check
- `npm run import:wp`: re-pull WordPress content

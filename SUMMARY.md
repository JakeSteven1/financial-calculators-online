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

## Design and fixes phase
- **Copy cleanup**: removed WordPress import artifacts: duplicated hub menus, a duplicated article, broken bold
  headings, Elementor call-to-action remnants (literal `[` / `](/url/)`), 40 empty widget headings, KaTeX garbage, stray
  spacing. "Calculator below" pointers now say "above". `npm run check:artifacts` finds 0 hits.
- **Navigation**: Financial, Business, Statistics, Home, Personal Finance, with the logo linking home. Zero-JS
  `<details>` menu on mobile; the active hub is highlighted on hub pages and their calculators.
- **Internal links**: a "Related calculators" section (3–5 per page, from `src/data/related.ts`) and 32 contextual prose
  links. Vague homepage links like "[calculator](/)" were unlinked. Every calculator has at least 3 inbound pages.
- **Logo and icons**: header logo via astro:assets; `favicon.ico`, `favicon.svg`, apple-touch icon, 192/512 icons, and
  `site.webmanifest` (`npm run favicons`).
- **Images**: 21 WordPress images restored to `src/assets/images/` with alt text written from what each image shows;
  inline images are optimized and lazy-loaded; featured images are each page's `og:image` (logo fallback).
- **Social**: X/Twitter link in the footer, `Organization` JSON-LD on the homepage, full Open Graph and Twitter tags.
- **Design**: white background, neutral grays, one blue accent; calculator card with a prominent results panel;
  charts in their own cards with a validated palette; prose capped at 70ch; hub card grids; homepage organized by hub;
  new footer. axe-core reports no WCAG A/AA violations on any page.
- **Blocked items resolved**: publisher ID is `pub-7205603150750890` everywhere; `/random-email-picker-iloamelkm/`
  is an unlisted `noindex` working picker; `public/_redirects` 301s `/free-online-financial-calculators/` to `/`.

Current checks: 182 tests pass, `astro check` 0 errors, 67 pages built, 390px smoke test clean on all pages,
0 broken internal links. Details and reasoning are in DECISIONS.md under "Design and fixes phase".

## Ads
Every ad box serves the "Fincalc slots" display unit (`1963056538`, set as `ADSENSE_DEFAULT_SLOT` in `src/data/site.ts`):
two per calculator page (after the formula, and after the FAQ), one per hub and on the homepage. Nothing is blocked.

## Commands
- `npm run dev`: local dev server
- `npm run build`: static build to `dist/`
- `npm test`: unit tests
- `npm run check`: type check
- `npm run import:wp`: re-pull WordPress content (overwrites the hand-cleaned Markdown)
- `npm run smoke`: headless 390px check of every built page
- `npm run check:artifacts` / `npm run check:links`: import-artifact grep and internal link check on `dist/`
- `npm run screenshots <label>`: desktop and mobile screenshots to `screenshots/<label>/`
- `npm run favicons`: regenerate icons from the logo

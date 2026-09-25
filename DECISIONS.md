# Decisions

Choices made without asking, per CLAUDE.md.

## Setup
- Astro 7, React 19, Tailwind v4 (via `@tailwindcss/vite`), TypeScript strict, Vitest 5 — latest stable at build time.
- `@tailwindcss/typography` added to style the imported WordPress prose (`prose` classes). Not a charting lib.
- One `.astro` file per calculator in `src/pages/<slug>.astro` (outputs `<slug>/index.html` with `build.format: 'directory'`).
  A single dynamic route was rejected because Astro cannot hydrate a component chosen at runtime.
- `src/data/calculators.ts` is the single registry for calculator name, hub, and blurb. Hub pages and
  "back to hub" links read from it. Hub membership mirrors links on the original WP hub pages; pages the WP hubs
  did not link (`randomly-select-emails-for-giveaways`, `character-count-tool-free`, `our-free-financial-calculator`)
  were placed in the closest hub.
- Calculators compute live as inputs change (no Calculate button).

## Content
- WordPress import (`npm run import:wp`) keeps prose and drops Elementor HTML widgets (the old calculators),
  scripts, forms, and images. Pages whose prose lived entirely inside an HTML widget (under 400 chars after the
  strict pass) are re-converted keeping widget text. The first `#` heading is dropped since pages render their own H1.
- WP had 0 posts; 67 pages were imported. `random-email-picker-iloamelkm` (premium picker) and
  `free-online-financial-calculators` (the old homepage content) are imported but not in TODO.md.
- Page `<title>` defaults to the original Yoast SEO title to preserve rankings; meta descriptions are rewritten
  per page because several Yoast descriptions were truncated excerpts ending in "[…]".
- Imported prose may still mention a "Calculate" button from the old widgets; left as-is.

## Ads
- `ADSENSE_PUBLISHER_ID` in `src/data/site.ts` is `pub-2644536267352236` as specified.
- **`public/ads.txt` uses `pub-7205603150750890`, exactly as CLAUDE.md specified, which does not match the
  publisher ID above.** AdSense requires ads.txt to list the publishing account; confirm which ID is correct.
- No ad unit (slot) IDs were provided, so `<AdSlot>` renders a fixed-height reserved placeholder. Passing
  `slot="..."` renders a live `<ins class="adsbygoogle">` in the same fixed box.
- The AdSense loader script and per-slot `push()` are the only non-island JS; they are third-party and required.

## Charts
- Plain SVG stacked bar chart (`src/components/ui/BarChart.tsx`) rendered inside islands.

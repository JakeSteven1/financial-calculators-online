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

## Pages and SEO
- Hub pages and the homepage use `CollectionPage` + `ItemList` + `FAQPage` JSON-LD (plus `BreadcrumbList`/`WebSite`)
  instead of `WebApplication`, since they are directories rather than tools, and have no formula section.
  The privacy policy has no FAQ or JSON-LD.
- Calculator pages also emit `BreadcrumbList` JSON-LD and link to up to six sibling calculators in the same hub.
- The homepage renders the prose of the old WP front page (`free-online-financial-calculators`), which already
  301s to `/` on the live site.
- Nav label for the real-estate hub was "Real Estate"; superseded in the design phase (now "Home", as specified).
- Imported prose: internal links to the old domain (http/https, with or without trailing slash) are rewritten to
  root-relative URLs with a trailing slash. A build-time check found 0 broken internal links across 66 pages.
- Long URLs wrap and wide tables scroll inside `.prose` so no page scrolls sideways at 390px.
- FAQ answers with worked examples were checked against the calc library; several hand-estimated figures were corrected.

## Calculator behavior changes vs. the WordPress originals
- **Giveaway picker**: the page was a premium upsell. It is now a working free tool with weighted entries and
  unique winners; the paid-plan pitch, saved contests, and lead capture were not rebuilt (lead capture is out of scope).
- **Contest winner picker**: embed button/modal dropped (embeds out of scope). Uses Web Crypto instead of Math.random.
- **Fantasy trade values**: the original only valued picks 1–10. Now uses the full 224-pick Jimmy Johnson chart,
  with round + pick-in-round and league size (8–16 teams). Values for picks 1–10 are unchanged.
- **Life clock / life seconds**: life expectancy updated to CDC 2023 final data (78.4 all, 75.8 male, 81.1 female)
  from the original 76/73.2/79.1 and 79. Custom expectancy added.
- **Tile floor**: the original divided flat equipment and removal costs by square footage (a bug) and mislabeled
  square feet as "number of tiles". Now: area from length × width, waste %, flat equipment (~$79) and removal
  (~$652), per-sq-ft supplies ($1.06) and disposal ($0.93). Material prices kept from the original.
- **Life insurance**: the original was income × 10 + debts − 2× income if over 50 + $50k per dependent. Replaced with
  a DIME needs analysis (income × years, debts, mortgage, education per dependent, final expenses, minus existing
  coverage and savings); years default to "until 65", clamped to 5–20.
- **CLV**: the original's basic mode ignored the lifespan input. Unified into lifespan or retention mode with
  optional margin, discount rate, and CAC. Referral inputs dropped.
- **AI word count**: now estimates tokens (characters ÷ 4) against a chosen context window (8K–1M or custom) instead of
  a fixed 24,000-word limit. Context sizes are generic, not tied to named models, because those change often.
  Unique-word count and the original complexity score are kept.
- **Retirement planner**: all figures in today's dollars using real returns; the Traditional/Roth/Mixed selector is
  replaced by a single "tax rate on withdrawals" (use 0% for Roth). Adds a drawdown to find when savings run out.
- **Closing costs**: the original returned only 2%–5% of price. Now itemized (origination, appraisal, title, escrow,
  prepaid items) with the 2%–5% range shown for comparison.
- **Home affordability**: the original assumed a fixed 4% rate and 30% of income. Now uses your rate and term, taxes,
  insurance, HOA, and selectable DTI limits (28/36, 31/43, 36/45).
- **Mortgage loan**: the original fixed down payment at 20%. Now adjustable, with tax, insurance, HOA, PMI, and schedule.
- **Rent vs buy**: the original compared one year of costs. Now a multi-year net-cost comparison including equity,
  appreciation, selling costs, and the opportunity cost of the down payment.
- **Our Free Financial Calculator**: rebuilt as tabs reusing the Loan, Compound Interest, and Mortgage islands.
- All calculators update live as you type; no Calculate button.

## Not rebuilt
- `/random-email-picker-iloamelkm/` (unlisted premium tool page). See BLOCKED.md.

## Design and fixes phase

### Copy cleanup (task 1)
`npm run check:artifacts` greps the visible text of every page in `dist/` for stray `#`/Markdown, `£`, entities shown
as text, mojibake, shortcodes, broken link markup, empty headings, doubled spaces, and unconverted lists. It reports 0 hits.
No `£`, mojibake, shortcodes, or double-encoded entities were present; the fixes were:
- **Duplicated WordPress menus**: each hub page's prose opened with its nav menu twice (desktop and mobile copies).
  Both removed; the hub's calculator grid replaces them.
- **Duplicated article**: the refinance break-even page contained its long article (and references) twice. The copy
  without a heading was removed.
- **Broken bold in headings**: `## **Title` + `**` on the next line rendered literal `**` (5 hub headings). Bold markers
  inside headings were removed everywhere.
- **Elementor call-to-action boxes** rendered as literal `[`, "Try it now!", "Calculate!", `](/url/)` on 9 pages. Each is
  now one descriptive link ("Open the Hourly Wage to Salary Calculator"). The copied "Get started budgeting now!" text on the
  sample-size CTA was dropped.
- **Widget placeholder headings**: 40 headings like "Let's calculate that mortgage loan!" sat above the removed WordPress
  calculator and now introduced empty sections; removed. "More Calculators" eyebrows removed and the per-calculator
  sections under "You might also be interested in these Calculators" demoted to H3.
- Orphan button labels ("Let's Calculate!", "Let's Find The True Interest") and empty image-only links on the old homepage removed.
- KaTeX copy-paste triplication on the personal finance hub ("AAA", "A−B=ΔA – B = \DeltaA−B\=Δ") fixed to "A", "A − B = Δ".
- Two bold pseudo-headings on the CAC page became H2s.
- Non-breaking-space runs and doubled spaces collapsed; multiplication written as `*` in prose formulas now uses `×`.
- The Markdown in `src/content/pages/` is now hand-maintained: re-running `npm run import:wp` would overwrite these fixes.

### Navigation (task 2)
- Main nav is exactly Financial, Business, Statistics, Home, Personal Finance, taken from `HUBS` (order and labels are
  locked by a unit test). The Real Estate hub keeps its page name "Real Estate Calculators"; only the nav label is "Home".
- Desktop (≥768px) shows an inline list; below that a `<details>`/`<summary>` "Menu" disclosure (zero JS).
- Active hub: `hubForPath()` maps a hub page or calculator to its hub. The link gets a tinted background, with
  `aria-current="page"` on the hub page itself and `aria-current="true"` on its calculators.
- `src/data/calculators.test.ts` checks each calculator is registered once in one hub and that the registry matches the
  calculator page files one to one. Hub pages list from the registry; a build check found all 59 on their hub pages.

### Internal linking (task 3)
- `src/data/related.ts` holds 3–5 related calculators per calculator, ordered by relevance; `getRelated()` puts same-hub
  entries first. A "Related calculators" card grid replaces the old "More <hub>" list (which linked six arbitrary siblings).
  Unit tests check 3–5 valid, distinct, non-self entries and that every calculator is someone's related link.
- 32 contextual links added in the prose of 23 calculator pages (at most 2 per page), each on a phrase the sentence
  already contained (e.g. "amortization schedule", "closing costs", "Lifetime Value (LTV)"). No sentences were added.
- 21 vague links to the homepage from old WordPress copy ("[calculator](/)", "[calculations](/)") were unlinked; one
  "other calculators" link now points to the personal finance hub with that as its anchor text, and "compound interest
  formula" on the Rule of 72 page now links to the compound interest calculator.
- Copy that was wrong once the calculator moved above the prose was corrected: 17 "calculator below"/"scroll down" pointers
  now say "above", and the median and profit margin pages no longer open with "Before using our compound interest
  calculator" (copied from that page). "why this important" → "why it’s important"; "first et’s" → "first let’s".
- `npm run check:links` checks every internal URL in `dist/` and counts distinct pages linking to each calculator.
  Every calculator has at least 3 (hub, homepage, and at least one related or contextual link). Fewest (3): stock sale
  profit, life clock, fantasy draft pick trade value, and mortgage length calculators.

### Logo and favicons (task 4)
- The logo moved to `src/assets/calculator-logo.png` (the original). `npm run favicons` (`scripts/generate-favicons.mjs`,
  using `sharp`) writes `favicon.ico`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` to `public/`, plus
  `src/assets/calculator-logo-trimmed.png` for the header (the original is ~60% empty margin, so the calculator
  would render ~16px wide in a 40px header).
- The logo is a thin-line ink sketch on transparency. Rendered at 32px it is a faint gray smudge, and dark browser tab
  bars would hide it. So `public/favicon.svg` is a hand-drawn, bold trace of the same calculator (white body, dark outline
  and keys) and `favicon.ico` (32px, PNG-in-ICO) is rendered from it. The PNG app icons put the original artwork on white.
- The header logo uses `astro:assets` `<Image>` (WebP, 1x/2x) with empty alt, since the site name next to it is the link text.
- `site.webmanifest` lists the 192/512 icons; the base layout links the ICO, SVG, apple-touch icon, and manifest.

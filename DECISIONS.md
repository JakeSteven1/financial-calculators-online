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
- `ADSENSE_PUBLISHER_ID` in `src/data/site.ts` is `pub-7205603150750890` (client `ca-pub-7205603150750890`), matching
  `public/ads.txt`. (The first build used a mistyped ID; corrected in the design phase.)
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

### Images from WordPress (task 5)
- `/wp-json/wp/v2/media` has 66 items (one page of 100). All were downloaded and reviewed. WordPress page content
  had only 8 inline `<img>`s (7 calculator cards on the old front page, now the homepage prose, and the standard
  deviation formula on the statistics hub); everything else was featured images.
- Kept in `src/assets/images/` (21 files): every image used inline or as a featured image. File names follow the
  originals, lowercased and without WordPress suffixes (`-e1694437250559`); two meaningless names were replaced
  (`c01359cc-….webp` → `retirement-friends.webp`, `cropped-finanical-calculator-online.png` → `random-numbers.png`).
  Originals wider than 1600px were scaled down, and photographic PNGs over 500KB were stored as WebP (q88); the
  set is 2.6MB instead of 14.3MB. Astro still generates the served sizes.
- Not kept: the site logo uploaded twice (`calculator-e1685376841301.png`, `cropped-calculator-…png`), exact duplicates
  (`Tile-floor1.png` is the sales funnel image; `finanical-calculator-online.png`), a blank `Untitled-design4.png`, an
  Elementor screenshot, and 34 unused Elementor template images (Business Consulting Company logos, team, testimonial,
  and placeholder photos). The ChatGPT logo (featured image of the AI word count page) was not used: it is OpenAI's
  trademark and would imply an affiliation, so that page falls back to the logo.
- Inline images are Markdown images in `src/content/pages/*.md`, so astro:assets processes them: WebP, width/height,
  `loading="lazy"`, and with `image.layout: 'constrained'` a `srcset`/`sizes`. None are above the fold (they sit in
  the prose below the calculator or hub grid). The header logo is the only eager image.
- Alt text was written from what each image shows; several WordPress alts were wrong (the home-loan image was
  "retirement calculator", the calculator illustration "Calculator count tool", the numbers graphic "random numbers" on
  a contest page). The alt texts live in `src/data/images.ts` and in the Markdown.
- `og:image` is the page's WordPress featured image (`getFeaturedImage()`), rendered as a JPEG up to 1200px wide with
  width, height, type, and alt tags. Pages without one, or whose featured image was the logo, use `/icon-512.png`.
  The mode calculator's featured image is a molecule model; it was kept because it is what WordPress used.
- `npm run check:links` now also verifies absolute `og:image` URLs on this domain.

### Social and identity (task 6)
- `TWITTER_HANDLE`, `TWITTER_URL`, and `LOGO_URL` live in `src/data/site.ts`.
- Footer: an inline-SVG X/Twitter icon linking to https://twitter.com/FinCalcsOnline, with
  `aria-label="Follow @FinCalcsOnline on X (Twitter)"` and `rel="me"`. The icon is the current X mark, since the
  twitter.com URL now redirects to x.com.
- Homepage JSON-LD adds `Organization` (name, url, logo = `/icon-512.png`, sameAs = the Twitter URL) next to `WebSite`.
- Every page now has `og:locale`, `og:image` with type/size/alt (task 5), and `twitter:site`, `twitter:title`,
  `twitter:description`, `twitter:image`, `twitter:image:alt`. `twitter:card` is `summary_large_image` for wide
  featured images and `summary` for the square logo fallback.

### Design refresh (task 7)
- **Color**: white body (the old `bg-slate-50` tint is gone), Tailwind's neutral `gray` scale for text and borders
  (replacing the blue-tinted `slate`), and one accent. The logo is monochrome ink with no hue to derive from, so the grays
  follow its ink and the accent is blue (`brand-600` #2563eb, links `brand-700` #1d4ed8 at 6.7:1 on white). Blue
  replaced the old green because green and red also carry gain/loss meaning in results.
- **Charts** use a fixed categorical order validated with the dataviz palette checker (lightness, chroma, CVD
  separation, contrast all pass): blue #2563eb, amber #d97706, teal #0d9488, violet #9333ea. "Contributions" in
  contributions-vs-growth charts is a deliberate neutral gray (#6b7280). Stacked segments have a 2px white gap, charts sit
  in their own card with a visible title and legend, and the bar chart draws at its container's pixel width so axis text
  stays 12px (it was ~8px at 390px). Break-even lines are 2px blue/amber.
- **Calculator pages**: breadcrumb (Home / hub / calculator), H1 and summary capped at 70ch, then the calculator card
  (rounded-2xl, border, soft shadow), inputs on the left and a tinted results panel with the headline number at 36px.
  Order below: formula, ad, prose, FAQ, ad, related calculators. Ads never sit inside the card or between inputs and
  results; the first ad moved from directly under the calculator to after the formula section.
- **Prose** is capped at 70ch (`.prose { max-width: 70ch }`); FAQ at `max-w-3xl`.
- **Hubs**: breadcrumb, intro, card grid (name + one-line blurb). **Homepage**: intro, category jump links, then the
  five hubs in nav order, each with a heading, one-line blurb (`Hub.blurb`), "All N …" link, and its calculator grid.
- **Footer**: logo and disclaimer, hub links, privacy policy, X/Twitter link, copyright row.
- **Ad placeholders** are a plain `bg-gray-50` box (was a dashed outline, which looked broken) and are no longer
  `<aside>` landmarks: two per page with the same label failed axe's `landmark-unique`.
- **Accessibility**: axe-core (WCAG 2 A/AA + best practice) on all 66 pages reports no violations. Fixes made on the way:
  `text-gray-500` on the blue results tint (4.44:1) → `gray-600`; headings inside calculators promoted from H3 to H2
  (they came before any H2); the amortization and rent-vs-buy scroll areas are focusable labeled regions; the empty
  corner header of the rate comparison table has screen-reader text. `:focus-visible` shows a 2px blue outline;
  inputs show a blue ring. Every input already had a `<label for>` via `useId()`.
- Screenshots (1280px and 390px) of the homepage, the real estate hub, and the mortgage, compound interest, and mean
  calculators are in `screenshots/before/` and `screenshots/after/` (gitignored; `npm run screenshots <label>`).
- Copy: "ever-growing number financial calculators" → "number of financial calculators" on four hubs.

### BLOCKED.md items (task 8)
- AdSense publisher ID set to `pub-7205603150750890` in `src/data/site.ts` (the only place it is used); the old ID was
  also replaced in CLAUDE.MD. `public/ads.txt` is exactly `google.com, pub-7205603150750890, DIRECT, f08c47fec0942fa0`
  plus a trailing newline.
- `/random-email-picker-iloamelkm/` is a standalone page on `BaseLayout` (not in the calculator registry, so it cannot
  appear on hubs or in related links) using `EmailWinnerPicker allowWeighting`. `BaseLayout` gained a `noindex` prop, and
  the sitemap integration filters the page out via `UNLISTED` in `astro.config.mjs`. The imported WordPress copy was not
  used because it described features that no longer exist (saved contests, embed code, non-cryptographic randomness);
  the page has short accurate notes and a link to the public giveaway picker instead.
- `public/_redirects` (Cloudflare Pages format): `/free-online-financial-calculators/ / 301`.

### Ad unit
- The "Fincalc slots" unit (`1963056538`) is `ADSENSE_DEFAULT_SLOT` in `src/data/site.ts` and `<AdSlot>`'s default, so
  every ad box serves it (AdSense allows one unit to be used several times on a page). Pass `slot="…"` to use another unit.
- The unit was created as responsive, but `data-ad-format="auto"` and `data-full-width-responsive="true"` from the AdSense
  snippet are deliberately omitted: with them, AdSense can resize the ad after load and shift content. Without them it
  fills the fixed-height `<ins>` box (90/100px banner, 280px rectangle), which is Google's documented way to fix the size
  of a responsive unit. The loader script from the snippet was already in `<head>`.

## Giveaway tool phase

### Contest winner picker (task 1)
- Shared pieces: `src/lib/calc/giveaway.ts` (cleanup, draw, mask, CSV; tested) and `src/components/giveaway/`
  (`EntryInput` paste/upload/drop box, `useDrawReveal` + `RollingDisplay`, `WinnerResults`, `ResultActions`).
  `EmailWinnerPicker` is rebuilt on them and still powers all three email pages, including the unlisted one.
- **Parsing**: entries split on new lines, commas, semicolons, and tabs (not spaces, so "Jane Doe" stays one entry).
  CSV quotes are stripped. Duplicates are matched case-insensitively and the first spelling is kept.
- **"Ignore invalid emails"** is on by default: it drops CSV header rows and name columns from an uploaded export.
  Turned off, any text is a valid entry (names, ticket numbers, social handles).
- **Limits**: 1 to 50 winners, 0 to 50 alternates (typed values are clamped). Uploads up to 20 MB. Winners and
  alternates are one draw without replacement, so nobody can appear twice.
- **Randomness**: the existing `cryptoRng` (53 bits from `crypto.getRandomValues`) and partial Fisher-Yates shuffle.
  The float-to-index bias is below n / 2^53, far too small to matter, so no rejection sampling. Weighted draws moved to
  an array-based `weightedSampleIndexes` (O(n) per pick, zeroing the winner's weight) so 100k entries stay fast.
- **Reveal**: the result is decided before the animation starts. 1.4 s of rolling entries (picked with `cryptoRng`,
  hidden from screen readers), then winners fade up in turn via `motion-safe:animate-reveal`. With
  `prefers-reduced-motion: reduce` the results appear immediately and the fade is off.
- **Results**: draw time in the visitor's locale with time zone; the CSV has an ISO timestamp. The mask toggle
  (`j***@gmail.com`, `@j***` for handles, `J***` for names) applies to the screen, copied text, and CSV together, so
  what you see is what you share. CSV fields starting with `= + - @` get a leading apostrophe (formula injection).
- **Performance** (headless Chromium): pasting 10,000 lines takes about 0.2 s, typing afterwards ~30 ms per key; 50,000
  lines paste in ~1 s. The stats use `useDeferredValue` so typing isn't blocked by re-parsing.
- **Copy**: the imported WordPress prose claimed `Math.random()`, no duplicate checking, and "premium" features; it was
  rewritten as a how-to and fairness tips. Title and H1 are unchanged for SEO; the meta description was rewritten.
  `CalculatorLayout` gained `formulaHeading` so this section reads "How the random draw works".
- `Button` gained a `disabled` prop. `check-artifacts` now lets masked emails (`j***@`) through its bold-markup check.
- Fixed a pre-existing rendering bug: Astro drops the line break before an inline tag at the start of a source line,
  gluing words ("and<em>e</em>"). Fixed on the representative sample, both giveaway pages, and the unlisted picker.

### Giveaway page and random number generator (task 2)
- **Giveaways page** (`/randomly-select-emails-for-giveaways/`): same `EmailWinnerPicker` with `allowWeighting`,
  reframed around Instagram and social giveaways: bonus entries for tags and shares, @handles with the email filter off,
  alternates for winners who don't reply, masked results for posts and stories. Weighted entries stay off by default so a
  plain list behaves the same as on the contest page. The old "Premium features" copy (saved contests, ad-free) described
  things that don't exist and was replaced by a feature rundown and an Instagram giveaway how-to (including Instagram's
  "not sponsored by Instagram" requirement). Hub blurb updated.
- **Contest winner page** stays the general-purpose picker (newsletter contests, raffles, sweepstakes).
- **Cross-links**: `CalculatorLayout` has an optional `after-tool` slot directly under the tool. Each email page points
  to the other there with a one-line reason to switch, and the number generator points to both. The rewritten prose on
  all three pages links the others too. Links in that slot are underlined (axe `link-in-text-block`).
- **Random number generator**: same `useDrawReveal` (rolling numbers from the range), draw time, "Copy numbers", and
  "Download CSV" (`Draw, Number, Drawn at, Min, Max`; min and max are separate numeric columns so a negative range isn't
  apostrophe-escaped). Up to 50 numbers show as cards that fade in; more show as a scrollable, focusable list. FAQ adds
  rerun, storage, and raffle questions. The imported prose said the tool was pseudo-random; it now explains the secure
  generator and has a raffle how-to. No PickSafely mention here (task 3 scopes it to the email pages).

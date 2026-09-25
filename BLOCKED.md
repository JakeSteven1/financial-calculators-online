# Blocked / needs a decision

## AdSense ad unit IDs
None were provided, so every `<AdSlot>` renders a fixed-height empty placeholder (a light gray box). Pass
`slot="<ad unit id>"` to `<AdSlot>` in `CalculatorLayout.astro` and `HubLayout.astro` to serve ads. The publisher ID
(`pub-7205603150750890`) and `ads.txt` are set.

## Resolved in the design and fixes phase
- **Publisher ID mismatch**: `src/data/site.ts` now uses `pub-7205603150750890`, matching `public/ads.txt`.
- **`/random-email-picker-iloamelkm/`**: rebuilt as an unlisted working picker (weighted entries), `noindex`, and left
  out of the sitemap, nav, and hubs.
- **`/free-online-financial-calculators/` redirect**: `public/_redirects` has `/free-online-financial-calculators/ / 301`.

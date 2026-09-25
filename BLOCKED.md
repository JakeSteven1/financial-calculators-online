# Blocked / needs a decision

Nothing is currently blocked.

## Resolved in the design and fixes phase
- **AdSense ad units**: every `<AdSlot>` serves the "Fincalc slots" unit (`1963056538`).
- **Publisher ID mismatch**: `src/data/site.ts` now uses `pub-7205603150750890`, matching `public/ads.txt`.
- **`/random-email-picker-iloamelkm/`**: rebuilt as an unlisted working picker (weighted entries), `noindex`, and left
  out of the sitemap, nav, and hubs.
- **`/free-online-financial-calculators/` redirect**: `public/_redirects` has `/free-online-financial-calculators/ / 301`.

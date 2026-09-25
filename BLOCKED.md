# Blocked / needs a decision

## `/random-email-picker-iloamelkm/` (premium email picker)
Live on WordPress (HTTP 200), not in TODO.md, not in the Yoast sitemap. The random suffix suggests an unlisted URL
given to paying customers. Rebuilding it as a public free page would give away the premium product, and dropping it
breaks the link for anyone who paid. Premium gating and lead capture are out of scope, so it was not rebuilt.
The imported content is in `src/content/pages/random-email-picker-iloamelkm.md`.

**Decision needed:** keep it as an unlisted page (add `src/pages/random-email-picker-iloamelkm.astro` with
`noindex`, reusing `EmailWinnerPicker allowWeighting`), redirect it to `/randomly-select-emails-for-giveaways/`, or retire it.

## ads.txt publisher ID mismatch
`public/ads.txt` contains `pub-7205603150750890` exactly as CLAUDE.md specified, but the AdSense publisher ID in
`src/data/site.ts` is `pub-2644536267352236`. AdSense requires ads.txt to authorize the account that serves the ads,
so if these differ, ads may be limited or unpaid. Confirm which ID is correct and update one of them.

## AdSense ad unit IDs
None were provided, so every `<AdSlot>` renders a fixed-height empty placeholder. Pass `slot="<ad unit id>"` to
`<AdSlot>` (in `CalculatorLayout.astro` and `HubLayout.astro`) to serve ads.

## `/free-online-financial-calculators/` redirect
On WordPress this URL 301s to `/`. The static build has no page there. Deployment config is out of scope, so no
redirect was added; when deploying to Cloudflare Pages, add `/free-online-financial-calculators/ / 301` to `public/_redirects`.

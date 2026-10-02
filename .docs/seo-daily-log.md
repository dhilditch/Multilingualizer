# Multilingualizer SEO implementation log

## Authority and schedule

Dave authorised the five initial improvements and daily implementation of the top three SEO recommendations on 2 October 2026. The active app heartbeat `multilingualizer-daily-seo-improvements` returns to this chat daily at 10:00 Europe/Athens. The local computer must be on and the app running for local work.

Prioritise measurable qualified organic traffic and product/affiliate progression. Publish verified SEO improvements within this authority. Preserve current URLs, the Themify layout and Multilingualizer JavaScript. Do not make speculative daily edits to fill a quota. Allow each SEO experiment 28 days before revising it unless correcting an error. Record fewer than three actions if fewer are justified.

For each run, record the evidence period, query and intent, product fit and CTA, competing internal URLs, exact changes, live verification, commit/push state and measurement checkpoints. Keep raw analytics, customer data and live backups in gitignored `data/`.

## 2 October 2026: initial five improvements

Status: deployed to live. Final verification and repository record below.

### 1. Weglot pricing calculator

- Target: `weglot pricing` and Squarespace pricing variants. Intent: estimate the applicable subscription and check implementation requirements.
- Baseline: 600 impressions, zero clicks, average position 8.06 in 1–28 September. The query `weglot pricing` accounted for 134 visible impressions.
- Change: shorter query-led title and description; immediate starting-price answer; direct explanation of the three calculator modes and emailed scan; current pricing check.
- Fit/CTA: Weglot affiliate plans and an AJAX-priced one-time Multilingualizer callout. URL retained: https://www.multilingualizer.com/weglot-pricing-calculator-squarespace/.
- Internal competition: word-count explainer and small-site value guide retain their distinct intents.
- Sources: https://www.weglot.com/pricing and Squarespace's official Weglot documentation.
- Measure: page CTR and clicks, calculator use and affiliate clicks. Check 9 October, 30 October and 31 December, using comparable windows.

### 2. GoDaddy guide

- Target: GoDaddy multilingual/bilingual website. Intent: identify a viable implementation route for the exact GoDaddy product.
- Baseline: seven clicks, 441 impressions, position 6.88 in 1–28 September.
- Change: replace invented vendor rationale, old subscription pricing, incorrect language-tag syntax and unverified whole-page HTML-embed installation claims. Explain builder/hosting distinctions, regional dual-language support, manual-page workflow and commercial-journey checks.
- Fit/CTA: builder comparison and Squarespace hub; Multilingualizer is promoted in its verified Squarespace context rather than as an untested GoDaddy installation.
- Internal competition: `/godaddy-multilingual-website/` remains unchanged pending canonical/consolidation evidence. No redirect.
- Sources: GoDaddy custom-code documentation and service agreement, checked 2 October.
- Measure: clicks and reader progression to comparison/hub/product. URL: https://www.multilingualizer.com/godaddy-website-builder-no-multilingual-fix/.

### 3. Builder comparison

- Target: best website builder for multilingual/global sites. Intent: compare platform workflows before choosing or migrating.
- Baseline: 118 impressions, one click, position 7.76 in 1–28 September.
- Change: direct answer, six-builder comparison including Squarespace, native Wix/Shopify routes, corrected Webflow entry-level price and explicit workflow/SEO distinctions. Remove unsupported universal compatibility and obsolete subscription claims.
- Fit/CTA: Squarespace Multilingualizer one-time product or Weglot calculator, depending on requirements. Existing platform guides retain setup intent.
- Sources: official Wix, Shopify, Webflow, Squarespace, GoDaddy, Weebly and Weglot documentation, checked 2 October.
- Measure: query/page CTR, clicks and CTA events. URL: https://www.multilingualizer.com/website-builders-multilingual-support-comparison/.

### 4. Squarespace hub

- Target: `squarespace multilingual`. Intent: choose and implement the appropriate multilingual approach.
- Baseline: 72 impressions, zero clicks, average position 15.03 in 1–28 September.
- Change: visible text H1, clearer three-route decision, one-time product CTA and actionable implementation sequence; preserve Themify row/column/media/style metadata. Reinforce contextual backlinks from ranking support articles.
- Fit/CTA: manual editorial control with Multilingualizer, managed translation with Weglot, or separately maintained pages. Pricing uses `[ssp_price product="4462"]`.
- Internal competition: calculator remains a pricing page; checkout, SEO and word-count guides remain specialised pages. No competing new URL.
- Measure: ranking/CTR for hub queries and progression to product or calculator. URL: https://www.multilingualizer.com/make-squarespace-multilingual/.

### 5. Measurement

- Confirmed reporting defect: the generated GSC summary sums query rows and misses anonymised queries. Actual date-row totals for 1–28 September are 28 clicks and 2,597 impressions; the query-row summary shows three clicks and 617 impressions.
- Correct collector to use date rows, retain query rows for opportunity discovery, and verify against the stored real report.
- GA4 has zero purchases/key events in the reviewed period. That alone is not proof that purchase tracking is broken. Verify the installed commerce events and compare paid-order aggregates before making that claim.
- Use the installed analytics script's `data-ssa-event` support for distinct affiliate and owned-product actions, preserving consent behaviour. Affiliate clicks are not affiliate sales.
- Refreshed reporting for 2–29 September: 26 clicks and 2,599 impressions, versus 13 clicks and 1,389 impressions in the preceding 28 days. These pre-change results are not attributed to today's edits.
- Verified real browser clicks in both the first-party database and GA4 Realtime: one `affiliate_click_weglot` from the calculator and one `multilingualizer_product_click` from the Squarespace hub. These two events are verification traffic, not lead or sale evidence. Existing checkout events are present in GA4.
- Read-only WooCommerce aggregate check for 1–28 September found zero completed/processing orders, one on-hold order and one trashed order. Zero recorded GA4 purchases therefore does not demonstrate a broken purchase event. No test purchase was made.
- Remaining configuration: Google Analytics Admin API is disabled in Google Cloud project `555360471471`. Dave must enable it before named affiliate/product events can be inspected and marked as GA4 key events through the API. Reporting access already works. Enable at https://console.developers.google.com/apis/api/analyticsadmin.googleapis.com/overview?project=555360471471. Confirm write permission separately after enabling; do not grant unnecessary access. Click events measure progression, not affiliate sales.

### Verification and safeguards

- `npm run check`: 16 tests passed and configuration validated. The reporting regression check was observed failing when the production helper used query rows, then passing with date rows.
- The live calculator returned Business at €29/month for 9,000 source words and two destination languages, correctly estimating 18,000 translated words.
- Browser review confirms the hub retains its original two-column dark hero, images and yellow CTA. Screenshot and private original snapshots are under gitignored `data/seo-backups/2026-10-02/`.
- Themify JSON required doubled backslashes at the MCP write boundary because WordPress unslashes meta input. Readback now validates the exact builder JSON. No theme or Multilingualizer JavaScript changes.
- GridPane initially served stale public HTML after the writes. Verification uses normal canonical URLs, not cache-busted pages; affected URLs were loaded to trigger refresh before the final check.
- Daily heartbeat is active at 10:00 Europe/Athens. The computer must remain on with Codex running. It will select three justified actions, preserve experiments for 28 days and report if fewer worthwhile actions exist.
- Final live check passed: 12 public pages, 25 internal routes, correct canonicals, one H1 each, rendered calculator and dynamic pricing, named CTA attributes, and exact equality of Themify structure after excluding edited text content.
- Repository record: task changes committed and pushed to `main` in `dhilditch/Multilingualizer` with message `Refresh priority SEO pages and schedule daily improvement loop`. Raw reports, screenshots and private backups remain uncommitted.

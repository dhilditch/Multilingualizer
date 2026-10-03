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

## 2 October 2026, 10:00 Europe/Athens: scheduled review

Fresh GSC and GA4 collection completed. The available reporting window remains 2–29 September, with 26 GSC clicks and 2,599 impressions. GA4 shows 220 sessions, 19 engaged sessions and zero recorded purchases. None of this covers today's edits. The four query-derived opportunities overlap the initial improvements, so those experiments remain unchanged until the 30 October review. Three untouched pages have enough existing visibility or verified defects to justify the following actions.

### 1. Correct the beginner bilingual guide

- Query/intent: how to make a website bilingual; a practical setup and workflow choice. Page-level evidence is 34 impressions, zero clicks, position 8.76. Query-level counts are suppressed or absent, so this is a page-based prioritisation, not a claimed observed query.
- Before: no meta description; $3.99/month pricing and a free-trial CTA; invented ordinary-text `[en]` wrappers; unsupported universal installation and legal/SEO claims.
- After: five-step guide covering platform checks, workflow, content review, correct Multilingualizer punctuation, language switching and journey testing. Replaced obsolete pricing with `[ssp_price product="4462"]` and a tracked one-time purchase callout. Added useful links to the existing comparison, Squarespace hub, calculator, SEO guide, checklist and support instructions.
- Sources checked live: on-page translation and Squarespace installation documentation; Google's multilingual-site documentation. No claimed customer percentages, search guarantee or universal platform compatibility.
- Product fit/CTA: manual translations in the Squarespace editor; `multilingualizer_product_click` to product 4462. Other platform users go to the builder-specific choice guide.
- Internal competition: retains broad beginner intent rather than copying Squarespace setup or Weglot pricing intent. Existing URL retained: https://www.multilingualizer.com/how-to-make-website-bilingual-beginners-guide/.
- Success measures: page CTR/clicks and progression to hub, calculator or product, checked 9 October, 30 October and 31 December. No redirects or deletions.

### 2. Correct Zoho's mistaken search metadata

- Query/intent: Zoho Sites multilingual setup. Page has 15 impressions, zero clicks, position 15.27; no claim of observed query-level volume.
- Verified public defect: `/make-zoho-sites-multilingual/` rendered the title `Make Squarespace Multilingual - Multilingualizer` and a Squarespace description.
- Changed only Yoast title and description to identify Zoho and the content actually present: installation instructions, translated text and language markers. No new compatibility, timing or platform feature claims. Existing Themify content/layout remains byte-for-byte unchanged.
- Product fit/CTA: existing setup/product route retained. No new competing URL or promise. Measure page CTR and clicks at the same 7/28/90-day checkpoints.
- URL: https://www.multilingualizer.com/make-zoho-sites-multilingual/.

### 3. Make the product search snippet match the offer

- Query/intent: Multilingualizer product/manual Squarespace translation purchase. Product page has 50 impressions, zero clicks, position 14.32; query-level volume not asserted.
- Before: generic `The right solution for your website` title and a description promising discovery in any language.
- After: title `Multilingualizer: pay once, use forever | Squarespace translations` and a description of editor-native translations, one-time purchase and no monthly/yearly fees. Does not hard-code a visitor currency.
- Source: existing product and configuration, verified read-only. No product price, licence, checkout, reviews, content or Themify settings changed.
- Internal competition: product purchase intent remains separate from the Squarespace hub, comparison and beginner guide. Existing purchase CTA remains unchanged. Measure product-page organic CTR and purchasing progression at 7/28/90 days.
- URL: https://www.multilingualizer.com/product/multilingualizer/.

### Run record

- Originals and readback snapshots saved under gitignored `data/seo-backups/2026-10-02-daily/`. The dated script defaults to verification; `--apply` performs the authorised changes.
- Google Analytics Admin API enablement is still waiting on Dave. Tracking works; no extra permissions or credentials were changed during this run.
- Remaining legacy product-body claims about search, competitors, universal compatibility and checkout require a separate sourced review. Today's product edit is metadata-only and does not validate those claims. Zoho's missing H1 is also left for a separate builder-text edit rather than changing its layout during this snippet correction.
- Final verification passed for all three public canonical pages and 13 internal links. Exact title/description readback, rendered tracked CTA and AJAX price, unchanged non-SEO metadata and metadata-only page bodies checked. Browser review and screenshot confirm the beginner guide's published layout. `npm run check` passed all 16 tests; `git diff --check` passed.
- Task changes committed and pushed to `main` in `dhilditch/Multilingualizer` with message `Correct beginner guide and targeted search snippets`. Private analytics and snapshots remain uncommitted. No background jobs left running.

## 3 October 2026, 10:00 Europe/Athens: scheduled review

Collected fresh GSC/GA4. Date-dimension GSC totals for 3–30 September: 26 clicks and 2,478 impressions, compared with 13 clicks and 1,510 impressions in the preceding 28 days. GA4: 225 sessions, 21 engaged sessions and zero purchases. These windows predate the October interventions, so no gain is attributed to them. Yesterday's experiments remain untouched until their 28-day review on 30 October.

### 1. Correct Webflow pricing and comparison content

- Target intent: Webflow Localization pricing and lower-cost workflows. Page evidence: 53 impressions, zero clicks, position 8.55. Query-level volume isn't asserted.
- Reproduced publicly: title and text treated $29 as the only native tier; article offered Multilingualizer at $3.99/month with a free trial, invented language-tag syntax, an automatic selector and untested universal installation promises.
- Existing post 44675 refreshed with Essential/Advanced rates, locale-count arithmetic, native/manual/third-party workflow checks, the documented Ecommerce limitation, search-URL distinctions and dynamic one-time Multilingualizer pricing. No claim of a new Webflow compatibility test.
- Sources checked 3 October: Webflow pricing and Localize overview; Google multilingual URL guidance. Published rates are described as displayed monthly equivalents; the article tells readers to confirm billing commitment and complete Site plan charges instead of promising a particular checkout schedule.
- Fit/CTA: owned-product click for manually maintained translations; calculator for a managed-service cost estimate, explicitly separating its Squarespace instructions from a Webflow setup. Links to the existing builder comparison and Squarespace hub.
- Internal competitors: `/webflow-multilingual-cheap-alternative/` and `/multilingualizer-vs-webflow-localization/` remain unchanged pending consolidation authority. No new URL, redirect or deletion.
- URL: https://www.multilingualizer.com/webflow-localization-too-expensive-alternative/.
- Measure page clicks/CTR and progression to product/calculator on 10 October, 31 October and 1 January 2027.

### 2. Correct the Weebly setup guide

- Target intent: Weebly multilingual setup. Page evidence: 75 impressions, zero clicks, position 9.32. Query-level volume isn't asserted.
- Reproduced publicly: obsolete monthly/free-trial offer, invented `ml-en`/`ml-es` authoring classes and an automatic-selector claim. Embed Code was presented as sufficient for the site-wide installation.
- Existing page 44639 refreshed around the documented Settings/SEO/Header Code route, punctuation markers, separately configured selector, managed Weglot route, language-URL requirements and commercial-journey tests. One-time price uses `[ssp_price product="4462"]`; product link carries `multilingualizer_product_click`.
- Sources: live Multilingualizer Weebly installation, on-page text and selector guides; official Weglot Weebly integration; Google multilingual URL guidance. Weebly's own multilingual help URL returned no readable body, so no claim about the absence of native functionality relies on it. Removed the old blanket feature-absence claim.
- Fit/CTA: manual editorial control with Multilingualizer, or the calculator and vendor instructions for managed translation. No new template or checkout compatibility claims.
- Internal competition: installation KB remains a focused reference; this existing page remains the workflow chooser. Builder comparison and beginner guide provide contextual routes. No duplicate URL created.
- URL: https://www.multilingualizer.com/weebly-multilingual-website/.
- Measure clicks/CTR and product progression on 10 October, 31 October and 1 January 2027.

### 3. Connect Squarespace installation to planning and launch guides

- Target intent: install Multilingualizer on Squarespace. Existing installation page has 22 impressions, zero clicks, position 20.41.
- Added one introductory Gutenberg paragraph linking to the approach hub, ecommerce journey guide and launch checklist. These routes were absent from its original content and directly answer choosing, shop coverage and launch-check questions around installation.
- All original installation text, blocks, screenshot and non-content metadata retained. No current-plan/code-injection promise added. This is an internal-link change, not a new compatibility test.
- Fit/CTA: existing Multilingualizer installation intent; no added affiliate sales claim. Parent hub and specialised guides retain distinct intent.
- URL: https://www.multilingualizer.com/support/how-to-install-the-multilingualizer-on-squarespace/.
- Measure relevant destination progression and landing-page organic clicks on 10 October, 31 October and 1 January 2027.

### Run record

- Original and readback snapshots saved under gitignored `data/seo-backups/2026-10-03/`; concurrent-change guards compared original/live content before each write. Post/metadata readback matched; non-SEO metadata remained unchanged. No prices, theme, customer data, consent configuration or Multilingualizer JavaScript changed.
- Public canonical pages loaded to trigger GridPane's stale-cache refresh before verification.
- Google Analytics Admin API enablement remains waiting on Dave. Affiliate click recording already works; clicks aren't sales.
- Final canonical-page verification passed for three pages and 16 internal links, including exact titles/descriptions, single H1s, rendered AJAX-price markup and tracked product links. Browser screenshots saved for both refreshed guides. Weebly's table needed page-local cell padding because the site's single-post table rule doesn't apply to this WordPress page; corrected without a theme or global CSS edit.
- `npm run check` passed all 16 tests; `git diff --check` passed. Task changes committed and pushed to `main` in `dhilditch/Multilingualizer` with message `Refresh Webflow and Weebly guides and strengthen setup links`. Private reports, backups and screenshots remain uncommitted. No background jobs left running.

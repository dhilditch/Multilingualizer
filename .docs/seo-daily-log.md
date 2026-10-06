# Multilingualizer SEO implementation log

## 6 October 2026, 10:00 Europe/Athens: scheduled review

Fresh GSC/GA4 collection completed. Date-dimension GSC totals for 6 September–3 October: 24 clicks and 2,449 impressions, versus 17 clicks and 1,844 impressions in the preceding 28 days. GA4: 229 sessions, 23 engaged sessions and zero recorded purchases/key events. The window contains only two days of the October work; no improvement is attributed to those edits. Query-derived opportunities overlap recent experiments and remain unchanged. Today's three interventions are on untouched pages with page-level search signals.

### 1. Describe the widget guide in search

- Intent: choose useful widgets for a multilingual Squarespace site. Post 45694: 34 impressions, zero clicks, position 8.88. No claim of observed query-level volume.
- Reproduced missing public meta description. Added `Compare reviews, chat, Instagram feeds and counters for multilingual Squarespace sites. Includes captured examples and checks for language, layout and consent.` It describes the existing article without introducing new vendor capabilities, pricing, statistics or compliance claims.
- Source: live first-party article, which contains those widget sections, captured examples and language/layout/consent checks. The web reader returned 403; direct public fetch and WordPress snapshot were readable. Title, body, images, historical study and existing links remain unchanged.
- Product fit/CTA: existing owned-product and widget-vendor routes retained. Research is the aggregate study, while this article remains the widget chooser; no new competing URL or intent.
- URL: https://www.multilingualizer.com/best-squarespace-widgets-multilingual-sites/. Measure page CTR/clicks and existing product/vendor progression on 13 October, 3 November and 4 January 2027 (7/28/90 days).

### 2. Connect Anna's customer example to planning guides

- Intent: read the existing international-consultant multilingual example and plan a similar project. Page 10645: 11 impressions, zero clicks, position 5.64. These are page-level signals, not evidence that all name searches have buying intent.
- Before: case-study content linked only to Anna's external site, with no contextual setup-guide route. Added one separate paragraph after the bio linking to the beginner planning guide and builder comparison, framed around an international audience.
- Source: the original published interview explains the international client network and need for multiple languages. No new assertion about Anna's current platform, business, satisfaction or results. Customer text and images retained verbatim; no new customer data or testimonial written.
- Product fit/CTA: readers who choose to plan their own project can follow the guides to the owned-product/Squarespace route or managed-service calculator as appropriate. This is an internal-link improvement, not a claim that branded traffic is qualified or has converted.
- Internal intent: historical example remains distinct from the beginner and platform-choice pages. URL retained: https://www.multilingualizer.com/case-studies/anna-steinkamp/.
- Measure organic landing clicks and onward visits/session paths where available, not affiliate sales. Check 13 October, 3 November and 4 January 2027.

### 3. Connect Karol's customer example to workflow choices

- Intent: read the existing example of retaining a language while adding others. Page 10211: ten impressions, zero clicks, position 10.40.
- Before: content linked only to Karol's external site. Added one paragraph after the bio with the bilingual planning guide and builder comparison, framed around keeping the existing language. These destinations supply current planning guidance without implying the historical Pagevamp setup is currently tested.
- Source: the original interview's Slovak/Czech language requirement. No quote, biography, language count, image, historical implementation or title changed. No current compatibility or performance claim added.
- Product fit/CTA and internal competition: the example supplies evidence/context; the linked guides supply planning and commercial choices. No new case-study URL or competitor page. URL retained: https://www.multilingualizer.com/case-studies/karol-suchanek/.
- Measure organic landing clicks and onward visits/session paths where available. Check 13 October, 3 November and 4 January 2027. Small volumes limit attribution; guide visits aren't sales.

### Verification and repository record

- Backups, exact readbacks, public before/after HTML, verification results and browser screenshots saved under gitignored `data/seo-backups/2026-10-06/`. Concurrent-change guards checked before writes. Widget body/title unchanged. Both case-study originals match after removing the new paragraphs; full expected Themify JSON matches readback, including unchanged rows, columns, styles, media and all other text.
- Normal canonical URLs warmed before final verification. Three pages returned HTTP 200 with retained canonicals; exact widget description rendered. Four added contextual links point to two HTTP-200 destinations. Direct retrieval confirmed their planning and workflow content after the web reader could not access them. Browser confirmed both case-study links/layouts and the widget description; Anna's new paragraph inspected at the user's current mobile viewport.
- No recent experiment revised, no theme, script, price, customer record, credential or consent change, no redirect, deletion or outreach. No new click event or conversion designation configured.
- GA Admin API enablement is resolved. Still waiting on Dave to confirm the existing service account's GA4 property role before key-event configuration; read-only API access doesn't establish write access.
- Repository commit message: `Add widget search description and customer guide routes`, targeting `main` in `dhilditch/Multilingualizer`. Private evidence excluded. Collection, publishing and verification commands completed with no background jobs remaining.
- Final repository checks: all 16 tests and configuration validation passed; `git diff --check` passed.

## 5 October 2026: Analytics Admin API access confirmed

After Dave enabled the API, read-only calls to `properties.get` and `properties.keyEvents.list` succeeded for `properties/399612927`, displayed as `Multilingualizer - GA4`. The API-enable blocker is resolved. The existing key-event list contains only `purchase`; neither `affiliate_click_weglot` nor `multilingualizer_product_click` is marked as a key event.

These read-only calls do not establish Editor/write access. Confirm the service account's existing GA4 property role before proceeding with key-event configuration. No roles, credentials, scopes or Analytics configuration changed in this check. Reporting and the previously verified named click events remain distinct from key-event designation.

## 5 October 2026, 10:00 Europe/Athens: scheduled review

Collected fresh GSC and GA4 with the existing scripts. Date-dimension GSC totals for 5 September–2 October: 24 clicks and 2,457 impressions, versus 17 clicks and 1,779 impressions in the preceding 28 days. GA4: 226 sessions, 22 engaged sessions, zero key events and zero recorded purchases. The window includes only the first day of October interventions; it is too early to evaluate them. The three query-derived opportunities overlap recent work and remain unchanged under the 28-day rule.

### 1. Refresh the Swiss business website guide

- Target intent: choose languages and a multilingual website workflow for a Swiss business. Existing post 44682 has 46 impressions, zero clicks and position 6.37. Page-level evidence, not an assertion of observed query volume.
- Reproduced publicly: $3.99/month and free-trial offer, invented ordinary-text language wrappers, automatic-selector and universal-platform claims, dated Webflow pricing, unsourced population shares and blanket language/compliance recommendations.
- Replaced with a practical sequence: choose audience languages, translate the commercial journey, choose a maintenance workflow, plan language URLs and test. National versus federal official-language terminology uses the current Swiss FDFA source. Removed unsourced demographic figures and legal conclusions rather than inventing replacements. The guide explicitly isn't a legal determination or compatibility test.
- Verified primary sources immediately before publication: https://www.aboutswitzerland.eda.admin.ch/en/multilingualism and https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites. Live Multilingualizer on-page translation and selector instructions checked separately.
- Product fit/CTA: editor-native manually maintained Squarespace translations, positive pay-once callout using `[ssp_price product="4462"]` and `multilingualizer_product_click`; managed-service consideration routes to the calculator. No price configuration changed.
- Title, description and content refreshed. Relevant links point to builder comparison, Squarespace hub, marker/selector instructions, language subdomains, launch checklist and research. Competing `/switzerland-multilingual-website/` remains untouched pending consolidation authority. No new URL or redirect.
- URL: https://www.multilingualizer.com/switzerland-four-languages-business-website-guide/.
- Success measures: organic clicks/CTR and progression to product/calculator. Check 12 October, 2 November and 3 January 2027 (7/28/90 days).

### 2. Correct the unfinished jQuery conflict article

- Target intent: investigate jQuery conflicts affecting an image popup or site behaviour. Post 11226 has 15 impressions, zero clicks and position 8.20.
- Reproduced public defect: `[help me here dave]` placeholder. Existing copy also prescribed script deletion and promised general success from a recorded example. Replaced the placeholder with an explanation of global references and scoped the deletion/result passages to the recorded site.
- Added console/dependency checks, a saved-code and test-site precaution, and links to troubleshooting, selector configuration and launch checks. Current official jQuery documentation cautions against two versions and explains global-variable/plugin constraints: https://api.jquery.com/jquery.noConflict/. The web reader failed to retrieve its body, so it was fetched directly with HTTP 200 and inspected before publication.
- Added a missing meta description. Original video URL, six screenshots, title and non-SEO metadata retained. No Multilingualizer JavaScript or installation code changed. This is an editorial correction, not a new reproduction or diagnosis of the historic customer's JavaScript failure.
- Product fit: existing/manual-translation users reach relevant support and complete their launch tests. Intent remains distinct from the installation and general troubleshooting pages. No competing new URL.
- URL: https://www.multilingualizer.com/how-to-fix-javascript-errors-caused-by-jquery-conflicts/.
- Success measures: organic clicks/CTR and progression to the linked support/checklist pages. Check 12 October, 2 November and 3 January 2027.

### 3. Add the customer research search description

- Target intent: who uses multilingual features on Squarespace. Post 45693 has 18 impressions, zero clicks and position 5.22. Verified the public page had no meta description.
- Added: `Who uses multilingual Squarespace sites? Explore language combinations, sectors and visible tools in a historical customer study, with methods and limits.` The description reflects the article's actual contents without adding a new statistic or claiming current outcomes.
- Title, article, tables, denominators, method note, customer data and existing product/guide links remain unchanged. No database enrichment or new customer claims. Existing research links provide the route to the owned product and relevant guides; this change tests the snippet, not the commercial offer.
- Internal intent: aggregate historical research, distinct from sector examples and widget tutorials. No new URL. URL: https://www.multilingualizer.com/who-uses-multilingual-squarespace/.
- Success measures: organic clicks/CTR; observe progression through existing links without attributing clicks to sales. Check 12 October, 2 November and 3 January 2027.

### Verification and repository record

- Original/readback snapshots, public before/after HTML, link results and screenshots saved under gitignored `data/seo-backups/2026-10-05/`. Concurrent-change guards checked before every write. All non-target metadata preserved; research title/content matched byte-for-byte; jQuery media URLs matched the original.
- Normal canonical URLs warmed for stale-cache refresh, then verified: three pages return HTTP 200 with one H1 each, exact descriptions and unchanged canonicals; twelve internal destinations return HTTP 200. Swiss title, AJAX-price markup and tracked product CTA verified. Browser inspected all three pages and the research description.
- `npm run check`: all 16 tests and configuration validation passed. `git diff --check` passed. No theme, price, consent, credentials, customer data, JavaScript, redirects, deletion or outreach changes.
- Commit message: `Refresh Swiss guide and correct legacy support SEO`, targeting `main` in `dhilditch/Multilingualizer`. Private evidence excluded. All collection/publishing/verification commands completed; no background jobs left running. The previous run is confirmed pushed as `dfb71b5`.
- Still waiting on Dave: enable Google Analytics Admin API in project `555360471471`. Reporting works; no credential or permission change attempted.

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

## 4 October 2026, 10:00 Europe/Athens: scheduled review

Fresh reporting collected. Date-dimension GSC totals for 4 September–1 October: 23 clicks and 2,307 impressions versus 16 clicks and 1,681 impressions in the preceding 28 days. GA4 reports 225 sessions, 21 engaged sessions and zero purchases. The reporting window predates the October edits; these figures are not evidence that the edits increased sales or traffic. The three query-derived opportunities overlap recent interventions. Those experiments remain untouched, except for the separately verified missing-heading defect below.

### 1. Correct the older Squarespace Weglot comparison

- Target intent: Weglot versus Multilingualizer for Squarespace. Page evidence: 128 impressions, two clicks, position 19.51. This is page-level evidence, not an asserted query volume.
- Publicly reproduced defects on page 28003: obsolete $99/year Weglot pricing, blanket checkout translation and multilingual SEO guarantees, outdated assertions about Squarespace functionality and competitor pricing. Replaced these with a workflow comparison covering editing, payment model, language URLs, maintenance and journey testing. Removed unverified customer satisfaction/count claims.
- Published copy follows Dave's article voice. Positive owned-product callout uses `[ssp_price product="4462"]`, links Multilingualizer and states pay once/use forever. Named product and sponsored affiliate-click attributes retained in the new copy; no price configuration changed.
- Sources checked immediately before publication: Squarespace's Weglot guide (editing, subdomains and excluded surfaces), Google's multilingual URL guidance and the live on-page translation instructions. No competitor price restated. No blanket checkout or ranking guarantee added.
- CTA/product fit: manually maintained editor-native translations lead to product 4462; managed-service consideration leads to the calculator and disclosed Weglot affiliate link. Subdomain, SEO, checkout and launch guides answer narrower decisions.
- Internal competing URL `/multilingualizer-vs-weglot/` remains unchanged pending consolidation decisions. Existing URL preserved: https://www.multilingualizer.com/weglot-vs-the-multilingualizer-for-squarespace/.
- Measure organic clicks/CTR and named product/affiliate progression on 11 October, 1 November and 2 January 2027. Clicks aren't affiliate sales.

### 2. Clarify the CSS label-translation guide and connect its next steps

- Target intent: translate hard-coded labels using CSS. Page evidence: 39 impressions, one click, position 12.54.
- Reproduced public claim that the approach would work across the board. The article also incorrectly described `content` as only working on before/after pseudo-elements. Scoped the examples to the illustrated template and pseudo-element label replacements rather than a general translation system.
- Added a short introductory section explaining that generated labels don't change original HTML, email or protected-screen access; linked checkout/forms guidance, the Squarespace hub and launch checklist. MDN's current `content` documentation supports the generated-content accessibility warning. Added explicit testing steps for accessible names, keyboard use and narrow screens.
- Original two CSS examples and three screenshots retained. No script, CSS implementation or theme changed; this is a documentation correction, not a claim that a particular customer's template was tested.
- Product fit: helps existing/manual-translation users complete a launch and introduces the wider workflow guides. No new sales promise or duplicate URL.
- URL: https://www.multilingualizer.com/support/how-to-translate-hard-coded-texts-using-css/.
- Measure page clicks/CTR and progression to the linked guides at 7/28/90 days: 11 October, 1 November and 2 January 2027.

### 3. Restore Zoho's missing primary heading

- Target intent: make Zoho Sites multilingual. Page evidence: 13 impressions, zero clicks, position 10.69.
- Public HTML had zero H1 elements, independently confirming the baseline audit. Changed the hero text into one descriptive H1 in both the Themify text module and its static fallback.
- This is the technical-defect exception to the 28-day rule: the 2 October title/description experiment is unchanged. Themify rows, columns, settings, images and all other module text preserved. No new compatibility assertion introduced; inherited claims about every template remain unvalidated and require a separate compatibility review.
- Product route remains the existing purchase button. No new competing URL or redirect. URL: https://www.multilingualizer.com/make-zoho-sites-multilingual/.
- Measure clicks/CTR and observe the heading at 7/28/90 days: 11 October, 1 November and 2 January 2027. Do not attribute a result solely to this heading independently of the recent snippet change.

### Run record

- Private original/readback snapshots, public before/after HTML, link-verification results and browser screenshots saved under gitignored `data/seo-backups/2026-10-04/`. Concurrent-content guards checked before each write; non-target metadata retained. Themify structure compared after excluding edited text and matched exactly.
- Verification passed: three public canonical URLs return 200 with one H1 each; ten internal destinations return 200. Comparison title/description, dynamic AJAX-price markup, named product links and sponsored affiliate link verified. Browser inspected all three pages and confirmed the preserved Zoho layout. The on-page translation link was corrected during verification before final acceptance.
- `npm run check` passed all 16 tests and configuration validation; `git diff --check` passed. No redirects, deletions, outreach, prices, credentials, customer data, consent or Multilingualizer JavaScript changes.
- Google Analytics Admin API enablement still awaits Dave. Reporting remains usable; no new permissions requested or configured in this run.
- Repository record: commit message `Correct Squarespace comparison and focused SEO defects`, targeting `main` in `dhilditch/Multilingualizer`. Private evidence excluded. All collection, publishing and verification commands completed; no background jobs left running.

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

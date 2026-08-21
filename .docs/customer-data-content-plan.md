# Customer-data SEO and case-study plan

Prepared: 21 August 2026

## What the database can support

The local SQLite database is readable at `data/customer-intelligence/customer-intelligence.sqlite3`. It contains 1,202 unique paid customers and 1,381 supplied installations. The August 2026 crawl found 821 reachable customer sites belonging to 674 unique customers.

Run `node customer-intelligence/content-stats.mjs` to regenerate the publication-safe aggregate report after a new crawl. It opens the database read-only and prints no names, domains, emails or order details.

These are the publication denominators:

- **Historic customer population:** 1,202 unique paid customers. Use this for billing-country and purchase-history statistics.
- **Current observable population:** 674 unique customers with 821 reachable sites classified as customer sites. Use this for current technology and sector statistics.
- **Current Squarespace population:** 337 unique customers with 418 reachable Squarespace sites. Use this for Squarespace-specific technology statistics.
- **Current Multilingualizer population:** 239 unique customers with 297 reachable sites where the Multilingualizer is publicly detectable.

Do not use 1,202 as the denominator for technology adoption. A dead, moved or unavailable historic site could not have its current technology checked.

## Headline findings

- 490 of the 821 reachable sites still expose a multilingual implementation, belonging to 407 customers.
- Multilingualizer is publicly detectable on 297 reachable sites belonging to 239 customers.
- 267 of the 418 reachable Squarespace sites still expose Multilingualizer. At customer level that is 214 of 337, or 63.5%.
- Historic buyers span 79 recorded billing countries. Country is missing for 75 of the 1,202 customers.
- Canada and the United States each account for 137 historic customers, followed by Germany (103), Switzerland (89), Great Britain (75) and France (74).
- 814 reachable sites have registered language data. 639 use two languages, 103 use three and 62 use four or more.
- English and French is the largest unordered language combination (179 installations), followed by English and German (117) and English and Spanish (79).
- Among reachable Squarespace sites, the three leading combinations are English/French (88), English/German (68) and English/Spanish (38).
- The largest classified Squarespace sectors are education and training (59 installations), creative and media (41), architecture and property (32), travel and hospitality (26), retail and ecommerce (24), and events and experiences (23). A further 115 sites remain unclassified, so sector percentages must state that limitation.
- 23 of 418 reachable Squarespace sites exposed a public price that passed the deterministic extractor. This is evidence of visible prices, not a complete ecommerce count.

## Affiliate-tool adoption

| Product | All current customers | Share of 674 | Current Squarespace customers | Share of 337 |
|---|---:|---:|---:|---:|
| HubSpot | 22 | 3.3% | 1 | 0.3% |
| Elfsight | 17 | 2.5% | 14 | 4.2% |
| CookieYes | 8 | 1.2% | 1 | 0.3% |
| Spark Plugin | 4 | 0.6% | 4 | 1.2% |
| Ghost Plugins | 3 | 0.4% | 3 | 0.9% |

These are minimum observable-use rates. Client-side technology detection can miss an integration blocked by consent, loaded only on an uncrawled page, restricted to logged-in users or implemented entirely server-side. A script proves public use, not payment, satisfaction or endorsement.

## Cornerstone architecture

### Data and case-study hub

Canonical intent: `who uses multilingual features on Squarespace`
Proposed URL: `/who-uses-multilingual-squarespace/`

The hub publishes the method, population and aggregate findings, then routes into sector examples. It must not expose purchaser identities, emails or order details.

Supporting sector pages:

1. `/multilingual-squarespace-sports-examples/`
2. `/multilingual-squarespace-fashion-examples/`
3. `/multilingual-squarespace-travel-examples/`
4. `/multilingual-squarespace-education-examples/`
5. `/multilingual-squarespace-architecture-examples/`
6. `/multilingual-squarespace-creative-portfolio-examples/`
7. `/multilingual-squarespace-food-restaurant-examples/`

Each sector page should use three to five publicly verifiable sites. Describe only what can be seen in public pages and source: platform, visible languages, navigation approach, the customer journey and the public Multilingualizer fingerprint. Do not identify a business as a purchaser, disclose order data or imply that it supplied a testimonial.

The first sector brief set covers sports, fashion, travel and hospitality, education and training, architecture and property, creative portfolios, and food and drink. Current Squarespace sites with Multilingualizer detected include 38 in education and training, 26 in creative and media, 19 in architecture and property, 18 in travel and hospitality, 14 in food and drink, and 11 in fashion and beauty. Sports candidates cross several classifier sectors, so that article uses a manually verified candidate set rather than a database sector count.

### Elfsight cluster

Cornerstone: `/best-squarespace-widgets-multilingual-sites/`

Supporting tutorials, ordered by observed customer use:

1. `/add-google-reviews-squarespace-multilingual-site/`
2. `/add-whatsapp-chat-squarespace-multilingual-site/`
3. `/add-all-in-one-reviews-squarespace/`
4. `/add-number-counter-squarespace/`
5. `/add-instagram-feed-squarespace-multilingual-site/`
6. `/add-tripadvisor-reviews-squarespace/`

The verified Elfsight audit found 12 review-widget instances across eight customers and seven chat-widget instances across six customers. The raw screenshot set is in `data/customer-intelligence/elfsight-review/screenshots/`. Publication crops are being prepared under `content/assets/elfsight/customer-examples/`.

### Spark Plugin cluster

Cornerstone: `/spark-plugin-squarespace-review-examples/`

Supporting problem pages should target a visible Squarespace limitation, not the brand alone:

1. `/add-animated-number-counter-squarespace/`
2. `/style-squarespace-language-switcher/`
3. `/improve-squarespace-gallery-without-code/`
4. `/hide-squarespace-blocks-mobile-desktop/`
5. `/style-squarespace-cookie-banner/`

The official product currently lists more than 100 one-click features, including Number Counter, Gallery Styles, section/block visibility and cookie-banner styling. Verify the precise feature and plan immediately before publishing each tutorial.

### HubSpot cluster

Cornerstone: `/hubspot-squarespace-multilingual-guide/`

Supporting pages:

1. `/embed-hubspot-form-squarespace/`
2. `/hubspot-form-language-squarespace/`
3. `/hubspot-squarespace-form-not-loading-ajax/`
4. `/track-multilingual-squarespace-leads-hubspot/`

HubSpot is relevant to sales-led businesses, not every multilingual site. Official documentation says externally hosted pages need the HubSpot tracking code for page activity and non-HubSpot form capture. HubSpot also documents a Squarespace AJAX-navigation failure mode for embedded forms.

### CookieYes cluster

Cornerstone: `/cookieyes-multilingual-squarespace-guide/`

Supporting pages:

1. `/multilingual-cookie-banner-squarespace/`
2. `/add-cookie-policy-squarespace/`
3. `/cookieyes-squarespace-google-consent-mode/`
4. `/cookieyes-language-not-changing/`

This is practical configuration content, not legal advice. CookieYes documents 41 banner languages and says multilingual banners require a paid plan. Its language selection normally uses the document `lang` attribute, with an explicit script override available where needed.

### Ghost Plugins cluster

Do not create a generic “buy Ghost Plugins” article. Publish only problem-led tutorials where a current Ghost product or free snippet is the direct solution:

1. `/one-image-per-row-squarespace-mobile-gallery/`
2. `/smaller-squarespace-product-gallery-arrows/`
3. `/squarespace-slideshow-item-counter/`
4. `/squarespace-gallery-hover-effect/`
5. `/squarespace-autoplay-slideshow-buttons/`

Each page must state the applicable Squarespace version, block/layout requirement, mobile limitation and whether the solution is free, a single-purchase plugin or part of Ghost+ Pro Access.

## Screenshot publication rules

- Use a screenshot only when the widget or implementation is visibly identifiable.
- Caption it as a public example observed during the August 2026 audit, not as a testimonial.
- Link to the public business site where helpful.
- Add alt text that names the visible widget and page function, not the purchaser relationship.
- Remove browser chrome, cookie overlays and unrelated private-looking data where possible.
- Recheck the page before publication. If the widget has been removed, retain the screenshot only as a dated example and say when it was captured.

## Case-study verification gate

Before drafting a named case study:

1. Confirm the site returns HTTP 200 and is not parked or redirected to a different business.
2. Confirm the platform and Multilingualizer fingerprint on the current public site.
3. Open the homepage and at least one conversion-relevant inner page in every language claimed.
4. Record the visible language-switching method, shared-URL behaviour and any untranslated interface.
5. Capture a desktop and mobile screenshot with the language control visible.
6. Avoid performance, revenue, conversion or satisfaction claims unless the business has supplied evidence and approved the wording.
7. Offer the business a factual correction route after publication.

## Measurement

Every affiliate tutorial needs a distinct outbound-click event with `affiliate_programme`, `article_slug`, `widget_or_feature` and `link_position`. Case-study pages should separately track Multilingualizer product clicks, Weglot clicks and any relevant affiliate tutorial clicks.

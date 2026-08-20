# Baseline audit - 20 August 2026

## Scope and limits

This is a public-site and public-search audit. It inspected the XML sitemaps, rendered HTML, WordPress REST content and current official platform/search documentation. Search Console, GA4, orders and affiliate commissions are not connected yet, so keyword and revenue priorities remain provisional.

## Current estate

- WordPress with WooCommerce, Yoast SEO Premium, Themify Ultra and Cloudflare.
- 192 URLs in the Yoast sitemap index.
- Public REST inventory: 40 posts, 98 pages and 5 products. The sitemaps expose 41 post-section URLs, 92 page URLs and 4 product-section URLs, so the REST and sitemap sets need reconciling.
- Ten long-form articles were published from 28 March to 6 April 2026. Several landing pages were published on 28 March for the same subjects.
- The homepage content was last modified through REST in November 2019 and still sends an old `/shop/multilingualizer/` link through one redirect to the current product URL.

## Measurement defect

The homepage source contains Universal Analytics tag `UA-30254111-7` and no GA4 measurement ID or Google Tag Manager container. Google states that standard Universal Analytics properties stopped processing data on 1 July 2023. Unless another collection mechanism exists outside the rendered source, current traffic and sales attribution are absent.

This is priority zero. Install and verify GA4 before using traffic or conversion claims to choose content.

## Crawl findings

| Finding | Count | Interpretation |
|---|---:|---|
| Sitemap URLs crawled | 192 | All returned HTTP 200 |
| Missing meta descriptions | 182 | Prioritise URLs with impressions, products and platform hubs rather than filling all 182 blindly |
| Missing H1 | 10 | Includes the main Squarespace, Shopify, Wix and Zoho platform pages |
| Exact duplicate title groups | 8 | Includes both Multicurrencyalizer products and an incorrect Zoho title |
| Under 250 visible words | 115 | Largely archives, utility pages and old announcements, not automatically a quality verdict |
| Taxonomy/author/license archive URLs | 55 | A large part of the indexable sitemap for a site with 41 posts |
| Utility/action URLs identified | 12 | Account, registration, ticket, unsubscribe and form-style pages should not be sitemap priorities |
| JSON-LD blocks detected | 0 | Structured-data support needs checking before assuming product/article markup exists elsewhere |

Google says a sitemap should contain the canonical URLs the owner wants shown in search. The current sitemap contains many utility and low-value archive URLs. Their GSC impressions and external links should be checked, then low-value sets should be noindexed and removed from the sitemap.

## Cannibalisation candidates

Do not delete or redirect these until GSC supplies clicks, queries and Google-selected canonical evidence.

| Intent | Competing URLs |
|---|---|
| GoDaddy multilingual | `/godaddy-multilingual-website/` and `/2026/04/03/godaddy-website-builder-no-multilingual-fix/` |
| Webflow cost/alternative | `/webflow-multilingual-cheap-alternative/`, `/multilingualizer-vs-webflow-localization/` and `/2026/03/30/webflow-localization-too-expensive-alternative/` |
| Shopify multilingual | `/shopify-multilingual-easy/`, `/make-shopify-multilingual/` and `/2026/04/05/multilingual-shopify-cheapest-option-2026/` |
| Quebec compliance | `/quebec-bill-96-website-french-compliance/` and `/2026/03/29/quebec-bill-96-small-business-website-2026/` |
| Wales compliance | `/welsh-language-act-website-compliance/` and `/2026/04/02/welsh-language-act-guide-businesses-charities/` |
| Belgium languages | `/belgium-website-bilingual-french-dutch/` and `/2026/04/04/belgium-business-website-bilingual-french-dutch/` |
| Switzerland languages | `/switzerland-multilingual-website/` and `/2026/04/06/switzerland-four-languages-business-website-guide/` |
| Multilingualizer vs Weglot | `/multilingualizer-vs-weglot/` and `/weglot-vs-the-multilingualizer-for-squarespace/` |

Google treats redirects and `rel=canonical` as strong canonicalisation signals, while sitemap inclusion is weaker. Once a winner is chosen, merge the useful content, redirect the loser, update internal links and leave only the winner in the sitemap.

## Factual and conversion risks

1. The homepage says the product works with Wix, while a 2018 post says Wix support was withdrawn and multiple Wix installation/landing pages remain live. Test current compatibility and make every claim consistent before pushing Wix traffic.
2. The live Multicurrencyalizer product and Multicurrencyalizer 3.0 product share the same title and meta description. The older product says it is superseded but can still be added to the cart. Decide whether legacy sales are intentional, then give each valid page a distinct purpose or redirect the old one.
3. `/make-zoho-sites-multilingual/` has the exact title and description for Squarespace, not Zoho.
4. The homepage's detected H1 is a testimonial sentence, not the product/topic heading.
5. The current Weglot affiliate URL was found on the older Squarespace comparison and the main Squarespace page. No dedicated `affiliate_click` event was visible in source, so outbound clicks cannot yet be separated from other actions.
6. The March/April 2026 articles use broad claims, dated prices and legal assertions. Review them against primary sources and product tests before amplifying them. Several also use a generic AI-style voice that does not match Dave's article register.
7. The source identifies Yoast SEO Premium 11.1.1 and Themify components with old version strings. Confirm the real installed versions and update procedure in WordPress before making a security claim, but treat the visible age as a maintenance warning.

## Immediate work order

### Priority 0: establish truth and measurement

1. Create or locate GA4, install it, and validate consented page views.
2. Implement and test `purchase`, `add_to_cart`, `begin_checkout` and `affiliate_click` with product/source parameters.
3. Connect GSC, GA4, WordPress and sales/affiliate reporting using `.docs/access-checklist.md`.
4. Capture the first 16 months of GSC data if available, plus 28-day, prior-period and prior-year baselines.
5. Reconcile current product pricing, licensing and platform compatibility against the code and checkout.

### Priority 1: stop competing with ourselves

1. Use GSC to select one canonical URL for each duplicate-intent group above.
2. Fix the incorrect Zoho title/description immediately unless the page is being retired.
3. Decide the fate of the old Multicurrencyalizer product and prevent accidental legacy purchases if it is retired.
4. Remove utility pages and low-value taxonomy archives from the XML sitemap, and noindex them where they have no search purpose.
5. Fix the homepage and main platform-page H1s.

### Priority 2: improve existing commercial pages

1. Rewrite titles and descriptions for high-impression pages using real GSC queries. Google may use a page's meta description when it describes the page better than the page text, so focus on critical URLs rather than all 182 at once.
2. Update the Squarespace hub and Weglot comparison using current product tests, clear decision criteria and distinct Multilingualizer/Weglot tracking.
3. Make each platform hub a tested implementation guide with screenshots, limitations, plan requirements, SEO behaviour and the correct product route.
4. Add contextual links from older relevant pages and case studies into the selected hubs and products.
5. Refresh case studies with exact platform/language/outcome facts where customers permit it.

### Priority 3: expand after winners are known

1. Test GoDaddy Websites + Marketing compatibility and build the GoDaddy cluster only if the current product works reliably.
2. Test Webflow against current Webflow Localization and write a cost/feature calculator based on verified inputs.
3. Expand problem-led support content from GSC queries and real community questions.
4. Translate proven converting guides for evidenced markets, with crawlable URLs and correct hreflang.
5. Run helpful semi-automated outreach using `outreach/tracking.csv`; do not mass-post or link-drop.

## Public evidence consulted

- [Google Analytics 4 and the Universal Analytics sunset](https://support.google.com/analytics/answer/10089681)
- [Google guidance on search snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google guidance on canonicalisation](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Squarespace's current manual multilingual-site guidance](https://support.squarespace.com/hc/en-us/articles/16552875658765-Manually-creating-a-multilingual-site)
- [Shopify Translate & Adapt documentation](https://help.shopify.com/manual/markets/languages/translate-adapt-app)
- [Webflow Localize](https://webflow.com/feature/localize)
- [GoDaddy Websites + Marketing help](https://www.godaddy.com/en-uk/help/websites-marketing-1000041)

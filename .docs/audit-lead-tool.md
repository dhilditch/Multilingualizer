# Multilingual website cost calculator and audit lead tool

## Objective

Give a site owner a useful estimate of the cost and work involved in making their site multilingual, then offer a deeper audit in exchange for an email address. The tool should produce qualified leads for the solution that genuinely fits:

1. Multilingualizer for manual, client-controlled translation where the product is currently compatible.
2. Weglot for automatic translation, translated URLs and managed multilingual SEO.
3. Multicurrencyalizer or its successor when the site displays prices and serves multiple markets.

The tool is not an undeclared prospect scraper. Anonymous homepage checks are not stored. A queued audit stores the submitted website and email only after the visitor accepts the audit-specific consent statement.

## User journey

### 1. Manual estimate

The visitor enters their source word count and number of destination languages. The calculator uses:

`translated words = source words × destination languages`

It returns the lowest published plan whose word and language limits both fit. Prices are estimates with a checked date and a link to the source.

### 2. Pasted-content estimate

The visitor pastes one page or several pages into one text area. The application counts Unicode words and does not retain the pasted content.

The production privacy notice must state that pasted content is processed transiently and must warn visitors not to paste passwords, private account pages, customer records or other confidential material.

### 3. Instant homepage check

The visitor enters a public URL. The server fetches one HTML page and returns:

- estimated visible and metadata word count;
- Weglot plan estimate for that page;
- page title, H1, language and hreflang signals;
- link and image counts;
- whether public email or telephone links exist;
- whether currency signals exist.

The response does not reveal or store the actual public contact details. The visitor's submitted email is the lead, not an email address harvested from the scanned site.

### 4. Queued whole-site audit

The visitor clicks **Audit the rest of the site**, supplies an email address and accepts a specific consent statement. The initial worker:

- crawls up to 25 same-site public HTML pages;
- follows robots.txt exclusions;
- estimates words per page and in total;
- recommends a Weglot plan;
- lists the pages found;
- reports broken internal pages and broken images;
- checks titles, descriptions, H1s, language declarations and hreflang;
- points out currency localisation when price signals are present;
- generates a provider-ready HTML email.

The prototype writes the email to a local, ignored outbox. No production email is sent until a mail provider, sender authentication, bounce handling and data-retention policy are configured.

## Product and affiliate decision rules

The report should not display a wall of affiliate offers. It should make one primary translation recommendation, then show complementary actions only when the crawl supplies evidence.

| Signal | Recommendation |
|---|---|
| Verified supported builder, small site, owner wants manual control | Compare Multilingualizer with Weglot |
| Automatic translation, translated URLs, larger site or managed multilingual SEO | Weglot |
| WordPress | Compare WordPress-native translation products separately |
| Currency symbols, ISO currency codes or ecommerce prices detected | Multicurrencyalizer successor and, where appropriate, Wise Business |
| Missing language, hreflang or metadata | Relevant implementation guide before a product CTA |

No compatibility recommendation may be made from platform detection alone until the current product has been tested on that platform.

## Abuse and security controls

The prototype includes:

- HTTP and HTTPS only;
- private, loopback, link-local and reserved IP blocking;
- DNS resolution before each request and a pinned validated address for the connection;
- same-site redirect restrictions;
- response byte and request timeout limits;
- same-site crawling only;
- page, image-check and redirect ceilings;
- basic robots.txt handling;
- per-IP application rate limiting;
- no JavaScript execution in the scanned site;
- no authenticated-page crawling;
- a clear crawler user-agent.

Before production, add a durable distributed queue, persistent rate limits, bot protection, email ownership confirmation, suppression and bounce handling, signed report links, retention deletion jobs, monitoring and a more complete robots parser. Obtain a privacy review for the actual jurisdictions served rather than treating this document as legal advice.

## Lead and analytics events

Track these separately:

- `calculator_completed` with input mode, destination-language count and recommended plan;
- `homepage_audit_completed` with detected platform and broad size band, not page content;
- `full_audit_requested` after consent;
- `audit_email_delivered`;
- `audit_report_opened` only if consent and the chosen privacy approach permit it;
- `affiliate_click` with product and report section;
- `product_click` for Multilingualizer and the currency product;
- later purchase or confirmed affiliate commission where available.

Do not send pasted text, crawled page text, email addresses or full URLs containing query strings to analytics.

## Delivery phases

### Prototype completed locally

- manual and pasted-content calculation;
- homepage audit;
- queued whole-site crawler;
- HTML report and local email outbox;
- core security and calculation tests.

### Production MVP

- choose WordPress plugin, standalone service or serverless deployment;
- choose job queue and transactional email provider;
- add verified affiliate URLs and disclosures;
- add privacy notice, retention period and deletion mechanism;
- add production bot and rate controls;
- visually integrate the calculator into multilingualizer.com;
- test on ten representative Squarespace sites with permission.

### Later enrichment

- platform and ecommerce detection;
- sitemap.xml ingestion where present;
- duplicate-title and redirect-chain reporting;
- translation exclusion suggestions;
- downloadable PDF or persistent private report;
- country/language opportunity suggestions based on first-party analytics only after the owner connects it;
- an optional marketing opt-in distinct from the transactional audit consent.

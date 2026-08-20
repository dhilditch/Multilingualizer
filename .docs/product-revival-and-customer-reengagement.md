# Multilingualizer product revival and customer re-engagement

## Separate the decisions

There are three related but distinct questions:

1. Does the current Multilingualizer code work reliably on the builders and browser behaviour customers use in 2026?
2. What commercial model matches the continuing value and support burden?
3. Which previous buyers still operate relevant websites and may benefit from an upgrade, Weglot or a currency product?

Do not email the historic list until the product facts, order basis, consent basis, suppression list and proposed offer are reconciled.

## Product audit

Create a source-controlled product workspace and establish:

- current source and last released artefact;
- licence and update mechanism;
- Squarespace 7.0 and 7.1 compatibility;
- Webflow, GoDaddy, Weebly, Zoho and other claimed compatibility;
- language switcher, navigation, gallery, form, checkout and dynamic-content behaviour;
- CSP, JavaScript-module, browser and mobile compatibility;
- security risks and third-party dependencies;
- existing tests, build process and deployment path;
- support questions and failure patterns from historic Discord and tickets.

No relaunch page should claim broad platform support until this matrix has test evidence.

## Pricing hypothesis

Historic one-off sales are evidence that buyers understood and accepted a one-off purchase. The failed subscription period does not prove that subscriptions never work, but a subscription needs recurring customer value beyond access to the same script.

The first model to test is:

- a one-off licence for the current major version;
- twelve months of updates and support;
- an optional paid renewal for continued updates and support;
- a paid major-version upgrade where the new version contains material compatibility or capability work;
- a Weglot recommendation when ongoing hosted translation is the better technical fit.

That preserves the simple purchase customers previously accepted without promising lifetime engineering for one payment. Exact pricing must come from order history, refund rate, support cost and competitor evidence.

## Multicurrencyalizer review and possible rename

The current name is difficult to read and remember. A rename should follow the code and market review because the right name depends on whether the product changes display currency only or also changes checkout currency, rates, rounding and platform integrations.

Working names to test:

- Local Currency Display;
- Currency Switcher for Squarespace;
- Multi-Currency Display;
- Local Price Display;
- Multilingualizer Currency.

Do not use **currency switcher** if the product does not actually switch transaction currency. Precision matters more than a cleaner name.

The review must verify exchange-rate sources, caching, rounding, currency formatting, checkout behaviour, tax interaction, accessibility, performance, security and current builder compatibility.

## Historic-customer reconciliation

Build a local-only dataset from WooCommerce orders and support records. It must never be committed. For each buyer, retain only fields needed for the decision:

- order and product/version purchased;
- order date and refund status;
- licence/update entitlement;
- website supplied at purchase, where one exists;
- whether that website is still live;
- detected builder and whether Multilingualizer appears active;
- support history and unresolved problems;
- marketing consent or other reviewed contact basis;
- suppression, unsubscribe and bounce state;
- appropriate next action.

Website checks should be rate-limited, use public data only and avoid storing unnecessary personal data. A live site is not permission to email a scraped address. Contact decisions use the purchaser record and the reviewed communication basis.

## Customer groups

| Group | Appropriate route |
|---|---|
| Active Multilingualizer installation and compatible site | Invite to a tested upgrade or ask for product feedback |
| Live site, product no longer detected, multilingual need still visible | Ask what replaced it and offer the relevant current route |
| Site has grown beyond manual translation | Weglot comparison and affiliate route |
| Ecommerce site showing one currency to multiple markets | Currency product review, after compatibility is verified |
| Dead site, refunded order, suppressed address or no suitable contact basis | Do not contact |

The first outreach should be a small, manually reviewed batch. Measure replies, complaints, clicks and sales before expanding.

## Discord evidence

The Discord exporter supports explicit channel selection from the frozen allow-list. The relevant history was downloaded from only:

- `980852343929192548` - Multicurrencyalizer;
- `980852286182019092` - Multilingualizer.

The returning-customer conversation spans 5 and 6 August 2026. The customer had used Multilingualizer successfully for years on a Squarespace 7.1 Business site. Squarespace began rewriting a navigation URL so it started with `https://` rather than `javascript:`. Language switching then did nothing in Firefox and Safari, while Chrome opened `about:blank#blocked`.

The first workaround targeted the desktop header navigation and restored desktop operation, but missed mobile Safari. A broader compatibility shim selected links whose `href` contained `javascript:changeLanguageAndMove(`, removed the unwanted prefix and watched later DOM and `href` mutations. The customer confirmed that this restored both desktop and mobile operation.

This produces four concrete tasks:

1. Reproduce the current Squarespace 7.1 link rewriting on a controlled test site.
2. Add a backwards-compatibility shim for installed sites using the legacy link format.
3. Replace `javascript:` URLs in the product with ordinary links or data attributes plus a click handler, so Squarespace and browsers have no executable URL to rewrite or block.
4. Add desktop and responsive/mobile navigation tests, including navigation rebuilt after page load.

The same customer reported that several contact links on multilingualizer.com did not work and that Discord was the route they eventually found. Audit the live contact routes before any customer re-engagement campaign.

There were no Multicurrencyalizer messages in the downloaded windows.

Discord exports and named-customer findings stay in the private local-data area. Only anonymised product patterns and counts may enter this repository.

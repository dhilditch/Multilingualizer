---
title: "Squarespace Multilingual Ecommerce Guide"
slug: squarespace-multilingual-ecommerce
excerpt: "Plan and test a multilingual Squarespace store, including products, translated URLs, checkout, customer emails, pricing, shipping and ongoing updates."
categoryIds: [7, 828]
wpPostId: 45667
status: published
publishedDate: 2026-08-21
publishedUrl: https://www.multilingualizer.com/squarespace-multilingual-ecommerce/
---

A multilingual Squarespace store needs more than translated product descriptions.

The customer has to understand the product, variant, price, delivery terms, checkout, confirmation and later emails. If one of those steps switches back to the original language without warning, the translation project is incomplete.

This guide uses Weglot as the main managed route because Squarespace integrates it with version 7.1 and supports translated customer notifications. It also explains where the integration stops and what to test before launch.

**Affiliate disclosure:** the Weglot links in this guide are affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

## 1. Map the complete buying journey

List every customer-facing step:

1. category or collection page
2. product page
3. variant and quantity selection
4. cart
5. discount code
6. shipping and tax information
7. checkout
8. payment
9. confirmation page
10. order email
11. fulfilment or collection email
12. account, refund and support flow

Add the system that owns each step. Normal page content, Squarespace Commerce, a payment gateway, customer accounts and a third-party delivery widget may all appear in one order.

## 2. Decide which markets and languages come first

Choose languages using evidence:

- existing orders and enquiries
- countries you can actually ship to
- support capacity
- payment methods and currencies
- target-language search demand
- legal and returns requirements

Do not launch ten machine-translated languages because the switcher allows it. Start with the language where the business can serve the customer properly.

Language and currency are separate decisions. A French-speaking customer may pay in euros, Swiss francs or Canadian dollars. Translating the shop does not automatically create a suitable pricing, tax or fulfilment model.

## 3. Count the whole catalogue

Include:

- product titles and descriptions
- variants and option labels
- collection descriptions
- navigation and footer text
- policy pages
- delivery and returns information
- metadata and image alt text
- blog or buying-guide content
- customer notification emails

Multiply the source total by the number of destination languages. Weglot generates translations progressively, so visit or synchronise all intended URLs during the trial before trusting the dashboard total.

Use the [Weglot pricing calculator for Squarespace](/weglot-pricing-calculator-squarespace/) as a first estimate, then reconcile it with the live dashboard.

## 4. Configure indexable language URLs

If translated organic search matters, set up separate language URLs rather than relying only on in-page switching.

Squarespace recommends language subdomains for Weglot. Add the exact CNAME records at the active DNS provider, wait for SSL, and test inner product paths in every language.

Then audit:

- self-referencing canonicals
- reciprocal `hreflang`
- translated titles and descriptions
- visible language consistency
- language-preserving internal links

Use the [Squarespace Weglot SEO guide](/squarespace-weglot-seo/) for the complete check.

## 5. Build a translation workflow

Assign owners for:

- machine translation review
- product and brand terminology
- pricing and units
- delivery and returns
- policy text
- SEO titles and descriptions
- updates when the original product changes

Create a glossary for names, materials, sizes and terms that must stay consistent. A store feels unreliable when the same variant has three different translations.

Prioritise the text that can cost money when misunderstood: dimensions, compatibility, allergens, delivery dates, refund conditions and warranties.

## 6. Test products and collections

For representative products, check:

- title and description
- every variant label and value
- price and sale price
- stock and out-of-stock messages
- image alt text
- related products
- filters, sorting and search
- collection pagination
- mobile layout with longer translated text

If product data or filters appear dynamically, a Weglot dynamic selector may be needed. Retest performance and updates after adding one.

## 7. Test cart and checkout

Complete a real test order in each language.

Check:

- cart item names and variants
- quantity changes and removal
- discount success and failure messages
- delivery methods
- taxes and totals
- required-field errors
- payment instructions
- confirmation page
- links back to the store

Do not assume a correct product page proves the checkout. Read [Does Weglot translate Squarespace checkout, forms and emails?](/weglot-squarespace-checkout-forms-emails/) for the state-by-state matrix.

## 8. Review customer emails

Squarespace says multilingual customer notifications are enabled by default when Weglot is connected. Preview each message by language and send test orders to real inboxes.

Check:

- subject line
- product and variant names
- amount and currency
- delivery method
- tracking links
- refund or cancellation wording
- support contact

Squarespace Email Campaigns is a separate service and is not translated through the integration. Plan marketing email by language separately.

## 9. Account for unsupported services

Squarespace lists these as outside the Weglot integration:

- Email Campaigns
- Acuity Scheduling
- third-party content blocks such as maps
- Member Sites
- customer account login screens

An ecommerce site using customer accounts needs a clear plan for login and password reset. A shop selling appointments needs a separate multilingual plan for Acuity.

Read [what Weglot does not translate on Squarespace](/what-weglot-does-not-translate-squarespace/) and mark every gap as configured separately, accepted or blocking.

## 10. Treat currency separately

A translated price label does not mean the customer will be charged in their expected currency.

For each market, state:

- display currency
- checkout currency
- exchange-rate policy
- taxes and duties
- payment methods
- refund currency

Do not describe a display-only currency conversion as multi-currency checkout. The current Multicurrencyalizer product needs its own code and compatibility review before it should be recommended as part of this flow.

## 11. Launch one language carefully

Keep the language private while testing, then launch one destination language and watch:

- orders and failed payments
- support questions
- form errors
- customer emails
- word-count growth
- Search Console indexation
- organic landing sessions
- conversion rate by language URL

Record the launch date and every later translation or technical change. Otherwise, a traffic increase cannot be tied to the work.

## If you do not want a monthly translation plan

> **Our very own [Multilingualizer](/product/multilingualizer/) is a [ssp_price product="4462"] one-time purchase.** It works directly inside the Squarespace editor, so you add and manage translations where you already edit your site instead of learning Weglot's interface. It does not machine-translate content, provide Weglot's separate language URLs or translate protected checkout/account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.

## Final recommendation

Choose Weglot when the store needs a managed translation workflow, indexable language URLs and translated Squarespace customer notifications, and when the unsupported services are not blocking.

Choose a manual route when the catalogue is small, changes rarely and the owner accepts the SEO and checkout limitations in return for a one-time cost.

If Weglot fits, [check its current plans](https://www.weglot.com/pricing?fp_ref=multilingualizer) after counting the whole catalogue and testing the full order journey.

## Related Squarespace guides

- [Test checkout, forms and customer emails](/weglot-squarespace-checkout-forms-emails/)
- [Check what Weglot does not translate](/what-weglot-does-not-translate-squarespace/)
- [Configure Squarespace and Weglot SEO](/squarespace-weglot-seo/)
- [Browse all Squarespace multilingual guides](/make-squarespace-multilingual/)

## Sources checked 21 August 2026

- [Squarespace: creating a multilingual site with Weglot](https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot)
- [Weglot: translated-word count](https://support.weglot.com/article/59-total-number-translated-words)
- [Weglot: translating dynamic content](https://support.weglot.com/article/253-how-to-translate-dynamic-content)
- [Google: managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

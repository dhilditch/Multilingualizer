---
id: OPP-2026-001
title: Weglot pricing calculator for Squarespace
slug: weglot-pricing-calculator-squarespace
contentType: cornerstone-article
primaryQuery: weglot squarespace pricing
searchIntent: commercial investigation
commercialRoute: weglot-affiliate
status: drafted
---

# Problem

A Squarespace owner considering Weglot cannot tell from the sticker price which plan their own site needs. They need a defensible word-count estimate, an explanation of what Weglot counts, and the Squarespace-specific limitations that affect the buying decision.

# Evidence

- Search Console period, clicks, impressions, CTR and position: no query-level observations in the 21 July to 17 August 2026 export. This is a new, distinct calculator intent, not a response to a current ranking.
- Current search-result pattern: Squarespace and Weglot explain setup. Weglot provides a basic word-count tool. The useful gap is pricing plus a Squarespace-specific pre-purchase audit.
- Primary/current sources:
  - https://www.weglot.com/pricing
  - https://support.weglot.com/article/59-total-number-translated-words
  - https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot
  - https://support.weglot.com/article/243-squarespace-integration-setup
- Product/platform test evidence: the local prototype and WordPress component calculate plans from the published limits, inspect public HTML only, and enforce a ten-page full-audit ceiling.

# Existing URL decision

- Canonical URL to create: `/weglot-pricing-calculator-squarespace/`
- Competing internal URLs:
  - `/weglot-vs-the-multilingualizer-for-squarespace/`
  - `/multilingualizer-vs-weglot/`
  - `/make-squarespace-multilingual/`
- Leave separate. The new URL owns calculation and pre-purchase pricing intent. It should summarise, then link to one eventual canonical comparison URL after GSC supplies enough evidence to choose between the duplicates.

# Solution structure

1. Put the calculator above the fold.
2. Explain the translated-word formula and what the estimate can miss.
3. Give the current published plan thresholds with a dated warning.
4. Cover twelve Squarespace-specific checks before purchase.
5. End with a small decision tree and relevant alternatives rather than forcing Weglot on every visitor.

# Product fit and CTA

- Reader for whom Multilingualizer fits: a small Squarespace site whose owner wants manual control and is willing to maintain translations, subject to current compatibility being reverified before this CTA is promoted.
- Reader for whom Multicurrencyalizer fits: an ecommerce site that also needs visitors to see localised currencies. Do not treat currency display as currency conversion or translated checkout support.
- Reader for whom Weglot fits better: a Squarespace 7.1 site wanting automated translation workflow, language subdomains and ongoing translation management.
- Primary CTA and tracked event: affiliate click to `https://weglot.com/pricing?fp_ref=multilingualizer`; event name `affiliate_click`, parameters `partner=weglot`, `placement=calculator_result|article_cta`.

# Internal links

- Links into this page: Squarespace setup article, eventual canonical Weglot comparison, Multilingualizer product page.
- Links out from this page: official Squarespace setup guide, official Weglot pricing and word-count references, eventual canonical comparison, Multilingualizer product page, Multicurrencyalizer page where ecommerce intent is present.

# Publication checks

- [ ] Facts and prices checked on publication date
- [ ] Calculator plugin installed and tested on staging
- [ ] WordPress cron/Action Scheduler and email delivery tested
- [ ] Homepage audit rejects local/private targets and cross-host crawl links
- [ ] Dave article register applied
- [ ] Comparison links point to the chosen canonical comparison URL
- [ ] Title, description, H1 and canonical checked
- [ ] Affiliate disclosure visible before the first affiliate CTA
- [ ] CTA and analytics events tested
- [ ] Change added to `measurement/annotations.csv`

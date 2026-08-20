---
title: "Squarespace Weglot SEO: URLs, Hreflang and Indexing"
slug: squarespace-weglot-seo
excerpt: "Configure and audit Weglot SEO on Squarespace, including translated URLs, hreflang, canonicals, metadata, indexation and common errors."
categoryIds: [7, 828]
wpPostId: 45662
status: published
publishedDate: 2026-08-21
publishedUrl: https://www.multilingualizer.com/squarespace-weglot-seo/
---

A translated page is not automatically a multilingual SEO page.

For Google to understand a Squarespace site in several languages, each version needs a crawlable URL, clear visible language, correct relationships to the other versions and useful translated metadata. Weglot handles much of that work, but there are still choices to make and checks to run.

**Affiliate disclosure:** the Weglot links in this guide are affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

## The minimum technical model

Google recommends:

- a different URL for each language version
- `hreflang` annotations connecting equivalent versions
- visible content and navigation that make the page language obvious
- a user-controlled way to switch language

Avoid relying only on cookies, browser language or IP detection. Googlebot may not send the language signals your browser sends, and automatic redirection can prevent both users and crawlers from reaching another version.

## Choose translated URLs deliberately

For a Squarespace site using Weglot, the usual server-side choices are:

- subdomains, such as `fr.example.com/services/`
- subdirectories, such as `example.com/fr/services/`, where supported and configured

Weglot describes both as SEO-capable because each gives the translated page a dedicated URL and server-rendered translated source for crawlers.

Squarespace's own guide recommends language subdomains. A custom domain is required for that setup.

Do not confuse a language URL with a country target. `fr` means French. If the same language needs materially different pages for France and Canada, plan language and region codes carefully rather than multiplying variants after launch.

## Set up language subdomains

Use the full [Weglot language subdomain setup for Squarespace](/weglot-language-subdomains-squarespace/) rather than copying DNS values from another site.

The short version is:

1. connect Weglot to the correct Squarespace site
2. choose destination languages
3. start the subdomain setup
4. add Weglot's CNAME records at the active DNS provider
5. wait for DNS and SSL readiness
6. test matching paths in every language

## Check hreflang on both sides

Every equivalent page should reference the available language versions, and those references should be reciprocal.

For an English and French service page, the source should point to both versions with full URLs. The English page and French page should carry the same set.

Weglot documents a specific issue for Squarespace and Webflow subdomain integrations: it can edit the translated pages but cannot always insert the complete translated path into the original page automatically. Weglot provides an integration-hook solution for this case.

That means you should inspect the actual source of an inner page, not just the homepage. If the original `/services/design/` page points only to the French homepage instead of `fr.example.com/services/design/`, the relationship is incomplete.

## Check canonicals

Weglot says it does not create a canonical tag from nothing. It updates an existing canonical for the translated version.

Confirm that:

- the original page has a self-referencing canonical
- the translated page has the translated URL as its canonical
- neither language canonicalises to a different-language page
- tracking parameters and preview URLs are not being declared canonical

A canonical and `hreflang` do different jobs. The canonical identifies the preferred URL for that page version. `hreflang` identifies alternate language or regional versions.

## Translate search metadata

Check each language's:

- title tag
- meta description
- visible H1
- image alt text where it carries meaning
- social sharing title and description
- product name and structured data where applicable

Weglot counts translatable SEO metadata towards the translated-word total. Include it in the budget and review it as editorial copy, not boilerplate.

A literal title translation can be grammatically correct and still target a phrase nobody uses. Search the target-language wording and rewrite the title for the real query while preserving the page's intent.

## Keep one main language per URL

Google uses visible content to determine page language. It recommends avoiding side-by-side translations on the same indexed page.

Menus, cookie banners, forms and product widgets can accidentally leave a page mixed. A handful of proper nouns is not a problem, but an English navigation wrapped around a French article sends an unclear signal and gives the visitor an uneven experience.

## Make language switching crawlable and usable

The switcher should:

- link to the equivalent page where one exists
- remain available on mobile
- identify languages in a way users understand
- preserve the visitor's task rather than returning them to the homepage
- work without trapping a crawler in an automatic redirect loop

Flags represent countries, not languages. Text labels are usually clearer when a language is used in several countries.

## Validate before launch

For at least one homepage, service page, blog post and product page per language:

1. fetch the URL in an incognito window
2. confirm a 200 response and valid certificate
3. inspect the rendered language
4. inspect the title and description
5. inspect the canonical
6. inspect every `hreflang` value and reciprocal reference
7. follow the switcher both ways
8. verify important internal links remain in the chosen language where intended

After launch, add the relevant properties or URL prefixes to Search Console if needed and monitor indexation, impressions and chosen canonicals. Do not judge success from an `hreflang` checker alone.

## Common SEO errors

### Every translated page points to the translated homepage

Fix the path construction on the original Squarespace pages using Weglot's current integration guidance.

### Duplicate hreflang sets

Remove the competing implementation or ask Weglot to disable its injection if you deliberately maintain your own tags. Two tools trying to manage the same relationship can produce duplicates or disagreements.

### Translated pages are indexed but titles remain in English

Review SEO translations in the Weglot dashboard. Also check whether the metadata was generated only after the URL was visited in that language.

### Pages are not discovered

Use Weglot's URL management to synchronise missing pages, link language versions clearly and make sure the translated host is not blocked by a password, robots rule or private-language setting.

## If you do not want a monthly translation plan

> **Multilingualizer costs €99/£99/$99 once** and can fit a compatible small site where you enter and maintain translations yourself. Its same-page JavaScript approach is not the same SEO model as Weglot's separate translated URLs. If organic rankings for each language are a primary requirement, treat that difference as a requirement, not a footnote.

Check current Squarespace compatibility before buying and do not claim separate indexable language URLs unless your implementation genuinely provides them.

## Next steps

Estimate the content with the [Weglot pricing calculator for Squarespace](/weglot-pricing-calculator-squarespace/) and run the [multilingual launch checklist](/squarespace-multilingual-launch-checklist/) before making the new languages public.

If the URL and workflow model fits, [check Weglot's current plans](https://www.weglot.com/pricing?fp_ref=multilingualizer).

## Sources checked 21 August 2026

- [Google: managing multilingual and multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Squarespace: creating a multilingual site with Weglot](https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot)
- [Weglot: DNS setup](https://support.weglot.com/article/274-how-do-i-set-up-my-dns)
- [Weglot: troubleshooting hreflang](https://support.weglot.com/article/304-i-have-some-errors-with-the-hreflang-tags)
- [Weglot: managing URLs and generating translations](https://support.weglot.com/article/286-how-can-i-manage-my-urls-and-generate-the-translations)

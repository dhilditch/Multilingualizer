---
title: "Weglot Language Subdomains on Squarespace: Setup and Checks"
slug: weglot-language-subdomains-squarespace
excerpt: "Set up Weglot language subdomains on Squarespace, add the right DNS records and verify SSL, hreflang and translated URLs before launch."
categoryIds: [7, 828]
wpPostId: 45660
status: published
publishedDate: 2026-08-21
publishedUrl: https://www.multilingualizer.com/weglot-language-subdomains-squarespace/
---

Connecting Weglot to Squarespace is the easy part. The bit that causes confusion is the language subdomain setup.

If your main site is `www.example.com`, a French version might live at `fr.example.com` and a German version at `de.example.com`. Weglot supplies the DNS records, but those records still have to be added wherever your domain's DNS is managed.

Squarespace does not silently create every record for you. The exact job depends on who manages your domain.

**Affiliate disclosure:** the Weglot links in this guide are affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

## What the subdomain setup actually does

A language subdomain gives each translated version a separate URL. This matters for two reasons:

- visitors open a URL that is already associated with their chosen language
- search engines can crawl and index the translated version separately

Google recommends separate URLs for different language versions and `hreflang` annotations between them. Weglot's subdomain integration is designed around that model.

You can use Weglot without language subdomains, but Squarespace warns that some content such as error messages or button animations may not appear translated and visitors may notice a delay while translations load. If organic search in the translated language matters, set up the translated URLs properly.

## Who controls each part

There are three systems involved:

1. **Squarespace** owns the website and, if you bought or transferred the domain there, may also manage the DNS.
2. **Weglot** supplies the translated site service and tells you which DNS entries to add.
3. **Your domain or DNS provider** publishes those entries. This may be Squarespace, Cloudflare, GoDaddy or another registrar.

The important question is not where the website is hosted. It is where the domain's authoritative DNS is managed.

## Before you start

Confirm all of the following:

- the site has a custom domain connected
- you know who manages the DNS
- you can sign in to that DNS account
- Weglot is connected to the correct Squarespace site
- the original and destination languages are correct
- the destination languages are still private while you test, if the site is not ready

Squarespace only shows the subdomain option when a custom domain is connected.

## Set up subdomains for a Squarespace-managed domain

1. Open the Squarespace **Site Languages** panel on a version 7.1 site.
2. Under the multilingual SEO settings, choose **Setup Subdomains**.
3. Follow the link into Weglot and copy the DNS entry for each destination language.
4. In Squarespace, open **Domains & Email**, select the managed domain and open its DNS settings.
5. Add a CNAME record for each language. The host is normally the language code, such as `fr`, and the target is the value Weglot supplies.
6. Save the records.
7. Return to Weglot and click **Check DNS**.
8. Wait for each language domain to show as ready before treating the setup as complete.

Use the exact values from the Weglot dashboard. Do not copy another site's target or guess the record from an old tutorial.

## Set up subdomains when the domain is managed elsewhere

The process is the same, but the DNS change happens outside Squarespace.

1. Open the Weglot subdomain setup and copy the required record for each language.
2. Sign in to the provider that controls the domain's DNS.
3. Add each CNAME record there.
4. If the provider has a proxy option, follow Weglot's current instruction for that provider. Do not assume proxying is harmless.
5. Save the records and return to Weglot.
6. Use **Check DNS** and wait for the domain and SSL status to be ready.

Changing nameservers is not normally part of this job. Add the requested records to the DNS service you already use unless Weglot support gives you a specific reason to do otherwise.

## Verify the setup properly

A green DNS tick is necessary, but it is not the full test.

Open an incognito window and check:

- `https://fr.example.com/` loads without a certificate warning
- an internal page keeps the same path on the French subdomain
- the language switcher moves between matching pages, not just homepages
- page titles and visible content appear in the selected language
- navigation, footer and cookie banner are translated where expected
- forms and validation messages work
- the page source contains the expected `hreflang` entries
- the translated page has a sensible canonical URL

Repeat this on desktop and mobile. Test at least one product, blog post, form and error state if the site uses them.

## Common failures

### The DNS check stays red

Check that the host contains only the language label Weglot supplied. Some DNS interfaces add the main domain automatically, so entering the full hostname can create the wrong record.

Also check whether you edited the active DNS provider. A domain can be registered at one company while its nameservers point to another.

### The subdomain loads but SSL is not ready

DNS can resolve before the certificate is issued. Give the service time to initialise, then recheck the status in Weglot. Do not launch by telling visitors to ignore a certificate warning.

### The translated homepage works but inner pages do not

Test real paths and inspect the switcher's destination. This is also the point to verify full-path `hreflang` values on the original Squarespace pages. Weglot documents a Squarespace-specific limitation where it cannot always insert the full translated path into the original page automatically, so use its current integration-hook guidance if your audit finds incomplete tags.

### Search engines have indexed the wrong version

Check the visible language, canonical and reciprocal `hreflang` tags on both the original and translated page. Do not fix this by redirecting every visitor according to their IP or browser language. Google recommends letting users reach and switch between each language URL.

## If you do not want a monthly translation plan

> **Prefer manual control and a one-time cost?** Multilingualizer is a €99/£99/$99 one-time option for site owners who supply and maintain their own translations. It uses a same-page JavaScript method, so it does not provide Weglot's separate indexable language subdomains or protected checkout and account translation. Check current compatibility for your Squarespace setup before buying.

If separate translated URLs and multilingual SEO are important, that difference is decisive. The cheaper billing model is not useful if it removes a requirement your project actually has.

## Next steps

Use the [Weglot pricing calculator for Squarespace](/weglot-pricing-calculator-squarespace/) before selecting a plan, then work through the [Squarespace multilingual launch checklist](/squarespace-multilingual-launch-checklist/).

If Weglot fits, [check its current plans](https://www.weglot.com/pricing?fp_ref=multilingualizer) after confirming your word count and destination-language total.

## Sources checked 21 August 2026

- [Squarespace: creating a multilingual site with Weglot](https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot)
- [Weglot: Squarespace integration and setup](https://support.weglot.com/article/243-squarespace-integration-setup)
- [Weglot: DNS setup](https://support.weglot.com/article/274-how-do-i-set-up-my-dns)
- [Google: managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

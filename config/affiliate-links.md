# Affiliate link configuration

Updated: 21 August 2026

This file contains public referral URLs only. Login credentials, passwords, tokens,
tax information and payout details must not be stored in this repository.

## Elfsight

- Status: active standard link; custom tracking domain pending
- Standard link: https://go.elfsight.io/click?pid=5041&offer_id=3
- WhatsApp widget link: https://go.elfsight.io/click?pid=5041&offer_id=3&l=1677843063
- Intended custom hostname: `elfsight.multilingualizer.com`
- Cloudflare CNAME target: `go.elfsight.io`

Use the standard link for general Elfsight recommendations and the supplied widget link
only where WhatsApp Chat is the actual subject. Do not replace the tracking hostname with
the custom hostname until Affise marks it active and a test click is visible in reporting.

## Spark Plugin

- Status: active
- Standard link: https://sparkplugin.com/?via=david-hilditch
- Deep-link rule: append `?via=david-hilditch` to a URL without a query string, or
  `&via=david-hilditch` when the destination already has one.

Prefer the most relevant product, feature or tutorial page over the homepage.

## CookieYes

- Status: active
- Partner offer: https://www.cookieyes.com/partner-offer/?ref=zta0n2i
- Plans: https://www.cookieyes.com/plans/?ref=zta0n2i
- Deep-link rule: append `?ref=zta0n2i` to a URL without a query string, or
  `&ref=zta0n2i` when the destination already has one.

Use the plans link for plan and pricing decisions. Keep official documentation links
unmodified when they are cited as evidence.

## HubSpot

- Status: application awaiting approval
- Affiliate link: not available

## Ghost Plugins

- Status: signup incomplete
- Affiliate link: not available

## Publication rules

- Put a plain affiliate disclosure before the first monetised link.
- Add `rel="sponsored nofollow"` to affiliate links in rendered WordPress content.
- Record `affiliate_click` with the programme, article slug, link position and feature.
- Test one click after publication and confirm it appears in both site analytics and the
  affiliate dashboard without repeatedly generating test traffic.

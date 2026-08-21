---
title: "CookieYes on a Multilingual Squarespace Site"
slug: cookieyes-multilingual-squarespace-guide
excerpt: "How to configure and test a multilingual CookieYes banner on Squarespace, including language detection, script ordering and consent checks."
categoryIds: [7, 828]
status: draft
affiliateProgramme: cookieyes
affiliateLinkStatus: link-configured-tracking-pending
verificationStatus: squarespace-test-required
---

A multilingual site should not leave its consent controls in one language. It should also not translate the buttons while continuing to load the same non-essential scripts before the visitor chooses.

CookieYes was publicly detectable for eight of the 674 Multilingualizer customers with a reachable site, or 1.2%. That is a small group, but consent software is relevant only where the site's scripts and obligations create the requirement. It should not be promoted to everybody through vague warnings.

**Affiliate disclosure:** this guide contains CookieYes affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

This is technical configuration guidance, not legal advice. Identify the rules that apply to the business before deciding which scripts need consent and what the banner must say.

## Start with the scripts, not the banner colours

Make an inventory of what the public site loads:

- analytics and advertising tags
- embedded video, maps and social posts
- chat and review widgets
- forms and CRM tracking
- ecommerce and payment services
- scheduling and booking tools

For each item, record its purpose, cookies or storage, pages used and intended consent category. CookieYes cannot make an incorrect classification correct merely by displaying a banner.

## Install CookieYes on Squarespace

CookieYes supplies a site script after the domain is added and scanned. Squarespace normally loads it through site-wide code injection.

The important ordering rule is that the consent mechanism must be available before the non-essential scripts it is meant to control. After installing:

1. open the public site in a fresh browser profile
2. inspect cookies and network requests before making a choice
3. reject non-essential categories and check again
4. accept the relevant categories and confirm the expected tools load
5. reopen preferences and change the choice
6. repeat on mobile and in every site language

A visible banner is not proof that blocking works.

## Configure every language

CookieYes currently documents support for 41 banner languages and says multilingual banners require a paid plan.

Its default language selection uses the document's `lang` attribute. That is straightforward when each language page has the correct HTML language value.

A Multilingualizer site can keep language states on the same Squarespace page, so do not assume the browser document language changes whenever the visitor changes the visible page text. Check the rendered `lang` value in each state.

CookieYes also documents an explicit `window.ckySettings.documentLang` setting. That may be the appropriate bridge when the site's language control and the document attribute do not line up, but the timing must be tested. The value needs to be available when CookieYes initialises, not changed after the banner has already rendered.

## Review the banner text properly

Automatic or supplied translations are a starting point. Review:

- banner heading and explanation
- accept, reject and preferences buttons
- category names and descriptions
- cookie-policy link text
- revisit-consent control
- any region-specific wording the business has chosen

The translated version should preserve the meaning and the choices, not merely fit the same number of characters.

One current public example is 2 Square Films. Its French page displayed a CookieYes banner headed `Nous respectons votre vie privée.` with `Personnaliser`, `Tout rejeter` and `Accepter tout` controls when checked on 21 August 2026. The preference centre was also present.

That is the level of verification required. Do not count a CookieYes script as proof of a multilingual banner until the actual controls and preference centre have been opened in the target language.

## Test consent across multilingual pages

Use a fresh browser profile for each full run.

| Test | Language A | Language B | Mobile |
|---|---|---|---|
| Correct banner language |  |  |  |
| No intended non-essential request before choice |  |  |  |
| Reject keeps intended tools blocked |  |  |  |
| Accept loads intended tools |  |  |  |
| Preferences can be changed |  |  |  |
| Cookie-policy link opens the right language |  |  |  |
| Widget does not cover the language control |  |  |  |
| Choice persists as configured |  |  |  |

Also navigate between Squarespace pages without reloading the tab. A site can behave correctly on a direct page load and incorrectly after client-side navigation.

## Common reason the wrong language appears

If the banner stays in one language, check in this order:

1. Is the required language enabled in CookieYes?
2. Does the live document have the expected `lang` value?
3. Does the Squarespace language switch alter that value or only visible content?
4. Is the explicit CookieYes language setting defined before its script loads?
5. Is a cache serving old code or configuration?

Do not add repeated script tags as a workaround. One consent installation should own the state.

## CookieYes versus the native Squarespace banner

Use the least complicated system that meets the site's actual requirements.

The native Squarespace banner may be enough for a simple site with a modest script setup. CookieYes becomes worth inspecting when the business needs capabilities such as a structured cookie inventory, several banner languages, categorised controls, consent-mode integration or central management across more than one site.

Recheck current features and plan requirements against the official product before deciding.

<a href="https://www.cookieyes.com/plans/?ref=zta0n2i" rel="sponsored nofollow">Compare the current CookieYes plans</a> against the scripts, languages and consent controls the site actually needs.

## Where Multilingualizer fits

CookieYes handles the consent interface and script choices. Multilingualizer handles the surrounding Squarespace page copy.

[Our very own Multilingualizer](/product/multilingualizer/) works directly inside the Squarespace editor, so you manage translated text where you already edit the site. It is a one-time purchase and there are no monthly translation fees.

The two can work together, but their language states need to be tested rather than assumed.

## Sources and publication note

- [CookieYes multilingual website guide](https://www.cookieyes.com/documentation/cookieyes-cookie-banner-for-multilingual-websites/)
- [Add a cookie policy to Squarespace](https://www.cookieyes.com/documentation/how-to-add-a-cookie-policy-to-squarespace/)
- [Install CookieYes on a website](https://www.cookieyes.com/documentation/add-cookie-banner-to-website/)
- [Public French CookieYes example on 2 Square Films](https://www.2squarefilms.com/fr/)

This is an editorial draft. Script ordering, the document-language bridge and consent behaviour need to be reproduced on a controlled Squarespace site before publication. CookieYes plan requirements and affiliate terms must be checked again on publication day.

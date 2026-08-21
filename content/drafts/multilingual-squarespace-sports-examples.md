---
title: "Three Multilingual Squarespace Sports Sites: What Works and What Breaks"
slug: multilingual-squarespace-sports-examples
excerpt: "Public examples from a ski marathon, mountain resort and school climbing programme, showing how multilingual Squarespace pages behave beyond the homepage."
categoryIds: [7, 828, 285]
status: draft
verificationStatus: desktop-verified-mobile-screenshots-pending
---

A language selector on a homepage does not prove that a multilingual sports website works.

The useful test is what happens next. Can somebody find the event programme, understand the price, complete an enquiry and follow an external registration or booking link in the language they selected?

I checked three public Squarespace sites currently using Multilingualizer. These are implementation reviews, not testimonials. I have not used private order information, and I am not making claims about their revenue, conversions or satisfaction.

## The three sites

| Site | Public language options | Journey checked |
|---|---|---|
| Finlandia-hiihto | Finnish, English, Swedish, German and Estonian | Homepage and event registration |
| Bortelid | Norwegian and English | Homepage and accommodation booking |
| Junglesport | English and French | Homepage and contact form |

The pages were checked on 21 August 2026. A public website can change after that date.

If one of the implementations has changed or a public fact is wrong, [send me the page and correction](/contact/) and I will recheck it.

## Finlandia-hiihto: five languages around one event

[Finlandia-hiihto](https://magenta-chameleon-rp3a.squarespace.com/) is an annual mass skiing event in Lahti, Finland. The current site promotes the 20 and 21 February 2027 event.

The homepage provides Finnish, English, Swedish, German and Estonian controls. Multilingualizer changes the visible content on the current page, while the navigation also contains language-specific destination pages for important tasks.

That combination is useful for an event site. General sections can stay in one Squarespace page, while critical pages have explicit routes such as:

- Finnish registration
- English registration
- Swedish registration
- German registration
- Estonian registration

### What works

The English registration page includes distances, dated price bands, entry inclusions, payment information and optional services. Its document language is set to English.

The event also links to external participant lists, results and photo services. Several of those links include an explicit language parameter or language path, so the hand-off is considered rather than left entirely to the supplier's default.

### What needs watching

Five languages create five opportunities for an external system to fall back to the wrong language. Some result and participant links reuse an English destination for several language states.

That may be the only language offered by the external service, but it should be stated or tested rather than assumed. Event dates, prices and registration deadlines also need one source of truth so the language versions do not drift apart.

## Bortelid: translating a large resort website on the same URLs

[Bortelid](https://www.bortelid.no/) is a Norwegian mountain resort with skiing, cross-country trails, accommodation, equipment hire, activities and property information.

Its compact flag-style control changes the homepage between Norwegian and English without sending the visitor to a separate URL. The English state translates the main navigation and the core resort explanation.

### What works

The accommodation page also follows the selected English state. Its heading, introduction and booking explanation change to English, and the final booking button sends the visitor to the external Beds24 booking service.

This is a good example of why the inner-page check matters. The translated homepage leads to a translated explanation of the accommodation offer before the external hand-off.

### What needs fixing

In the English state, the page's HTML language value becomes `undefined` rather than `en`. The visible page is English, but assistive technology and language-aware browser features do not receive a valid document language.

The browser title on the accommodation page also remains Norwegian. Visible translation and document metadata are separate jobs on a same-URL multilingual site.

The final Beds24 booking experience is outside Squarespace and needs its own language configuration. Multilingualizer cannot translate a protected or separately hosted booking application merely because the link starts on a translated page.

## Junglesport: a bilingual enquiry journey with mixed form text

[Junglesport](https://junglesport.squarespace.com/) brings a mobile climbing and jungle-gym programme into schools in Canada.

The public Squarespace site switches between English and French. In the French state, the main navigation, programme headings, homepage explanation and contact-page introduction change correctly, and the document language changes to French.

### What works

The programme terminology is not treated as a direct word swap. The French page uses appropriate headings for school programmes and the contact page explains the response process in French.

The selected language also persists when moving from the homepage to the contact page on the same site.

### What needs fixing

The French contact form still contains a mixture of French and English:

- `First Name` and `Last Name` remain English
- the region prompt says `Please select the area closest to you`
- the dropdown contains English location and selection text
- several homepage testimonials remain in English

The form is the point where an interested school becomes an enquiry. Mixed labels there matter more than an untranslated decorative caption lower down the homepage.

## Three lessons for multilingual sports sites

### 1. Test the conversion page, not only the homepage

For an event, this is registration. For a resort, it is booking. For a programme provider, it is the enquiry form.

Write down that page before starting translation and include it in every release check.

### 2. Treat external services as separate language systems

Results services, booking engines, maps, payment pages and form suppliers do not inherit the Squarespace language automatically.

Pass an explicit language path or parameter where the supplier supports one. Where it does not, explain the hand-off and check that the visitor can still complete the task.

### 3. Set the document language and metadata

Changing visible text is only one layer. Check the live page's:

- HTML `lang` value
- browser title
- meta description
- form validation messages
- embedded and external service language

This is especially important for a same-URL approach because there is no separate language URL carrying its own metadata by default.

## A practical test route

Use this on each language before launch:

1. Open the homepage in a fresh browser session.
2. Select the language from the visible control.
3. Confirm the main heading, navigation and document language.
4. Open the registration, booking or enquiry page through normal navigation.
5. Check every field, price, date, button and validation message.
6. Follow the external hand-off without completing a purchase or submission.
7. Repeat on a phone-sized screen.

Record the exact page and language when something fails. “The French site is broken” is not a useful bug report. “The region dropdown on the French contact page still has an English placeholder” is.

## Where Multilingualizer fits

> **Our very own [Multilingualizer](/product/multilingualizer/) is a [ssp_price product="4462"] one-time purchase.** It works directly inside the Squarespace editor, so you add and manage translations where you already edit your site instead of learning another interface. It does not machine-translate content, provide separate language URLs or translate protected checkout and account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.

For a small number of carefully maintained languages, that direct control can be a good fit. The examples above also show the responsibility that comes with it: forms, metadata and external services still need deliberate testing.

## Publication note

Desktop language switching and the named inner pages were verified on 21 August 2026. Original desktop and mobile screenshots, plus a working 390-pixel viewport check, are still required before publication.

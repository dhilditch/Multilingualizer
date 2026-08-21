---
title: "What Weglot Doesn't Translate on Squarespace"
slug: what-weglot-does-not-translate-squarespace
excerpt: "See the Squarespace features Weglot does not translate, what may need dynamic rules, and how to test the complete visitor journey before paying."
categoryIds: [7, 828]
wpPostId: 45661
status: published
publishedDate: 2026-08-21
publishedUrl: https://www.multilingualizer.com/what-weglot-does-not-translate-squarespace/
---

Weglot translates most of a normal Squarespace website, but "most" is not a useful specification when the missing part contains your booking form, customer login or follow-up campaign.

The correct question is: does it translate every step this particular visitor needs to complete?

Squarespace publishes a short list of features that are not integrated with Weglot. There is also a second category: content that is not officially listed as unsupported but is generated dynamically or supplied by another service and therefore needs testing.

**Affiliate disclosure:** the Weglot links in this guide are affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

## Squarespace's documented exclusions

Squarespace says these features cannot currently be translated through its Weglot integration:

- Squarespace Email Campaigns
- Acuity Scheduling
- third-party content blocks, with the map block given as an example
- Member Sites
- customer account login screens

Do not turn that into the broader claim that "Weglot does not translate emails". Squarespace customer notification emails for store orders are a different feature and can be translated. Email Campaigns is the unsupported marketing-email product.

## What each exclusion means in practice

### Email Campaigns

Your website can be French while a newsletter signup confirmation or campaign remains in the original language. Check which system owns the form, confirmation and campaign content.

If email is an important conversion channel, decide whether to run separate language lists and templates in another email platform or keep one language with clearly explained expectations.

### Acuity Scheduling

A translated service page can send someone into an untranslated appointment flow. Test service names, calendars, intake questions, confirmation screens, reminder emails, cancellation and rescheduling.

Do not stop at the first booking screen. The parts that cause support problems are often the validation message and the email sent later.

### Third-party blocks

A block embedded on a Squarespace page may be owned and rendered by another company. Weglot cannot be assumed to translate content inside every iframe, script widget or externally hosted form.

Examples worth testing include maps, review widgets, live chat, event widgets, donation forms and external booking tools.

### Member Sites and customer login

The marketing site can be translated while account access remains in the original language. If membership is the product, this is not a minor gap.

Map the sign-up, login, forgotten-password, gated-content and account-management journey before deciding whether the integration fits.

## Content that may need extra configuration

Some text appears after the page first loads. Examples include a validation error, live stock message, filter result, pop-up or personalised greeting.

Weglot documents dynamic rules for non-WordPress sites. You identify the element with a CSS selector and add it as a dynamic element in the Weglot dashboard. Weglot then rechecks that element after it changes.

That can help with content produced on the page. It does not give Weglot control over an unrelated service that is technically or contractually outside the integration. A dynamic rule is a testable tool, not a universal workaround.

## Build a translation coverage map

List every step a visitor can take and record who owns it.

| Step | System | Test in each language | Result |
|---|---|---|---|
| Landing page | Squarespace | Heading, navigation, buttons | |
| Contact form | Squarespace or third party | Labels, errors, confirmation | |
| Booking | Acuity or other | Calendar, questions, emails | |
| Account | Squarespace | Login, reset, account pages | |
| Checkout | Squarespace Commerce | Products, shipping, tax, payment | |
| Order email | Squarespace | Subject, body, dynamic order data | |
| Marketing email | Email Campaigns or other | Signup and campaign | |

Do this before choosing a plan. A translation tool should be judged against the journey, not the homepage.

## A practical test process

1. Finish the original-language site and remove demo content.
2. Connect Weglot without announcing the new language.
3. Keep the destination language private while reviewing it.
4. Visit every important URL in an incognito window.
5. Trigger empty and invalid form states.
6. Create a test account if the site uses accounts.
7. Place a low-value or test order if ecommerce is enabled.
8. Inspect every confirmation screen and email.
9. Repeat on mobile.
10. Record each gap as supported, configurable, externally owned or blocking.

## When the limitation is acceptable

Weglot can still be a sensible choice when the untranslated feature is peripheral, when the external service has its own language settings, or when you can replace the feature with one that supports the target language.

It is a poor fit when the unsupported step is the product itself. A booking business that cannot localise booking questions should solve that before spending time polishing translated blog posts.

## If you do not want a monthly translation plan

> **Our very own [Multilingualizer](/product/multilingualizer/) is a [ssp_price product="4462"] one-time purchase.** It works directly inside the Squarespace editor, so you add and manage translations where you already edit your site instead of learning Weglot's interface. It does not machine-translate content, provide Weglot's separate language URLs or translate protected checkout/account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.

## Next steps

Read [Does Weglot translate Squarespace checkout, forms and emails?](/weglot-squarespace-checkout-forms-emails/) for the transaction-specific checks. Use the [Weglot pricing calculator](/weglot-pricing-calculator-squarespace/) to estimate the plan after you know which content should be included.

If the coverage works for your site, [check Weglot's current plans](https://www.weglot.com/pricing?fp_ref=multilingualizer).

## Related Squarespace guides

- [Test checkout, forms and customer emails](/weglot-squarespace-checkout-forms-emails/)
- [Plan a multilingual Squarespace ecommerce site](/squarespace-multilingual-ecommerce/)
- [Run the Squarespace multilingual launch checklist](/squarespace-multilingual-launch-checklist/)
- [Browse all Squarespace multilingual guides](/make-squarespace-multilingual/)

## Sources checked 21 August 2026

- [Squarespace: creating a multilingual site with Weglot](https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot)
- [Weglot: translating dynamic content](https://support.weglot.com/article/253-how-to-translate-dynamic-content)

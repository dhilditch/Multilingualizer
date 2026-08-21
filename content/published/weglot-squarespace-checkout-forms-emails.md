---
title: "Does Weglot Translate Squarespace Checkout, Forms and Emails?"
slug: weglot-squarespace-checkout-forms-emails
excerpt: "Check how Weglot handles Squarespace checkout, forms, customer emails, accounts and third-party services before launching another language."
categoryIds: [7, 828]
wpPostId: 45664
status: published
publishedDate: 2026-08-21
publishedUrl: https://www.multilingualizer.com/weglot-squarespace-checkout-forms-emails/
---

A translated product page is not a translated buying journey.

Before using Weglot on a Squarespace store or lead-generation site, test the path from the first landing page to the final confirmation email. Different parts of that path are owned by Squarespace, Weglot or a third-party service, and they do not all behave in the same way.

**Affiliate disclosure:** the Weglot links in this guide are affiliate links. If you buy through one, I may earn a commission. You pay the same price either way.

## The short answer

- **Normal Squarespace page content:** generally translated through the integration.
- **Squarespace customer notification emails:** translated notifications are enabled by default when Weglot is connected.
- **Squarespace Email Campaigns:** not integrated with Weglot.
- **Acuity Scheduling:** not integrated with Weglot.
- **Member Sites and customer account login screens:** not integrated with Weglot.
- **Third-party blocks and embedded services:** test individually. Squarespace gives the map block as an unsupported example.
- **Dynamic form text:** it may need a Weglot dynamic rule if it appears after the initial page parse.

The checkout itself deserves a real test order. Do not convert "customer notifications are translated" into a promise that every payment method, custom widget and account screen will be translated on your site.

## Test the checkout as a customer would

Use a test product or a low-value order and check:

1. product title and description
2. variant labels and option values
3. sale price and normal price
4. cart labels and empty-cart state
5. discount-code labels and errors
6. shipping methods and delivery text
7. tax labels
8. payment-method instructions
9. checkout validation messages
10. order confirmation page
11. receipt and fulfilment emails
12. refund or cancellation email if relevant

Repeat for each destination language and on mobile. If the store sells gift cards, Squarespace says the purchaser and recipient receive notifications in the language used by the purchaser, so include that path in the test.

## Customer notification emails are not Email Campaigns

Squarespace uses similar words for two different things.

**Customer notifications** are operational emails such as order and fulfilment messages. Squarespace says multilingual customer notifications are enabled by default after connecting Weglot, and you can preview them by language.

**Email Campaigns** is Squarespace's marketing-email product. Squarespace lists it among the features that cannot be translated through the Weglot integration.

If the site uses both, the order email can be multilingual while the newsletter remains in one language. Plan them separately.

## Preview the emails before launch

In Squarespace:

1. open the Customer Notifications panel
2. choose an email category and message type
3. select the destination language in the preview control
4. review the subject, headings, instructions and dynamic order data

Do not review only the generic paragraphs. Product names, delivery methods and policy links can carry more risk than the surrounding template.

If the site is not a store, Squarespace recommends disabling multilingual customer notifications so unused email content does not contribute to the translated-word count.

## Forms need more than a visual check

A form has at least four states:

- blank
- partly completed
- invalid
- successfully submitted

Test the labels, placeholders, required-field messages, consent copy, button text and success message in each state.

Then check the email sent to the visitor and the notification sent to the site owner. A translated on-page success message does not prove the responder received a translated email.

## Dynamic form and widget content

Some text is injected after the page loads. Weglot documents dynamic rules for non-WordPress sites: identify the relevant CSS selector, add it in the dashboard and retest the interaction.

Use a narrow, stable selector. A broad selector can repeatedly recheck a large part of the page and make debugging harder.

Dynamic rules are suitable for content that Weglot can access in the page. They do not make an external iframe or protected service translatable by magic.

## Third-party forms, chat and bookings

For every embedded service, find its own language controls and test the hand-off.

Record:

- whether the widget detects the selected site language
- whether it has its own translation settings
- whether confirmation and reminder emails use that language
- whether the visitor can change language inside the service
- whether the service sends them back to the matching Squarespace language URL

Acuity Scheduling is explicitly outside the Squarespace Weglot integration. Use Acuity's own current language options or another booking system if a multilingual booking flow is essential.

## Accounts and memberships

Squarespace lists Member Sites and customer account login screens as unsupported. That affects login, password reset and account management, not just one button.

If an account is required to buy or access the product, show the untranslated screens to somebody fluent in the destination language and decide whether the journey is acceptable. Do not hide the limitation in a footer note.

## A pass or fail matrix

| Journey | Pass condition | Failure response |
|---|---|---|
| Contact form | Labels, errors, consent and success translated | Add a tested dynamic rule or replace the form |
| Checkout | Products, totals, shipping, tax and validation understood | Fix configuration or do not launch that language |
| Customer email | Correct language and dynamic order data | Edit notification translations before launch |
| Marketing email | Language-specific campaign exists | Segment elsewhere or keep expectations clear |
| Booking | Whole booking and reminder flow works | Configure the booking platform separately |
| Account | Login and recovery are usable | Provide a clear support route or reconsider the setup |

## If you do not want a monthly translation plan

> **Our very own [Multilingualizer](/product/multilingualizer/) is a [ssp_price product="4462"] one-time purchase.** It works directly inside the Squarespace editor, so you add and manage translations where you already edit your site instead of learning Weglot's interface. It does not machine-translate content, provide Weglot's separate language URLs or translate protected checkout/account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.

## Next steps

Use the [Squarespace multilingual ecommerce guide](/squarespace-multilingual-ecommerce/) for catalogue and store operations, or [see everything Weglot does not translate on Squarespace](/what-weglot-does-not-translate-squarespace/).

Estimate the translated content with the [Weglot pricing calculator](/weglot-pricing-calculator-squarespace/). If the full journey passes, [check Weglot's current plans](https://www.weglot.com/pricing?fp_ref=multilingualizer).

## Related Squarespace guides

- [Check what Weglot does not translate](/what-weglot-does-not-translate-squarespace/)
- [Plan a multilingual Squarespace ecommerce site](/squarespace-multilingual-ecommerce/)
- [Run the Squarespace multilingual launch checklist](/squarespace-multilingual-launch-checklist/)
- [Browse all Squarespace multilingual guides](/make-squarespace-multilingual/)

## Sources checked 21 August 2026

- [Squarespace: creating a multilingual site with Weglot](https://support.squarespace.com/hc/en-us/articles/205809778-Creating-a-multilingual-site-with-Weglot)
- [Weglot: translating dynamic content](https://support.weglot.com/article/253-how-to-translate-dynamic-content)

---
id: OPP-2026-013
title: HubSpot with a Multilingual Squarespace Site
slug: hubspot-squarespace-multilingual-guide
contentType: article
primaryQuery: HubSpot Squarespace multilingual forms
searchIntent: implementation and commercial investigation
commercialRoute: hubspot-affiliate
status: briefed
---

# Problem

A sales-led multilingual business needs enquiries attributed to the right page and language. A generic CRM recommendation does not explain form language, tracking, consent or Squarespace AJAX navigation.

# Evidence

- HubSpot was publicly detectable for 22 of 674 customers with a reachable site (3.3%). Ten current installations were in technology and software.
- [HubSpot tracking-code documentation](https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code) covers externally hosted pages and non-HubSpot forms.
- [HubSpot external form guide](https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site) covers embedding and contact creation.
- [HubSpot troubleshooting](https://knowledge.hubspot.com/forms/why-doesn-t-my-externally-embedded-hubspot-form-work) documents a Squarespace AJAX-loading failure mode.

# Existing URL decision

- Canonical URL: `/hubspot-squarespace-multilingual-guide/`.
- Competing internal URLs: none.
- Separate troubleshooting page for forms disappearing after internal navigation.

# Solution structure

1. Qualify whether the business actually needs a CRM.
2. Add and verify the tracking code and external domain.
3. Build one form per required language or use verified HubSpot language features.
4. Preserve language and source page as CRM properties.
5. Test consent, AJAX navigation, validation, confirmation and mobile layout.

# Product fit and CTA

- HubSpot CTA only for businesses with a sales pipeline, follow-up process or multiple lead sources.
- Multilingualizer controls the surrounding Squarespace page copy, not HubSpot CRM operations.
- CookieYes CTA where HubSpot tracking requires consent management.

# Publication checks

- [ ] Test current HubSpot embed on Squarespace 7.1
- [ ] State subscription requirements for translation features
- [ ] Recheck affiliate terms and free-plan limits
- [ ] Affiliate disclosure and tracked links added

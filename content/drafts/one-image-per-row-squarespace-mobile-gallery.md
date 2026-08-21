---
title: "Show One Image Per Row in a Squarespace Mobile Gallery"
slug: one-image-per-row-squarespace-mobile-gallery
excerpt: "How to identify the Squarespace gallery type, apply Ghost Plugins' free mobile layout fix and test captions, links and multilingual behaviour."
categoryIds: [7, 828]
status: draft
affiliateProgramme: ghost-plugins
affiliateLinkStatus: pending
verificationStatus: squarespace-test-required
---

A desktop gallery can look fine with three or four columns and become a strip of tiny images on a phone. If the images carry the story, one image per row is often easier to view.

This is exactly the kind of query Ghost Plugins should be promoted through. The reader has a specific Squarespace problem, Ghost has a specific solution, and the solution can be explained before asking anybody to buy a plugin bundle.

Ghost Plugins was publicly detectable on three of the 337 Multilingualizer customers with a reachable Squarespace site, or 0.9%. That does not tell us which Ghost product they bought. It does show that the product family appears in live multilingual Squarespace builds.

**Affiliate disclosure:** the solution linked in this guide is currently free. I intend to use a Ghost affiliate link only for the optional paid products after the account and click tracking are configured. If you later buy through one, I may earn a commission. You pay the same price either way.

## First identify the gallery

Ghost's current free solution is for Squarespace 7.1 gallery page sections using the Simple or Strips layout.

The official page says it does not apply to:

- the Masonry gallery-section layout
- the Squarespace Grid Gallery Block
- an arbitrary product gallery or image block

That distinction is more important than the CSS. A selector written for one gallery structure cannot reliably change another.

Edit the page and click the gallery. If the editor identifies it as a gallery section, open its design settings and note the layout. Stop if it is not Simple or Strips and find a solution for the actual block type.

## Apply the free Ghost solution

Ghost publishes the current code and instructions on its [one image per row mobile gallery page](https://www.ghostplugins.com/freeplugins/1-image-per-row-on-mobile-grid-gallery).

Use the current code from that page rather than copying an old version from a roundup:

1. Back up any existing Custom CSS.
2. Copy the current snippet from Ghost.
3. Open Squarespace's Custom CSS editor.
4. Paste it after any general gallery rules so the intended mobile override wins.
5. Save and test the public page while signed out.

Keep a note of the added rule and its purpose. If the site later changes gallery layout, remove or replace the rule rather than leaving dead overrides in the stylesheet.

## Test around the breakpoint

Do not test only one phone preset. Resize through the widths around the rule's breakpoint and look for a point where the layout jumps, captions overlap or images become unexpectedly wide.

Check:

- portrait and landscape phone widths
- image cropping and focal points
- captions of different lengths
- click-through links and lightbox behaviour
- the first and last gallery item
- spacing between rows
- editor preview and the signed-out public page

If the page exists in several languages, use the longest translated caption in the test. A layout that works for a short English label can fail with longer German or French copy.

## Scope the rule if only one gallery should change

A site-wide gallery selector may alter other matching galleries. If only one page section needs the mobile layout, scope the rule to that section's stable Squarespace identifier.

Do this only after inspecting the current live markup. Section identifiers and generated class names are not equally stable. Test again after duplicating or moving the section.

## When the free fix is not the right answer

Use another route when:

- the block is a Masonry gallery or Grid Gallery Block
- each item needs complex hover content or filtering
- the gallery source should update automatically from Instagram or another service
- the desired mobile layout is a swipeable carousel rather than one image per row
- several unrelated gallery enhancements would otherwise become separate snippets

An Elfsight gallery can make sense for an external content source. Spark Plugin can make sense when several pre-built Squarespace enhancements are needed. Ghost's paid products make sense when one of them directly matches the required slideshow, video, product or gallery behaviour.

## Where Multilingualizer fits

The gallery rule changes layout. It does not translate the page, captions or calls to action.

[Our very own Multilingualizer](/product/multilingualizer/) works directly inside the Squarespace editor, so you stay in control of the translated text and there are no monthly translation fees. Test the mobile gallery in every language after the layout change.

## Sources and publication note

- [Ghost Plugins: one image per row on a mobile grid gallery](https://www.ghostplugins.com/freeplugins/1-image-per-row-on-mobile-grid-gallery)
- [Ghost Plugins products](https://www.ghostplugins.com/products)
- [Ghost Super Plugins](https://www.ghostplugins.com/super-plugins)

This is an editorial draft. The current Ghost snippet needs to be reproduced on a controlled Squarespace 7.1 Simple and Strips gallery, with original desktop and mobile screenshots, before publication. Compatibility and affiliate terms must be checked again on publication day.

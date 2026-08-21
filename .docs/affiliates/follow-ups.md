# Affiliate programme follow-ups

Updated: 21 August 2026

These jobs do not block research, drafting, customer-example analysis or internal
linking. They block the specific publication or monetisation steps named below.

## FUP-AFF-001: Create a controlled Squarespace 7.1 test site

- Status: waiting for Dave
- Required action: create a Squarespace account and a disposable Squarespace 7.1 test
  site with code injection available.
- Purpose: reproduce installation and navigation behaviour rather than presenting public
  customer examples as controlled product tests.
- Test fixtures required: two page languages, a gallery section using Simple and Strips
  layouts, a Code Block, site-wide code injection, long translated captions and a mobile
  viewport.
- Unblocks: the Spark Plugin review, CookieYes multilingual guide, HubSpot multilingual
  guide and Ghost mobile-gallery tutorial.
- Completion evidence: record the test-site URL locally, never in Git if it contains
  access tokens; save original screenshots under the applicable `content/assets/`
  programme folder; update each draft's `verificationStatus`.

## FUP-AFF-002: Complete HubSpot affiliate approval

- Status: application awaiting approval
- Required action: when approved, generate the standard referral link and any supported
  deep link for the relevant HubSpot product or pricing page.
- Then: add the public links to `config/affiliate-links.md`, update the HubSpot draft's
  disclosure and CTA, test one click and record the approval date and current terms.
- Does not block: finishing the factual draft or running the controlled Squarespace embed
  test.

## FUP-AFF-003: Complete Ghost Plugins affiliate signup

- Status: signup incomplete
- Required action: finish signup and generate a standard referral link plus a product
  deep link if Ghost supports one.
- Then: add the public links to `config/affiliate-links.md`; keep the free Ghost snippet
  linked directly because the free solution is the reader's primary answer; use the
  affiliate link only for a genuinely relevant paid product.
- Does not block: drafting or testing the free mobile-gallery solution.

## FUP-AFF-004: Activate the Elfsight custom tracking domain

- Status: standard links usable; custom hostname pending
- Required action: create a proxied Cloudflare CNAME for
  `elfsight.multilingualizer.com` pointing to `go.elfsight.io`,
  then submit the hostname in Affise with HTTPS and Cloudflare selected.
- Do not upload: the private key used by `www.multilingualizer.com` or any wildcard key.
- Completion evidence: Affise marks the hostname active; one generated tracking link uses
  the custom hostname; one test click appears in reporting and reaches the intended
  Elfsight landing page.
- Then: update `config/affiliate-links.md`, the published Elfsight article and its
  measurement annotation.

## Credential cleanup

Two affiliate login passwords were found in the original untracked
`config/affliate-links.md` file. The file was removed before any commit. Rotate those
passwords and keep the replacements in a password manager, not this repository or `.env`.

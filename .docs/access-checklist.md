# Access checklist

Complete these tasks in order. The first three unlock the read-only baseline. The remaining tasks unlock attribution and controlled publishing.

## 1. Create one Google Cloud project and service account

- Create or select a Google Cloud project for this workspace.
- Enable **Google Search Console API** and **Google Analytics Data API**.
- Create a service account and download its JSON key to a private location outside this repository, for example `~/.config/multilingualizer/google-service-account.json`.
- Copy `.env.example` to `.env` and set `GOOGLE_APPLICATION_CREDENTIALS` to that absolute path.
- Never send the JSON key in chat or commit it to Git.

Deliverable needed here: confirmation that the API project and service account exist, plus the service-account email address if help checking permissions is required.

## 2. Grant Search Console read access

- In Search Console, open the property covering `www.multilingualizer.com`.
- Prefer the domain property `sc-domain:multilingualizer.com`; it prevents protocol or hostname data being missed.
- Add the service-account email as a **Full user**. Restricted access is enough for many reads, but Full avoids gaps in URL inspection and property data.
- Set `GSC_SITE_URL=sc-domain:multilingualizer.com` in `.env`. If only a URL-prefix property exists, use the exact property string shown by Search Console.

Verification: `npm run check:access` reports `Google Search Console: OK`.

## 3. Create/install GA4, then grant read access

- The public site audit on 20 August 2026 found only Universal Analytics tag `UA-30254111-7` in the homepage source. Standard Universal Analytics properties stopped processing data on 1 July 2023, so this tag cannot provide the baseline required here.
- Check the Google account for an existing GA4 property and web data stream for multilingualizer.com. If none exists, create them.
- Install the GA4 measurement ID directly or, preferably, through a dedicated Google Tag Manager container so purchase and affiliate events can be managed and tested.
- Verify live collection in GA4 Realtime and DebugView after accepting the site's analytics consent.
- In GA4 Admin, note the numeric property ID for multilingualizer.com.
- Add the service-account email to the property as **Viewer**.
- Set `GA4_PROPERTY_ID` in `.env`.

Verification: `npm run check:access` reports `Google Analytics 4: OK`.

## 4. Confirm conversion tracking

Viewer access lets this workspace read data, but the property must collect the right events. Grant Dave or the implementing account Editor access to GA4 and Google Tag Manager, or provide access to the site code that owns tracking, so these can be verified:

- `purchase` fires once after a successful WooCommerce order and includes transaction ID, item/product identity, value and currency;
- `affiliate_click` fires on outbound Weglot affiliate links with `affiliate_program=weglot`, source page and destination URL;
- `begin_checkout` and `add_to_cart` fire for both products;
- internal admin/test traffic is filtered or identifiable;
- cross-domain behaviour is configured if checkout or payment leaves the domain;
- consent configuration does not silently remove all measurement in important markets.

Mark `purchase` and `affiliate_click` as key events. Affiliate clicks are leads, not confirmed affiliate sales. Import confirmed commission data separately if Weglot provides an export or API.

## 5. Grant controlled WordPress access

The site exposes WordPress application-password authentication. Create a dedicated WordPress user named for this automation with the **Editor** role initially, then:

- generate an application password for that user;
- set `WP_USERNAME`, `WP_APPLICATION_PASSWORD` and `WP_SITE_URL` in `.env`;
- run `npm run check:access`;
- keep the first publishing phase draft-only.

Editor is enough for posts and pages. Product, redirect, tracking, theme or plugin changes need a separate Administrator credential or a human implementation pass. Do not reuse Dave's main password.

## 6. Provide site implementation access

For technical fixes and reusable page components, provide one source of truth:

- the Git repository containing the active WordPress theme, child theme and site-specific plugin code, preferably cloned into this workspace or linked by its canonical path; or
- SSH/SFTP plus the hosting deployment procedure if no repository exists.

Also provide Cloudflare access if cache rules, redirects or response headers need changing. Start with read-only access where possible.

## 7. Provide commercial truth sources

To connect search work to sales and avoid publishing incorrect product claims, provide:

- current pricing and licence rules for both products;
- the canonical product code/repositories or current feature documentation;
- current platform compatibility and known limitations;
- WooCommerce read-only reporting access or a repeatable order export;
- Weglot affiliate dashboard access, API or monthly CSV export, including the attribution window;
- refund/cancellation data if conversion quality is to be assessed rather than just gross orders.

## 8. Provide optional research and outreach access

These are useful after measurement is working:

- Ahrefs, Semrush or similar, if already paid for. Do not buy one until GSC data has been assessed.
- Bing Webmaster Tools for another query/indexation dataset.
- The real forum/community accounts Dave is happy to use, with a list of allowed communities and their promotion rules.
- Email/newsletter platform read access for distributing useful guides and measuring assisted conversions.

Do not provide passwords in repository files. Prefer OAuth, scoped users, API keys with minimum permissions, or application passwords.

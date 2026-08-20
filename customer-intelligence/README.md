# Multilingualizer customer intelligence

This is a separate, local-only customer-site scanner. It imports paid buyer and
installation records from a private SQL MCP export, stores them in its own
SQLite database, fetches each registered homepage and one deterministically
selected About page, and presents the evidence in a loopback-only browser UI.

Private inputs, HTML and generated databases live below
`data/customer-intelligence/`, which is ignored by Git.

## Commands

```bash
npm run clients:import -- data/customer-intelligence/paid-clients-source.json
npm run clients:crawl -- --limit 10
npm run clients:crawl -- --workers 6 --delay-ms 250
npm run clients:reprocess
npm run clients:serve
```

Then open <http://127.0.0.1:4174>.

The crawler uses only public pages, validates every destination against public
IP ranges, follows redirects manually, limits response size, fetches at most a
homepage and one About page per site, and retains the fetched HTML locally so
future extraction rules can be tested without repeatedly requesting customer
sites.

`clients:reprocess` reads the retained HTML without making network requests. It
rebuilds current-language-tool evidence and the third-party technology
inventory, and deterministically classifies sector, business model, consent use
case and peer group. New fingerprints and classification rules can therefore be
applied to the complete saved corpus without requesting the sites again.

Multilingualizer status is evidence-based:

- `detected`: its hosted script, script URL or distinctive
  `changeLanguageAndMove` function is present
- `possible`: only a weaker name or generic language-function marker is present
- `not_detected`: the fetched homepage contains no current marker

The technology inventory records every external script and iframe host. Known
fingerprints are assigned a product and category; unmatched hosts remain under
`Unclassified third-party` and can still be searched and filtered. This is
evidence of browser-visible technology, not proof of SaaS products used only on
the server or hidden behind authenticated pages.

Parked domains are recorded as a separate site state. Technology found on a
parking provider's page is retained as evidence but marked as not attributable
to the customer, so it is excluded from aggregate SaaS counts and filters.

The import source is expected to contain a SQL MCP result with `columns` and
`rows`. A client is eligible only when the source query has already restricted
orders to paid Multilingualizer products and completed/processing statuses.
The repeatable source query is in `paid-clients.sql`; run it through the
`multilingualizer-sql` MCP with a 2,000-row limit and save the untruncated result
below the ignored data directory before importing it.

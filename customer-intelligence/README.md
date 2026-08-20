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
npm run clients:serve
```

Then open <http://127.0.0.1:4174>.

The crawler uses only public pages, validates every destination against public
IP ranges, follows redirects manually, limits response size, fetches at most a
homepage and one About page per site, and retains the fetched HTML locally so
future extraction rules can be tested without repeatedly requesting customer
sites.

Multilingualizer status is evidence-based:

- `detected`: its hosted script, script URL or distinctive
  `changeLanguageAndMove` function is present
- `possible`: only a weaker name or generic language-function marker is present
- `not_detected`: the fetched homepage contains no current marker

The import source is expected to contain a SQL MCP result with `columns` and
`rows`. A client is eligible only when the source query has already restricted
orders to paid Multilingualizer products and completed/processing statuses.
The repeatable source query is in `paid-clients.sql`; run it through the
`multilingualizer-sql` MCP with a 2,000-row limit and save the untruncated result
below the ignored data directory before importing it.

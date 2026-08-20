=== Multilingualizer Site Audit ===
Contributors: multilingualizer
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 0.1.0

Squarespace Weglot pricing calculator and consent-based, rate-limited public website audit.

== Installation ==

1. Upload and activate the plugin.
2. Add `[multilingualizer_weglot_calculator]` to a page.
3. Confirm WordPress cron and outbound email work before enabling full reports.

== Privacy and safety ==

The full audit requires explicit authority and consent. The plugin stores the supplied URL and email address in a transient for no more than 24 hours. It uses WordPress safe HTTP requests, checks at most 10 same-host public HTML pages, limits each response to 2 MB and rate-limits public endpoints.

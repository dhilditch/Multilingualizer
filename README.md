# Multilingualizer growth workspace

This repository is the operating system for increasing qualified organic traffic and sales for:

- Multilingualizer
- Multicurrencyalizer
- the Weglot affiliate programme, when Weglot is genuinely the better fit

It stores the strategy, content pipeline, outreach ledger and repeatable collectors for Google Search Console, Google Analytics 4 and WordPress. Credentials and raw analytics data stay local and are ignored by Git.

## Start here

1. Read [`.docs/access-checklist.md`](.docs/access-checklist.md) and grant the listed access.
2. Copy `.env.example` to `.env` and fill in the property identifiers and credential paths.
3. Run `npm install`.
4. Run `npm run check:access`.
5. Run `npm run collect:gsc`, `npm run collect:ga4`, `npm run collect:wp` and `npm run crawl`.
6. Review `.docs/operating-loop.md` before creating or publishing content.

## Commands

| Command | Purpose |
|---|---|
| `npm run check` | Run unit tests and validate non-secret configuration |
| `npm run check:access` | Test GSC, GA4 and WordPress credentials without changing anything |
| `npm run collect` | Run the complete weekly data collection and crawl |
| `npm run crawl` | Crawl sitemap URLs and produce a technical/on-page report |
| `npm run collect:gsc` | Save current/prior 28-day Search Console reports and derived opportunities |
| `npm run collect:ga4` | Save current/prior 28-day GA4 landing-page and conversion reports |
| `npm run collect:wp` | Export public WordPress posts, pages and products |
| `npm run wp:list -- --type=posts` | List WordPress content |
| `npm run wp:draft -- content/drafts/example.md` | Create a WordPress draft from Markdown |
| `npm run audit:serve` | Run the local price calculator and audit prototype |
| `npm run audit:worker` | Process queued full-site audits into the ignored report and email outbox |

WordPress creation is deliberately draft-only. Publishing is a separate editorial decision after factual, visual and conversion checks.

## Audit tool prototype

Run `npm run audit:serve`, then open `http://127.0.0.1:4173`. The prototype supports manual word counts, pasted content, an immediate homepage audit and a consented queued whole-site audit. Run `npm run audit:worker` to process queued jobs.

Reports and provider-ready email messages are written below `data/`, which is ignored by Git. The prototype does not send email. Read [`.docs/audit-lead-tool.md`](.docs/audit-lead-tool.md) before deploying it or connecting a mail provider.

## Repository layout

- `.docs/` - mission, access, baseline, strategy and operating procedures
- `config/` - public site configuration
- `content/briefs/` - approved briefs with query, intent, evidence and CTA
- `content/drafts/` - Markdown drafts ready for WordPress
- `content/published/` - publication records and refresh dates
- `outreach/` - relevant conversations, proposed replies and results
- `opportunities/` - durable opportunity decisions and progress
- `measurement/` - annotations for site, content and tracking changes
- `scripts/` - collectors, crawler and WordPress draft tooling
- `data/` - ignored raw/derived data generated locally
- `reports/generated/` - ignored generated reports

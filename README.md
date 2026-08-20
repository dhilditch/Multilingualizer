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

WordPress creation is deliberately draft-only. Publishing is a separate editorial decision after factual, visual and conversion checks.

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

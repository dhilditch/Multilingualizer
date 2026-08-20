# Audit queue and background worker

## Live flow

1. The visitor enters a URL and requests the immediate homepage estimate.
2. Only after that succeeds, the calculator offers the ten-page report.
3. The visitor confirms they are authorised to audit the site and provides an email address.
4. WordPress inserts a row into `wp_msa_audit_jobs` with status `queued`.
5. A worker atomically changes one row to `processing`, crawls up to ten same-host public HTML pages and posts the report back to WordPress.
6. WordPress emails the report and changes the row to `completed` or `failed`.

The plugin schedules a WordPress fallback worker after 30 seconds so a live lead is not stranded if the external process is unavailable. The standalone worker uses the same atomic claim operation, so the two workers cannot process one row concurrently.

## Run the standalone worker

The worker reads the existing `WP_SITE_URL`, `WP_USERNAME` and `WP_APPLICATION_PASSWORD` values from `.env`.

Run one queued job:

```sh
node scripts/audit-worker.mjs --once
```

Run continuously:

```sh
node scripts/audit-worker.mjs
```

Optional values:

```dotenv
AUDIT_WORKER_ID=multilingualizer-worker-1
AUDIT_WORKER_INTERVAL_MS=15000
```

Use a process supervisor on permanent hosting. The worker must be able to make outbound HTTP requests to visitor sites and authenticated REST requests to `www.multilingualizer.com`.

## Data retention

The queue stores the submitted URL, email address, job state and report. A daily WordPress task deletes completed and failed rows after 30 days. Do not use submitted email addresses for marketing unless the visitor separately opts in to that use.

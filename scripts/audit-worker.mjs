import 'dotenv/config';
import os from 'node:os';
import { calculateWeglotPrice, readWeglotPricing } from './lib/audit.mjs';
import { crawlWebsite } from './lib/safe-crawl.mjs';

const siteUrl = String(process.env.WP_SITE_URL || '').replace(/\/$/, '');
const username = process.env.WP_USERNAME;
const password = process.env.WP_APPLICATION_PASSWORD;
const once = process.argv.includes('--once');
const intervalMs = Number(process.env.AUDIT_WORKER_INTERVAL_MS || 15000);
const workerId = String(process.env.AUDIT_WORKER_ID || `${os.hostname()}:${process.pid}`).slice(0, 100);

if (!siteUrl || !username || !password) {
  throw new Error('WP_SITE_URL, WP_USERNAME and WP_APPLICATION_PASSWORD are required');
}

const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
const pricing = await readWeglotPricing();

async function api(path, payload) {
  const response = await fetch(`${siteUrl}/wp-json/multilingualizer-audit/v1${path}`, {
    method: 'POST',
    headers: { authorization, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status}: ${body.message || response.statusText}`);
  return body;
}

async function processNext() {
  const job = await api('/jobs/claim', { worker_id: workerId });
  if (!job) return false;
  process.stdout.write(`Claimed ${job.job_uuid}: ${job.url}\n`);
  try {
    const audit = await crawlWebsite(job.url, { maxPages: 10, maxAssetChecks: 30 });
    const price = calculateWeglotPrice(
      audit.sourceWords,
      Number(job.destination_languages),
      pricing,
      job.billing || 'monthly'
    );
    await api(`/jobs/${job.id}/complete`, { success: true, report: { audit, price } });
    process.stdout.write(`Completed ${job.job_uuid}: ${audit.pages.length} pages, ${audit.sourceWords} source words\n`);
  } catch (error) {
    await api(`/jobs/${job.id}/complete`, { success: false, error: error.message });
    process.stderr.write(`Failed ${job.job_uuid}: ${error.message}\n`);
  }
  return true;
}

do {
  const worked = await processNext();
  if (once) break;
  if (!worked) await new Promise((resolve) => setTimeout(resolve, intervalMs));
} while (true);

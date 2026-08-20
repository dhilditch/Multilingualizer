import 'dotenv/config';
import { analyticsClient, searchConsoleClient } from './lib/google.mjs';
import { readSiteConfig } from './lib/common.mjs';

const config = await readSiteConfig();
const results = [];

async function check(name, configured, callback) {
  if (!configured) {
    results.push({ name, status: 'NOT CONFIGURED', detail: 'See .docs/access-checklist.md' });
    return;
  }
  try {
    results.push({ name, status: 'OK', detail: await callback() });
  } catch (error) {
    results.push({ name, status: 'FAILED', detail: error.message });
  }
}

const googleConfigured = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);

await check('Google Search Console', googleConfigured, async () => {
  const siteUrl = process.env.GSC_SITE_URL || config.searchConsoleSiteUrl;
  const response = await searchConsoleClient().sites.list();
  const permission = response.data.siteEntry?.find((entry) => entry.siteUrl === siteUrl)?.permissionLevel;
  if (!permission) throw new Error(`Credential cannot see ${siteUrl}`);
  return `${siteUrl} (${permission})`;
});

await check('Google Analytics 4', googleConfigured && Boolean(process.env.GA4_PROPERTY_ID), async () => {
  const property = `properties/${process.env.GA4_PROPERTY_ID}`;
  const response = await analyticsClient().properties.runReport({
    property,
    requestBody: { dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }], metrics: [{ name: 'sessions' }], limit: '1' }
  });
  return `${property} (${response.data.rows?.[0]?.metricValues?.[0]?.value || 0} sessions in test window)`;
});

await check('WordPress write access', Boolean(process.env.WP_USERNAME && process.env.WP_APPLICATION_PASSWORD), async () => {
  const siteUrl = (process.env.WP_SITE_URL || config.baseUrl).replace(/\/$/, '');
  const token = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`).toString('base64');
  const response = await fetch(`${siteUrl}/wp-json/wp/v2/users/me?context=edit`, { headers: { Authorization: `Basic ${token}` } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const user = await response.json();
  return `${user.name} (${user.slug})`;
});

for (const result of results) console.log(`${result.status.padEnd(14)} ${result.name}: ${result.detail}`);
if (results.some((result) => result.status === 'FAILED')) process.exitCode = 1;

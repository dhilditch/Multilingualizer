import 'dotenv/config';
import path from 'node:path';
import { analyticsClient } from './lib/google.mjs';
import { isoDate, reportingPeriods, requiredEnv, root, toCsv, writeJson, writeText } from './lib/common.mjs';

requiredEnv(['GOOGLE_APPLICATION_CREDENTIALS', 'GA4_PROPERTY_ID']);
const property = `properties/${process.env.GA4_PROPERTY_ID}`;
const client = analyticsClient();
const periods = reportingPeriods(1);

async function run(period, dimensions, metrics, limit = 100000) {
  const response = await client.properties.runReport({
    property,
    requestBody: {
      dateRanges: [period],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit: String(limit)
    }
  });
  return (response.data.rows || []).map((row) => ({
    ...Object.fromEntries(dimensions.map((name, index) => [name, row.dimensionValues[index]?.value || ''])),
    ...Object.fromEntries(metrics.map((name, index) => [name, Number(row.metricValues[index]?.value || 0)]))
  }));
}

const metrics = ['sessions', 'engagedSessions', 'keyEvents', 'ecommercePurchases', 'totalRevenue'];
const output = { collectedAt: new Date().toISOString(), property, periods, current: {}, previous: {} };
for (const [periodName, period] of Object.entries(periods)) {
  output[periodName].totals = await run(period, [], metrics, 1);
  output[periodName].dates = await run(period, ['date'], metrics);
  output[periodName].landingPages = await run(period, ['landingPagePlusQueryString', 'sessionDefaultChannelGroup'], metrics);
  output[periodName].countries = await run(period, ['country'], metrics);
  output[periodName].events = await run(period, ['eventName'], ['eventCount', 'totalUsers']);
}

const stamp = isoDate();
const rawPath = `data/ga4/${stamp}.json`;
await writeJson(rawPath, output);
await writeJson('data/ga4/latest.json', output);

const landingRows = output.current.landingPages
  .map((row) => ({
    landingPage: row.landingPagePlusQueryString,
    channel: row.sessionDefaultChannelGroup,
    sessions: row.sessions,
    engagedSessions: row.engagedSessions,
    keyEvents: row.keyEvents,
    purchases: row.ecommercePurchases,
    revenue: row.totalRevenue
  }))
  .sort((a, b) => b.sessions - a.sessions);
const csvPath = `reports/generated/ga4-landing-pages-${stamp}.csv`;
await writeText(csvPath, toCsv(landingRows, ['landingPage', 'channel', 'sessions', 'engagedSessions', 'keyEvents', 'purchases', 'revenue']));

const total = output.current.totals[0] || {};
const previous = output.previous.totals[0] || {};
const summaryPath = `reports/generated/ga4-summary-${stamp}.md`;
await writeText(summaryPath, `# GA4 summary - ${stamp}\n\nProperty: \`${property}\`\n\n| Metric | Current 28 days | Previous 28 days | Change |\n|---|---:|---:|---:|\n${metrics.map((metric) => `| ${metric} | ${total[metric] || 0} | ${previous[metric] || 0} | ${(total[metric] || 0) - (previous[metric] || 0)} |`).join('\n')}\n\nSee \`${path.relative(root, csvPath)}\`.\n`);

console.log(`Saved ${path.relative(root, rawPath)}`);
console.log(`Saved ${path.relative(root, csvPath)} (${landingRows.length} landing-page/channel rows)`);
console.log(`Saved ${path.relative(root, summaryPath)}`);

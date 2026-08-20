import 'dotenv/config';
import path from 'node:path';
import { searchConsoleClient } from './lib/google.mjs';
import { isoDate, readSiteConfig, reportingPeriods, requiredEnv, root, toCsv, writeJson, writeText } from './lib/common.mjs';

requiredEnv(['GOOGLE_APPLICATION_CREDENTIALS']);
const config = await readSiteConfig();
const siteUrl = process.env.GSC_SITE_URL || config.searchConsoleSiteUrl;
const client = searchConsoleClient();
const periods = reportingPeriods();

async function query(period, dimensions) {
  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody: {
      ...period,
      dimensions,
      dataState: 'final',
      rowLimit: 25000,
      startRow: 0
    }
  });
  return (response.data.rows || []).map((row) => ({
    ...Object.fromEntries(dimensions.map((dimension, index) => [dimension, row.keys[index]])),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0
  }));
}

const reportDefinitions = {
  queries: ['query'],
  pages: ['page'],
  queryPages: ['query', 'page'],
  dates: ['date'],
  devices: ['device'],
  countries: ['country']
};

const output = { collectedAt: new Date().toISOString(), siteUrl, periods, current: {}, previous: {} };
for (const [name, dimensions] of Object.entries(reportDefinitions)) {
  output.current[name] = await query(periods.current, dimensions);
  output.previous[name] = await query(periods.previous, dimensions);
}

const previousByQueryPage = new Map(output.previous.queryPages.map((row) => [`${row.query}\n${row.page}`, row]));
const opportunities = output.current.queryPages
  .filter((row) => row.impressions >= 20)
  .map((row) => {
    const previous = previousByQueryPage.get(`${row.query}\n${row.page}`) || {};
    const types = [];
    if (row.position >= 4 && row.position <= 20) types.push('striking-distance');
    if (row.position <= 10 && row.impressions >= 50 && row.ctr < 0.03) types.push('low-ctr');
    if ((previous.clicks || 0) > row.clicks || (previous.impressions || 0) > row.impressions * 1.25) types.push('declining');
    return {
      types: types.join('|'),
      query: row.query,
      page: row.page,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Number((row.ctr * 100).toFixed(2)),
      position: Number(row.position.toFixed(2)),
      previousClicks: previous.clicks || 0,
      previousImpressions: previous.impressions || 0,
      clickChange: row.clicks - (previous.clicks || 0),
      impressionChange: row.impressions - (previous.impressions || 0)
    };
  })
  .filter((row) => row.types)
  .sort((a, b) => b.impressions - a.impressions || a.position - b.position);

output.opportunities = opportunities;
const stamp = isoDate();
const reportPath = `data/gsc/${stamp}.json`;
const latestPath = 'data/gsc/latest.json';
await writeJson(reportPath, output);
await writeJson(latestPath, output);

const columns = ['types', 'query', 'page', 'clicks', 'impressions', 'ctr', 'position', 'previousClicks', 'previousImpressions', 'clickChange', 'impressionChange'];
const csvPath = `reports/generated/gsc-opportunities-${stamp}.csv`;
await writeText(csvPath, toCsv(opportunities, columns));

const currentClicks = output.current.queries.reduce((sum, row) => sum + row.clicks, 0);
const currentImpressions = output.current.queries.reduce((sum, row) => sum + row.impressions, 0);
const previousClicks = output.previous.queries.reduce((sum, row) => sum + row.clicks, 0);
const previousImpressions = output.previous.queries.reduce((sum, row) => sum + row.impressions, 0);
const summaryPath = `reports/generated/gsc-summary-${stamp}.md`;
await writeText(summaryPath, `# Search Console summary - ${stamp}\n\nProperty: \`${siteUrl}\`\n\n| Metric | ${periods.current.startDate} to ${periods.current.endDate} | Previous 28 days | Change |\n|---|---:|---:|---:|\n| Clicks | ${currentClicks} | ${previousClicks} | ${currentClicks - previousClicks} |\n| Impressions | ${currentImpressions} | ${previousImpressions} | ${currentImpressions - previousImpressions} |\n\nDerived opportunities: ${opportunities.length}\n\nSee \`${path.relative(root, csvPath)}\`.\n`);

console.log(`Saved ${path.relative(root, reportPath)}`);
console.log(`Saved ${path.relative(root, csvPath)} (${opportunities.length} opportunities)`);
console.log(`Saved ${path.relative(root, summaryPath)}`);

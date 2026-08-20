import { load } from 'cheerio';
import path from 'node:path';
import { isoDate, readSiteConfig, root, toCsv, writeJson, writeText } from './lib/common.mjs';

const config = await readSiteConfig();

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'MultilingualizerGrowthAudit/1.0' }, redirect: 'follow' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

function xmlLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) => match[1].replaceAll('&amp;', '&').trim());
}

async function sitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const xml = await fetchText(url);
  const locations = xmlLocations(xml);
  if (/<sitemapindex[\s>]/i.test(xml)) {
    return (await Promise.all(locations.map((location) => sitemapUrls(location, seen)))).flat();
  }
  return locations;
}

function visibleWordCount($) {
  $('script,style,noscript,svg,template').remove();
  const text = $('main').text() || $('article').text() || $('body').text();
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function inspect(url) {
  try {
    const started = Date.now();
    const response = await fetch(url, { headers: { 'user-agent': 'MultilingualizerGrowthAudit/1.0' }, redirect: 'follow' });
    const html = await response.text();
    const $ = load(html);
    const internalLinks = $('a[href]').toArray().map((node) => $(node).attr('href')).filter((href) => {
      try { return new URL(href, response.url).hostname === new URL(config.baseUrl).hostname; } catch { return false; }
    }).length;
    return {
      url,
      finalUrl: response.url,
      status: response.status,
      milliseconds: Date.now() - started,
      title: $('title').first().text().trim(),
      description: $('meta[name="description"]').attr('content')?.trim() || '',
      canonical: $('link[rel="canonical"]').attr('href')?.trim() || '',
      robots: $('meta[name="robots"]').attr('content')?.trim() || '',
      h1Count: $('h1').length,
      h1: $('h1').first().text().replace(/\s+/g, ' ').trim(),
      wordCount: visibleWordCount($),
      internalLinks,
      schemaBlocks: $('script[type="application/ld+json"]').length
    };
  } catch (error) {
    return { url, finalUrl: '', status: 0, error: error.message, milliseconds: 0, title: '', description: '', canonical: '', robots: '', h1Count: 0, h1: '', wordCount: 0, internalLinks: 0, schemaBlocks: 0 };
  }
}

async function pool(items, concurrency, callback) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await callback(items[current]);
      console.log(`[${current + 1}/${items.length}] ${results[current].status} ${items[current]}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

const urls = [...new Set(await sitemapUrls(config.sitemapUrl))];
const rows = await pool(urls, config.crawlConcurrency || 6, inspect);
const duplicateTitles = Object.entries(Object.groupBy(rows.filter((row) => row.title), (row) => row.title)).filter(([, matches]) => matches.length > 1);
const issues = {
  non200: rows.filter((row) => row.status !== 200),
  missingTitle: rows.filter((row) => !row.title),
  missingDescription: rows.filter((row) => !row.description),
  missingCanonical: rows.filter((row) => !row.canonical),
  missingH1: rows.filter((row) => row.h1Count === 0),
  multipleH1: rows.filter((row) => row.h1Count > 1),
  noindex: rows.filter((row) => /noindex/i.test(row.robots)),
  thin: rows.filter((row) => row.status === 200 && row.wordCount < 250),
  duplicateTitles: duplicateTitles.map(([title, matches]) => ({ title, urls: matches.map((row) => row.url) }))
};

const stamp = isoDate();
const jsonPath = `data/crawl/${stamp}.json`;
await writeJson(jsonPath, { collectedAt: new Date().toISOString(), sitemapUrl: config.sitemapUrl, rows, issues });
await writeJson('data/crawl/latest.json', { collectedAt: new Date().toISOString(), sitemapUrl: config.sitemapUrl, rows, issues });
const columns = ['url', 'finalUrl', 'status', 'milliseconds', 'title', 'description', 'canonical', 'robots', 'h1Count', 'h1', 'wordCount', 'internalLinks', 'schemaBlocks', 'error'];
const csvPath = `reports/generated/site-crawl-${stamp}.csv`;
await writeText(csvPath, toCsv(rows, columns));
const summaryPath = `reports/generated/site-crawl-summary-${stamp}.md`;
const issueLines = Object.entries(issues).map(([name, values]) => `| ${name} | ${values.length} |`).join('\n');
await writeText(summaryPath, `# Site crawl summary - ${stamp}\n\nCrawled ${rows.length} URLs from \`${config.sitemapUrl}\`.\n\n| Issue | Count |\n|---|---:|\n${issueLines}\n\nSee \`${path.relative(root, csvPath)}\`.\n`);
console.log(`Saved ${path.relative(root, jsonPath)}`);
console.log(`Saved ${path.relative(root, csvPath)}`);
console.log(`Saved ${path.relative(root, summaryPath)}`);

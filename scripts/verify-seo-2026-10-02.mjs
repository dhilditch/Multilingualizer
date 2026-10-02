import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { wpTool } from './lib/wp-mcp.mjs';

const base = 'https://www.multilingualizer.com';
const slugs = ['weglot-pricing-calculator-squarespace', 'godaddy-website-builder-no-multilingual-fix', 'website-builders-multilingual-support-comparison', 'make-squarespace-multilingual', 'weglot-squarespace-checkout-forms-emails', 'squarespace-weglot-seo', 'how-weglot-counts-words-squarespace', 'weglot-language-subdomains-squarespace', 'what-weglot-does-not-translate-squarespace', 'squarespace-multilingual-launch-checklist', 'is-weglot-worth-it-small-squarespace-site', 'squarespace-multilingual-ecommerce'];
const results = [];
const links = new Set();
for (const slug of slugs) {
  const url = `${base}/${slug}/`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, url);
  const html = await response.text();
  const $ = load(html);
  assert.equal($('link[rel="canonical"]').attr('href'), url, `Canonical: ${url}`);
  assert.equal($('h1').length, 1, `H1 count: ${url}`);
  const events = $('[data-ssa-event]').map((i, element) => $(element).attr('data-ssa-event')).get();
  assert.ok(events.includes('multilingualizer_product_click'), `Product event: ${url}`);
  if (['weglot-pricing-calculator-squarespace', 'website-builders-multilingual-support-comparison'].includes(slug)) assert.ok(events.includes('affiliate_click_weglot'), `Affiliate event: ${url}`);
  if (slugs.slice(0, 4).includes(slug)) {
    assert.ok($('meta[name="description"]').attr('content'), `Description: ${url}`);
    assert.ok(!$('.post-content, #themify_builder_content-5936').text().includes('$3.99'), `Old subscription: ${url}`);
  }
  if (slug === 'weglot-pricing-calculator-squarespace') assert.equal($('[data-msa-calculator]').length, 1, 'Calculator still renders');
  if (slug === 'make-squarespace-multilingual') {
    assert.ok($('#themify_builder_content-5936 img').length >= 4, 'Themify imagery preserved');
    assert.ok($('.ssap-price, .ssap-price-wrapper, [data-product-id="4462"]').length || html.includes('ajax-price'), 'Dynamic product price');
  }
  $('.post-content a[href], #themify_builder_content-5936 a[href]').each((i, element) => {
    const url = new URL($(element).attr('href'), base);
    if (url.origin === base && !url.search && !url.pathname.startsWith('/assets/')) links.add(url.origin + url.pathname);
  });
  results.push({ url, status: response.status, title: $('title').text(), description: $('meta[name="description"]').attr('content'), h1: $('h1').text(), events });
}
const linkResults = [];
for (const url of links) {
  const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `Internal link: ${url}`);
  linkResults.push({ url, status: response.status, finalUrl: response.url });
}
const snapshot = JSON.parse((await wpTool('wp_get_post_snapshot', { ID: 5936, include: ['meta'] })).content[0].text);
const before = JSON.parse(JSON.parse(await fs.readFile('data/seo-backups/2026-10-02/5936.json', 'utf8')).content[0].text);
const builderBefore = JSON.parse(before.meta._themify_builder_settings_json);
const builderAfter = JSON.parse(snapshot.meta._themify_builder_settings_json);
function structure(value) {
  if (Array.isArray(value)) return value.map(structure);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'content_text').map(([key, item]) => [key, structure(item)]));
}
assert.deepEqual(structure(builderAfter), structure(builderBefore), 'Themify layout, modules, images and styles unchanged');
await fs.writeFile('data/seo-backups/2026-10-02/verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), results, linkResults, themifyStructurePreserved: true }, null, 2));
console.log(`Verified ${results.length} live pages, ${linkResults.length} internal routes and unchanged Themify structure.`);

import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { root } from './common.mjs';

const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('en', { granularity: 'word' })
  : null;

export function countWords(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  if (segmenter) return [...segmenter.segment(text)].filter((part) => part.isWordLike).length;
  return (text.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu) || []).length;
}

export async function readWeglotPricing() {
  return JSON.parse(await fs.readFile(path.join(root, 'config/weglot-pricing.json'), 'utf8'));
}

export function calculateWeglotPrice(sourceWords, destinationLanguages, pricing, billing = 'monthly') {
  const words = Number(sourceWords);
  const languages = Number(destinationLanguages);
  if (!Number.isFinite(words) || words < 0) throw new Error('Word count must be zero or greater');
  if (!Number.isInteger(languages) || languages < 1 || languages > 20) {
    throw new Error('Destination languages must be a whole number from 1 to 20');
  }
  if (!['monthly', 'annual'].includes(billing)) throw new Error('Billing must be monthly or annual');

  const translatedWords = Math.ceil(words) * languages;
  const plan = pricing.plans.find((candidate) => (
    candidate.translatedWords >= translatedWords && candidate.languages >= languages
  ));

  return {
    sourceWords: Math.ceil(words),
    destinationLanguages: languages,
    translatedWords,
    billing,
    currency: pricing.currency,
    checkedAt: pricing.checkedAt,
    source: pricing.source,
    plan: plan ? {
      ...plan,
      price: plan[billing],
      period: billing === 'annual' ? 'year' : 'month'
    } : null
  };
}

function absoluteUrl(value, base) {
  try { return new URL(value, base).href; } catch { return null; }
}

export function analyseHtml(html, pageUrl) {
  const $ = load(html);
  $('script,style,noscript,svg,template').remove();
  const visibleText = ($('main').text() || $('article').text() || $('body').text())
    .replace(/\s+/g, ' ')
    .trim();
  const metadataText = [
    $('title').first().text(),
    $('meta[name="description"]').attr('content'),
    ...$('img[alt]').toArray().map((node) => $(node).attr('alt'))
  ].filter(Boolean).join(' ');
  const links = [...new Set($('a[href]').toArray()
    .map((node) => absoluteUrl($(node).attr('href'), pageUrl))
    .filter(Boolean))];
  const images = [...new Set($('img[src]').toArray()
    .map((node) => absoluteUrl($(node).attr('src'), pageUrl))
    .filter(Boolean))];
  const emailCount = new Set($('a[href^="mailto:"]').toArray()
    .map((node) => ($(node).attr('href') || '').slice(7).split('?')[0].toLowerCase())
    .filter(Boolean)).size;
  const phoneCount = new Set($('a[href^="tel:"]').toArray()
    .map((node) => ($(node).attr('href') || '').slice(4).replace(/\s+/g, ''))
    .filter(Boolean)).size;

  return {
    url: pageUrl,
    title: $('title').first().text().replace(/\s+/g, ' ').trim(),
    description: ($('meta[name="description"]').attr('content') || '').trim(),
    h1: $('h1').first().text().replace(/\s+/g, ' ').trim(),
    h1Count: $('h1').length,
    lang: ($('html').attr('lang') || '').trim(),
    hreflangCount: $('link[rel="alternate"][hreflang]').length,
    canonical: ($('link[rel="canonical"]').attr('href') || '').trim(),
    visibleWords: countWords(visibleText),
    metadataWords: countWords(metadataText),
    estimatedSourceWords: countWords(visibleText) + countWords(metadataText),
    links,
    images,
    contactSignals: { emailCount, phoneCount },
    hasCurrencySignals: /(?:[$€£¥]|\b(?:USD|EUR|GBP|CAD|AUD|JPY|CHF)\b)/.test(visibleText)
  };
}

export function buildTips(pages, brokenLinks = [], brokenImages = []) {
  const tips = [];
  const missingDescriptions = pages.filter((page) => !page.description).length;
  const missingH1 = pages.filter((page) => page.h1Count !== 1).length;
  const missingLang = pages.filter((page) => !page.lang).length;
  if (missingDescriptions) tips.push(`${missingDescriptions} page${missingDescriptions === 1 ? ' has' : 's have'} no meta description.`);
  if (missingH1) tips.push(`${missingH1} page${missingH1 === 1 ? '' : 's'} do not have exactly one H1.`);
  if (missingLang) tips.push(`${missingLang} page${missingLang === 1 ? '' : 's'} do not declare a page language.`);
  if (!pages.some((page) => page.hreflangCount > 0)) tips.push('No hreflang annotations were found on the pages checked.');
  if (brokenLinks.length) tips.push(`${brokenLinks.length} broken internal link${brokenLinks.length === 1 ? '' : 's'} were found.`);
  if (brokenImages.length) tips.push(`${brokenImages.length} broken image${brokenImages.length === 1 ? '' : 's'} were found.`);
  if (pages.some((page) => page.hasCurrencySignals)) tips.push('Currency signals were found, so localised price display may be relevant alongside translation.');
  return tips;
}

import * as cheerio from 'cheerio';
import { detectTechnologies } from './technology.mjs';

const SOCIAL_HOSTS = new Map([
  ['facebook.com', 'facebook'], ['instagram.com', 'instagram'], ['linkedin.com', 'linkedin'],
  ['youtube.com', 'youtube'], ['youtu.be', 'youtube'], ['x.com', 'x'], ['twitter.com', 'x'],
  ['tiktok.com', 'tiktok'], ['pinterest.com', 'pinterest'], ['threads.net', 'threads'],
]);

const ABOUT_TERMS = [
  'about', 'about-us', 'who-we-are', 'our-story', 'company', 'team',
  'a-propos', 'qui-sommes-nous', 'over-ons', 'over-mij', 'sobre-nosotros',
  'sobre-nos', 'uber-uns', 'ueber-uns', 'chi-siamo', 'om-oss', 'over',
];
const CONTACT_TERMS = ['contact', 'contact-us', 'get-in-touch', 'kontakt', 'contacto', 'contato', 'contactez-nous'];

const LANGUAGE_TOOL_RULES = [
  ['Weglot', 98, [
    ['weglot-cdn', /cdn\.weglot\.com\/[^"'\s<]+/i],
    ['weglot-initializer', /Weglot\.initialize\s*\(/i],
    ['weglot-switcher', /(?:id|class)=["'][^"']*\bweglot-container\b/i],
  ]],
  ['GTranslate', 98, [
    ['gtranslate-cdn', /cdn\.gtranslate\.net\/[^"'\s<]+/i],
    ['gtranslate-settings', /window\.gtranslateSettings\s*=/i],
    ['gtranslate-wrapper', /(?:id|class)=["'][^"']*\bgtranslate_wrapper\b/i],
  ]],
  ['TranslatePress', 98, [
    ['translatepress-assets', /wp-content\/plugins\/translatepress-multilingual\//i],
    ['translatepress-switcher', /\btrp-language-switcher(?:-container)?\b/i],
  ]],
  ['WPML', 98, [
    ['wpml-assets', /wp-content\/plugins\/sitepress-multilingual-cms(?:_old)?\//i],
    ['wpml-switcher', /\bwpml-ls(?:-|\b)|\bicl_language_selector\b/i],
  ]],
  ['Polylang', 95, [
    ['polylang-assets', /wp-content\/plugins\/polylang(?:-pro)?\//i],
    ['polylang-switcher', /\blang-item-(?:[a-z]{2,3}|first|last|current)\b|\bpll_switcher\b/i],
  ]],
  ['ConveyThis', 98, [
    ['conveythis-cdn', /cdn\.conveythis\.com\/javascript\/conveythis\.js/i],
    ['conveythis-initializer', /ConveyThis_Initializer\.(?:init|start)\s*\(/i],
  ]],
  ['Linguise', 98, [
    ['linguise-cdn', /cdn\.linguise\.com\//i],
    ['linguise-switcher', /\blinguise[_-](?:switcher|dynamic|language)\b/i],
  ]],
  ['Bablic', 98, [
    ['bablic-cdn', /(?:d|cdn2?)\.bablic\.com\/(?:snippet|js)\//i],
    ['bablic-data', /\bdata-bablic(?:-|=)/i],
  ]],
  ['Localize', 98, [
    ['localize-cdn', /(?:global\.)?localizecdn\.com\//i],
    ['localize-initializer', /Localize\.initialize\s*\(/i],
    ['localize-script', /localizejs\.com\/[^"'\s<]+\.js/i],
  ]],
  ['Langify', 95, [
    ['langify-switcher', /\bly-languages-switcher\b|\blangify-switcher\b/i],
    ['langify-script', /(?:cdn\.)?langify-app\.com\//i],
  ]],
  ['Transcy', 95, [
    ['transcy-script', /(?:cdn\.)?transcy(?:-app)?\.(?:com|io)\//i],
    ['transcy-widget', /(?:id|class)=["'][^"']*\btranscy(?:-|_)/i],
  ]],
  ['LangShop', 95, [
    ['langshop-script', /(?:cdn\.)?langshop\.app\//i],
    ['langshop-widget', /(?:id|class)=["'][^"']*\blangshop(?:-|_)/i],
  ]],
  ['Translation Lab', 95, [
    ['translation-lab-assets', /translation-lab-language-switcher/i],
  ]],
  ['Google Translate widget', 95, [
    ['google-translate-script', /translate\.google\.com\/translate_a\/element\.js/i],
    ['google-translate-widget', /\bgoogle_translate_element\b/i],
  ]],
  ['Wix Multilingual', 95, [
    ['wix-multilingual', /\bwixMultilingual\b|\bwix-multilingual\b/i],
  ]],
];

export function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function comparableHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function sameSite(left, right) {
  return comparableHost(left.hostname) === comparableHost(right.hostname);
}

function safeUrl(value, baseUrl) {
  try {
    const url = new URL(value, baseUrl);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function visibleText($) {
  $('script,style,noscript,template,svg').remove();
  return cleanText($('body').text());
}

function meaningfulParagraphs($, limit = 6) {
  return $('main p, article p, [role="main"] p, .sqs-block-content p, body p')
    .map((_, element) => cleanText($(element).text()))
    .get()
    .filter((text) => text.length >= 45 && !/cookie|privacy preferences|javascript is disabled/i.test(text))
    .filter((text, index, values) => values.indexOf(text) === index)
    .slice(0, limit);
}

function scorePageLink(anchorText, pathname, terms) {
  const text = cleanText(anchorText).toLowerCase().replace(/[^a-z0-9\p{L}]+/gu, '-').replace(/^-|-$/g, '');
  const path = pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  let score = 0;
  for (const term of terms) {
    if (path === term) score = Math.max(score, 100);
    else if (path.endsWith(`/${term}`) || path.startsWith(`${term}/`)) score = Math.max(score, 85);
    else if (path.includes(term)) score = Math.max(score, 65);
    if (text === term) score += 35;
    else if (text.includes(term)) score += 15;
  }
  if (path.split('/').length > 3) score -= 10;
  return score;
}

export function discoverPageUrl(html, baseUrl, kind) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const terms = kind === 'about' ? ABOUT_TERMS : CONTACT_TERMS;
  const candidates = [];
  $('a[href]').each((documentPosition, element) => {
    const url = safeUrl($(element).attr('href'), base);
    if (!url || !sameSite(url, base)) return;
    url.hash = '';
    const score = scorePageLink($(element).text(), url.pathname, terms);
    if (score > 0) candidates.push({ url: url.href, score, documentPosition });
  });
  candidates.sort((left, right) => right.score - left.score || left.documentPosition - right.documentPosition || left.url.localeCompare(right.url));
  return candidates[0]?.url ?? null;
}

function parseJsonLd($) {
  const values = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).text());
      const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
      while (queue.length) {
        const value = queue.shift();
        if (!value || typeof value !== 'object') continue;
        values.push(value);
        if (Array.isArray(value['@graph'])) queue.push(...value['@graph']);
      }
    } catch {
      // Invalid third-party JSON-LD is common and must not stop the site scan.
    }
  });
  return values;
}

function detectPlatform(html) {
  const rules = [
    ['Squarespace', /static1\.squarespace\.com|squarespace-cdn\.com|Squarespace\.Commerce|SQUARESPACE_CONTEXT|data-nc-base/i],
    ['Wix', /static\.parastorage\.com|wixstatic\.com|X-Wix-/i],
    ['Webflow', /data-wf-page=|data-wf-site=|website-files\.com/i],
    ['Shopify', /cdn\.shopify\.com|Shopify\.theme|shopify-section/i],
    ['Weebly', /cdn2\.editmysite\.com|weebly\.com\/uploads/i],
    ['Zoho Sites', /zohositesstatic\.com|sites\.zoho\./i],
    ['WordPress', /wp-content\/|wp-includes\//i],
  ];
  return rules.find(([, pattern]) => pattern.test(html))?.[0] ?? '';
}

export function multilingualizerEvidence(html) {
  const rules = [
    ['changeLanguageAndMove', /changeLanguageAndMove\s*\(/i],
    ['changeLanguage', /(?:function\s+changeLanguage|changeLanguage\s*\()/i],
    ['multilingualizer-script', /(?:src|href)=["'][^"']*multilingualizer[^"']*\.js/i],
    ['multilingualizer-host', /(?:www\.)?multilingualizer\.com\/[A-Za-z0-9_./?=&%-]*\.js/i],
    ['multilingualizer-name', /\bmultilingualizer\b/i],
  ];
  return rules.filter(([, pattern]) => pattern.test(html)).map(([name]) => name);
}

function uniqueEvidence(values) {
  const found = new Map();
  for (const value of values.flat()) found.set(`${value.tool}:${value.marker}`, value);
  return [...found.values()];
}

export function detectLanguageTechnology(html) {
  const $ = cheerio.load(html);
  const tools = new Set();
  const evidence = [];
  const mlEvidence = multilingualizerEvidence(html);
  const mlStatus = classifyMultilingualizerEvidence(mlEvidence);
  for (const marker of mlEvidence) {
    evidence.push({
      tool: 'Multilingualizer',
      marker,
      confidence: mlStatus === 'detected' ? 98 : 60,
    });
  }
  if (mlStatus === 'detected') tools.add('Multilingualizer');

  for (const [tool, confidence, markers] of LANGUAGE_TOOL_RULES) {
    for (const [marker, pattern] of markers) {
      if (!pattern.test(html)) continue;
      tools.add(tool);
      evidence.push({ tool, marker, confidence });
    }
  }

  const hreflangs = new Set(
    $('[hreflang]').map((_, element) => cleanText($(element).attr('hreflang')).toLowerCase()).get()
      .filter((value) => value && value !== 'x-default'),
  );
  if (hreflangs.size >= 2) {
    evidence.push({ tool: '', marker: `hreflang:${[...hreflangs].sort().join(',')}`, confidence: 90 });
  }

  const shopifyLanguages = new Set(
    $('form[action*="/localization"] [name="language_code"] option, localization-form [name="language_code"] option')
      .map((_, element) => cleanText($(element).attr('value')).toLowerCase()).get().filter(Boolean),
  );
  if (shopifyLanguages.size >= 2) {
    tools.add('Shopify native localisation');
    evidence.push({ tool: 'Shopify native localisation', marker: 'shopify-language-form', confidence: 95 });
  }

  const languageSwitcher = $('[class*="language-switcher" i], [id*="language-switcher" i], [class*="language-selector" i], [id*="language-selector" i], [class*="locale-switcher" i], [id*="locale-switcher" i]').length > 0;
  if (languageSwitcher) evidence.push({ tool: '', marker: 'language-switcher-dom', confidence: 70 });

  return {
    tools: [...tools].sort(),
    evidence: uniqueEvidence(evidence),
    hasHreflang: hreflangs.size >= 2,
    hasLanguageSwitcher: languageSwitcher,
  };
}

export function summariseLanguageTechnology(results, active) {
  if (!active) return { status: 'unknown', tools: [], evidence: [] };
  const tools = [...new Set(results.flatMap((result) => result.tools))].sort();
  const evidence = uniqueEvidence(results.flatMap((result) => result.evidence));
  const hasHreflang = results.some((result) => result.hasHreflang);
  const hasLanguageSwitcher = results.some((result) => result.hasLanguageSwitcher);
  if (tools.length) return { status: 'detected', tools, evidence };
  if (hasHreflang) return { status: 'detected', tools: ['Unidentified multilingual setup'], evidence };
  if (hasLanguageSwitcher || evidence.length) return { status: 'possible', tools: ['Unidentified multilingual setup'], evidence };
  return { status: 'not_detected', tools: [], evidence: [] };
}

function extractContacts($, sourceUrl, text) {
  const emails = new Set();
  const phones = new Set();
  const socials = new Map();
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href')?.trim() ?? '';
    if (/^mailto:/i.test(href)) {
      const email = decodeURIComponent(href.slice(7).split('?')[0]).trim().toLowerCase();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emails.add(email);
    } else if (/^tel:/i.test(href)) {
      const phone = decodeURIComponent(href.slice(4)).replace(/\s+/g, ' ').trim();
      if (phone.replace(/\D/g, '').length >= 7) phones.add(phone);
    } else {
      const url = safeUrl(href, sourceUrl);
      if (!url) return;
      const host = comparableHost(url.hostname);
      for (const [socialHost, network] of SOCIAL_HOSTS) {
        if (host === socialHost || host.endsWith(`.${socialHost}`)) socials.set(`${network}:${url.href}`, { network, url: url.href });
      }
    }
  });
  for (const match of text.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)) emails.add(match[0].toLowerCase());
  return { emails: [...emails].sort(), phones: [...phones].sort(), socials: [...socials.values()].sort((a, b) => a.url.localeCompare(b.url)) };
}

export function amountToMinor(raw) {
  let value = raw.replace(/\s/g, '');
  const lastComma = value.lastIndexOf(',');
  const lastDot = value.lastIndexOf('.');
  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? ',' : '.';
    const groupingSeparator = decimalSeparator === ',' ? '.' : ',';
    value = value.replaceAll(groupingSeparator, '');
    if (decimalSeparator === ',') value = value.replace(',', '.');
  } else if (lastComma !== -1) {
    const decimalDigits = value.length - lastComma - 1;
    value = decimalDigits <= 2
      ? `${value.slice(0, lastComma).replaceAll(',', '')}.${value.slice(lastComma + 1)}`
      : value.replaceAll(',', '');
  } else if (lastDot !== -1) {
    const decimalDigits = value.length - lastDot - 1;
    value = decimalDigits <= 2
      ? `${value.slice(0, lastDot).replaceAll('.', '')}.${value.slice(lastDot + 1)}`
      : value.replaceAll('.', '');
  }
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= 100_000_000 ? Math.round(amount * 100) : null;
}

function priceContext(text, index, length) {
  return cleanText(text.slice(Math.max(0, index - 70), Math.min(text.length, index + length + 70))).slice(0, 220);
}

function extractPrices(text, jsonLd, sourceUrl, pageKind) {
  const prices = new Map();
  const symbolCurrency = { '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY' };
  const symbolPattern = /([$€£¥])\s?([0-9]{1,8}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/g;
  for (const match of text.matchAll(symbolPattern)) {
    const amountMinor = amountToMinor(match[2]);
    if (amountMinor === null) continue;
    const currency = symbolCurrency[match[1]];
    const context = priceContext(text, match.index, match[0].length);
    prices.set(`${currency}:${amountMinor}:${context}`, { pageKind, currency, amountMinor, displayed: match[0], context, sourceUrl, evidenceMethod: 'visible-text' });
  }
  const codePattern = /\b(USD|EUR|GBP|CAD|AUD|NZD|CHF|SEK|NOK|DKK|JPY)\s?([0-9]{1,8}(?:[.,][0-9]{1,2})?)\b/g;
  for (const match of text.matchAll(codePattern)) {
    const amountMinor = amountToMinor(match[2]);
    if (amountMinor === null) continue;
    const context = priceContext(text, match.index, match[0].length);
    prices.set(`${match[1]}:${amountMinor}:${context}`, { pageKind, currency: match[1], amountMinor, displayed: match[0], context, sourceUrl, evidenceMethod: 'visible-text' });
  }
  for (const object of jsonLd) {
    const offers = Array.isArray(object.offers) ? object.offers : object.offers ? [object.offers] : [];
    for (const offer of offers) {
      if (!offer || typeof offer !== 'object' || offer.price === undefined || !offer.priceCurrency) continue;
      const amountMinor = amountToMinor(String(offer.price));
      if (amountMinor === null) continue;
      const currency = String(offer.priceCurrency).toUpperCase();
      const context = cleanText(object.name ?? offer.name ?? '').slice(0, 220);
      prices.set(`${currency}:${amountMinor}:${context}`, { pageKind, currency, amountMinor, displayed: `${currency} ${offer.price}`, context, sourceUrl, evidenceMethod: 'json-ld-offer' });
    }
  }
  return [...prices.values()];
}

function productsAndServices($, jsonLd) {
  const values = new Set();
  $('a[href], h1, h2, h3').each((_, element) => {
    const text = cleanText($(element).text());
    const href = ($(element).attr('href') ?? '').toLowerCase();
    if (text.length >= 3 && text.length <= 90 && /product|service|shop|store|menu|pricing|treatment|course|programme|program|collection|work/i.test(`${href} ${text}`)) values.add(text);
  });
  for (const object of jsonLd) {
    const types = Array.isArray(object['@type']) ? object['@type'] : [object['@type']];
    if (types.some((type) => ['Product', 'Service', 'Offer', 'Course'].includes(type)) && object.name) values.add(cleanText(object.name));
  }
  return [...values].filter(Boolean).sort().slice(0, 40);
}

export function extractPage(html, sourceUrl, pageKind = 'home') {
  const $ = cheerio.load(html);
  const title = cleanText($('title').first().text());
  const metaDescription = cleanText($('meta[name="description"]').attr('content'));
  const jsonLd = parseJsonLd($);
  const jsonDescription = cleanText(jsonLd.find((object) => object.description)?.description);
  const siteName = cleanText(jsonLd.find((object) => object.name)?.name || $('meta[property="og:site_name"]').attr('content'));
  const text = visibleText($);
  const paragraphs = meaningfulParagraphs($);
  const contact = extractContacts($, sourceUrl, text);
  const evidence = multilingualizerEvidence(html);
  const languageTechnology = detectLanguageTechnology(html);
  return {
    title,
    metaDescription,
    siteName,
    text,
    textExcerpt: text.slice(0, 12_000),
    paragraphs,
    whatTheyDo: cleanText(metaDescription || jsonDescription || paragraphs[0] || $('h1').first().text()).slice(0, 1200),
    platform: detectPlatform(html),
    multilingualizerEvidence: evidence,
    multilingualizerStatus: classifyMultilingualizerEvidence(evidence),
    languageTechnology,
    technologies: detectTechnologies(html, sourceUrl, pageKind),
    contact,
    prices: extractPrices(text, jsonLd, sourceUrl, pageKind),
    productsServices: productsAndServices($, jsonLd),
    htmlLanguage: cleanText($('html').attr('lang')).toLowerCase(),
  };
}

export function classifyMultilingualizerEvidence(evidence) {
  const directMarkers = new Set(['changeLanguageAndMove', 'multilingualizer-script', 'multilingualizer-host']);
  if (evidence.some((value) => directMarkers.has(value))) return 'detected';
  return evidence.length ? 'possible' : 'not_detected';
}

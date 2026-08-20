import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { openDatabase, transaction } from './lib/db.mjs';
import {
  classifyMultilingualizerEvidence,
  discoverPageUrl,
  extractPage,
  summariseLanguageTechnology,
} from './lib/extract.mjs';
import { fetchPage } from './lib/http.mjs';
import { classifySite, detectSiteState } from './lib/enrichment.mjs';
import { DATA_ROOT, HTML_ROOT } from './lib/paths.mjs';

function isoNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function parseArguments(argv) {
  const options = { limit: 100_000, workers: 2, delayMs: 500, rescrape: false, site: null, database: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--limit') options.limit = Number.parseInt(argv[++index], 10);
    else if (argument === '--workers') options.workers = Number.parseInt(argv[++index], 10);
    else if (argument === '--delay-ms') options.delayMs = Number.parseInt(argv[++index], 10);
    else if (argument === '--site') options.site = argv[++index].toLowerCase().replace(/^www\./, '');
    else if (argument === '--database') options.database = path.resolve(argv[++index]);
    else if (argument === '--rescrape') options.rescrape = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.limit) || options.limit < 1) throw new Error('--limit must be a positive integer');
  if (!Number.isInteger(options.workers) || options.workers < 1 || options.workers > 8) throw new Error('--workers must be between 1 and 8');
  if (!Number.isInteger(options.delayMs) || options.delayMs < 0) throw new Error('--delay-ms cannot be negative');
  return options;
}

function homepageCandidates(site) {
  const supplied = /^[a-z][a-z0-9+.-]*:\/\//i.test(site.supplied_url) ? site.supplied_url : `https://${site.supplied_url}`;
  let suppliedUrl;
  try {
    suppliedUrl = new URL(supplied);
  } catch {
    suppliedUrl = new URL(`https://${site.domain}`);
  }
  const hosts = [...new Set([suppliedUrl.hostname, site.domain, `www.${site.domain}`])];
  const values = [new URL('/', suppliedUrl).href];
  for (const protocol of ['https:', 'http:']) {
    for (const host of hosts) values.push(`${protocol}//${host}/`);
  }
  return [...new Set(values)];
}

async function fetchHomepage(site) {
  const errors = [];
  for (const url of homepageCandidates(site)) {
    try {
      const result = await fetchPage(url);
      if (result.status >= 200 && result.status < 500) return result;
      errors.push(`${url}: HTTP ${result.status}`);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  throw new Error(errors.join(' | ').slice(0, 4000));
}

function safeDirectoryName(domain) {
  return domain.replace(/[^a-z0-9.-]+/gi, '_');
}

function retainHtml(site, pageKind, html) {
  const directory = path.join(HTML_ROOT, safeDirectoryName(site.domain));
  fs.mkdirSync(directory, { recursive: true });
  const filename = `${pageKind}.html`;
  const absolute = path.join(directory, filename);
  fs.writeFileSync(absolute, html, 'utf8');
  return path.relative(DATA_ROOT, absolute);
}

function mergeUnique(values, identity = (value) => JSON.stringify(value)) {
  const unique = new Map();
  for (const value of values.flat()) unique.set(identity(value), value);
  return [...unique.values()];
}

function pageRecord(siteId, runId, pageKind, response, extracted, htmlPath) {
  return {
    siteId,
    runId,
    pageKind,
    requestedUrl: response.requestedUrl,
    finalUrl: response.finalUrl,
    status: response.status,
    contentType: response.contentType,
    bytes: response.bytes,
    responseMs: response.responseMs,
    fetchedAt: response.fetchedAt,
    title: extracted.title,
    textExcerpt: extracted.textExcerpt,
    htmlPath,
    sha256: crypto.createHash('sha256').update(response.body).digest('hex'),
    error: null,
  };
}

async function inspectSite(site, runId, delayMs) {
  const homeResponse = await fetchHomepage(site);
  const home = extractPage(homeResponse.body, homeResponse.finalUrl, 'home');
  const pages = [pageRecord(site.id, runId, 'home', homeResponse, home, retainHtml(site, 'home', homeResponse.body))];
  const aboutUrl = discoverPageUrl(homeResponse.body, homeResponse.finalUrl, 'about');
  const contactUrl = discoverPageUrl(homeResponse.body, homeResponse.finalUrl, 'contact');
  let about = null;
  if (aboutUrl && new URL(aboutUrl).href !== new URL(homeResponse.finalUrl).href) {
    await sleep(delayMs);
    try {
      const response = await fetchPage(aboutUrl);
      if (response.ok && response.contentType.toLowerCase().includes('html')) {
        about = extractPage(response.body, response.finalUrl, 'about');
        pages.push(pageRecord(site.id, runId, 'about', response, about, retainHtml(site, 'about', response.body)));
      }
    } catch {
      // A missing About page does not make an otherwise live site fail.
    }
  }
  const extractedPages = [home, ...(about ? [about] : [])];
  const evidence = mergeUnique(extractedPages.map((page) => page.multilingualizerEvidence));
  const active = Number(homeResponse.ok && homeResponse.contentType.toLowerCase().includes('html'));
  const languageTechnology = summariseLanguageTechnology(
    extractedPages.map((page) => page.languageTechnology),
    active === 1,
  );
  const contacts = [];
  for (const [index, page] of extractedPages.entries()) {
    const sourceUrl = pages[index].finalUrl;
    for (const email of page.contact.emails) contacts.push({ type: 'email', value: email, url: `mailto:${email}`, sourceUrl, confidence: 90 });
    for (const phone of page.contact.phones) contacts.push({ type: 'phone', value: phone, url: `tel:${phone}`, sourceUrl, confidence: 90 });
    for (const social of page.contact.socials) contacts.push({ type: social.network, value: social.url, url: social.url, sourceUrl, confidence: 90 });
  }
  const prices = mergeUnique(extractedPages.map((page) => page.prices), (price) => `${price.pageKind}:${price.currency}:${price.amountMinor}:${price.context}:${price.sourceUrl}`);
  const productsServices = mergeUnique(extractedPages.map((page) => page.productsServices));
  const technologies = mergeUnique(
    extractedPages.map((page) => page.technologies),
    (value) => `${value.name}:${value.host}:${value.evidenceType}:${value.evidenceValue}:${value.sourceUrl}`,
  );
  const currencies = [...new Set(prices.map(({ currency }) => currency))].sort();
  const amounts = prices.map(({ amountMinor }) => amountMinor);
  const siteState = detectSiteState({
    html: homeResponse.body,
    finalUrl: homeResponse.finalUrl,
    technologies,
  });
  const classification = classifySite({
    title: home.title,
    metaDescription: home.metaDescription,
    siteName: home.siteName,
    whatTheyDo: home.whatTheyDo || about?.whatTheyDo || '',
    aboutText: about ? (about.paragraphs.join('\n\n') || about.textExcerpt).slice(0, 12_000) : '',
    productsServices,
    technologies,
    detectedPlatform: home.platform || about?.platform || '',
    siteState: siteState.state,
  });
  return {
    summary: {
      active,
      homepageStatus: homeResponse.status,
      finalHomepageUrl: homeResponse.finalUrl,
      detectedPlatform: home.platform || about?.platform || '',
      multilingualizerStatus: classifyMultilingualizerEvidence(evidence),
      multilingualizerEvidence: evidence,
      multilingualStatus: languageTechnology.status,
      multilingualTools: languageTechnology.tools,
      multilingualEvidence: languageTechnology.evidence,
      title: home.title,
      metaDescription: home.metaDescription,
      siteName: home.siteName,
      whatTheyDo: home.whatTheyDo || about?.whatTheyDo || '',
      aboutUrl: pages.find(({ pageKind }) => pageKind === 'about')?.finalUrl ?? aboutUrl,
      aboutTitle: about?.title ?? '',
      aboutText: about ? (about.paragraphs.join('\n\n') || about.textExcerpt).slice(0, 12_000) : '',
      contactUrl,
      emails: contacts.filter(({ type }) => type === 'email').map(({ value }) => value).filter((value, index, values) => values.indexOf(value) === index),
      phones: contacts.filter(({ type }) => type === 'phone').map(({ value }) => value).filter((value, index, values) => values.indexOf(value) === index),
      socials: contacts.filter(({ type }) => !['email', 'phone'].includes(type)).map(({ type: network, value: url }) => ({ network, url })).filter((value, index, values) => values.findIndex((other) => other.url === value.url) === index),
      currencies,
      minPriceMinor: amounts.length ? Math.min(...amounts) : null,
      maxPriceMinor: amounts.length ? Math.max(...amounts) : null,
      visiblePriceCount: prices.length,
      productsServices,
      siteState: siteState.state,
      parkedProvider: siteState.provider,
      sector: classification.sector,
      businessModel: classification.businessModel,
      consentUseCase: classification.consentUseCase,
      peerGroup: classification.peerGroup,
      classificationConfidence: classification.confidence,
      classificationEvidence: [...siteState.evidence, ...classification.evidence],
      lastCrawledAt: isoNow(),
      crawlError: null,
    },
    pages,
    contacts,
    prices,
    technologies: technologies.map((technology) => ({
      ...technology,
      attributedToCustomer: siteState.state === 'parked' ? 0 : 1,
    })),
    signals: [
      ...(home.htmlLanguage ? [{ type: 'html_language', value: home.htmlLanguage, sourceUrl: homeResponse.finalUrl, confidence: 90, method: 'html-lang' }] : []),
      ...evidence.map((value) => ({ type: 'multilingualizer_marker', value, sourceUrl: homeResponse.finalUrl, confidence: value === 'multilingualizer-name' ? 60 : 95, method: 'html-source' })),
      ...languageTechnology.evidence.map(({ tool, marker, confidence }) => ({ type: 'language_tool', value: `${tool || 'Unidentified'}: ${marker}`, sourceUrl: homeResponse.finalUrl, confidence, method: 'retained-html-marker' })),
      ...(home.platform ? [{ type: 'platform', value: home.platform, sourceUrl: homeResponse.finalUrl, confidence: 95, method: 'html-marker' }] : []),
    ],
  };
}

export function saveResult(database, site, result) {
  const summary = result.summary;
  transaction(database, () => {
    database.prepare(`UPDATE sites SET
      active=?, homepage_status=?, final_homepage_url=?, detected_platform=?,
      multilingualizer_status=?, multilingualizer_evidence_json=?, multilingual_status=?,
      multilingual_tools_json=?, multilingual_evidence_json=?, title=?,
      meta_description=?, site_name=?, what_they_do=?, about_url=?, about_title=?,
      about_text=?, contact_url=?, emails_json=?, phones_json=?, social_profiles_json=?,
      currencies_json=?, min_price_minor=?, max_price_minor=?, visible_price_count=?,
      products_services_json=?, site_state=?, parked_provider=?, sector=?, business_model=?,
      consent_use_case=?, peer_group=?, classification_confidence=?, classification_evidence_json=?,
      last_crawled_at=?, crawl_error=? WHERE id=?`).run(
      summary.active, summary.homepageStatus, summary.finalHomepageUrl, summary.detectedPlatform,
      summary.multilingualizerStatus, JSON.stringify(summary.multilingualizerEvidence), summary.multilingualStatus,
      JSON.stringify(summary.multilingualTools), JSON.stringify(summary.multilingualEvidence), summary.title,
      summary.metaDescription, summary.siteName, summary.whatTheyDo, summary.aboutUrl, summary.aboutTitle,
      summary.aboutText, summary.contactUrl, JSON.stringify(summary.emails), JSON.stringify(summary.phones),
      JSON.stringify(summary.socials), JSON.stringify(summary.currencies), summary.minPriceMinor,
      summary.maxPriceMinor, summary.visiblePriceCount, JSON.stringify(summary.productsServices),
      summary.siteState, summary.parkedProvider, summary.sector, summary.businessModel,
      summary.consentUseCase, summary.peerGroup, summary.classificationConfidence,
      JSON.stringify(summary.classificationEvidence),
      summary.lastCrawledAt, summary.crawlError, site.id,
    );
    for (const table of ['contacts', 'prices', 'signals']) database.prepare(`DELETE FROM ${table} WHERE site_id=?`).run(site.id);
    database.prepare('DELETE FROM site_technologies WHERE site_id=?').run(site.id);
    const insertPage = database.prepare(`INSERT INTO pages (
      site_id,crawl_run_id,page_kind,requested_url,final_url,http_status,content_type,
      response_bytes,response_ms,fetched_at,title,text_excerpt,html_path,content_sha256,error
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    for (const page of result.pages) insertPage.run(page.siteId, page.runId, page.pageKind, page.requestedUrl, page.finalUrl, page.status, page.contentType, page.bytes, page.responseMs, page.fetchedAt, page.title, page.textExcerpt, page.htmlPath, page.sha256, page.error);
    const insertContact = database.prepare('INSERT OR IGNORE INTO contacts (site_id,contact_type,value,url,source_url,confidence) VALUES (?,?,?,?,?,?)');
    for (const contact of result.contacts) insertContact.run(site.id, contact.type, contact.value, contact.url, contact.sourceUrl, contact.confidence);
    const insertPrice = database.prepare('INSERT OR IGNORE INTO prices (site_id,page_kind,currency,amount_minor,displayed,context,source_url,evidence_method) VALUES (?,?,?,?,?,?,?,?)');
    for (const price of result.prices) insertPrice.run(site.id, price.pageKind, price.currency, price.amountMinor, price.displayed, price.context, price.sourceUrl, price.evidenceMethod);
    const insertSignal = database.prepare('INSERT OR IGNORE INTO signals (site_id,signal_type,value,source_url,confidence,evidence_method) VALUES (?,?,?,?,?,?)');
    for (const signal of result.signals) insertSignal.run(site.id, signal.type, signal.value, signal.sourceUrl, signal.confidence, signal.method);
    const insertTechnology = database.prepare('INSERT OR IGNORE INTO site_technologies (site_id,name,category,host,evidence_type,evidence_value,source_url,page_kind,confidence,attributed_to_customer) VALUES (?,?,?,?,?,?,?,?,?,?)');
    for (const technology of result.technologies) insertTechnology.run(site.id, technology.name, technology.category, technology.host, technology.evidenceType, technology.evidenceValue, technology.sourceUrl, technology.pageKind, technology.confidence, technology.attributedToCustomer);
  });
}

async function run() {
  const options = parseArguments(process.argv.slice(2));
  fs.mkdirSync(HTML_ROOT, { recursive: true });
  const database = openDatabase(options.database ?? undefined);
  const conditions = [];
  const parameters = [];
  if (!options.rescrape) conditions.push('s.last_crawled_at IS NULL');
  if (options.site) { conditions.push('s.domain=?'); parameters.push(options.site); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sites = database.prepare(`SELECT s.* FROM sites s ${where} ORDER BY s.domain, s.id LIMIT ?`).all(...parameters, options.limit);
  const startedAt = isoNow();
  const run = database.prepare('INSERT INTO crawl_runs (started_at,requested_sites,options_json) VALUES (?,?,?)').run(startedAt, sites.length, JSON.stringify(options));
  const runId = Number(run.lastInsertRowid);
  let nextIndex = 0;
  let completed = 0;
  let failed = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;
      if (index >= sites.length) return;
      const site = sites[index];
      try {
        const result = await inspectSite(site, runId, options.delayMs);
        saveResult(database, site, result);
        completed += 1;
        console.log(`[${completed + failed}/${sites.length}] ${site.domain}: ${result.summary.homepageStatus}, ${result.summary.detectedPlatform || 'unknown platform'}, Multilingualizer ${result.summary.multilingualizerStatus}`);
      } catch (error) {
        failed += 1;
        database.prepare('UPDATE sites SET active=0,last_crawled_at=?,crawl_error=? WHERE id=?').run(isoNow(), String(error.message).slice(0, 4000), site.id);
        console.log(`[${completed + failed}/${sites.length}] ${site.domain}: failed: ${error.message}`);
      }
      await sleep(options.delayMs);
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(options.workers, sites.length || 1) }, () => worker()));
  } finally {
    database.prepare('UPDATE crawl_runs SET finished_at=?,completed_sites=?,failed_sites=? WHERE id=?').run(isoNow(), completed, failed, runId);
    database.close();
  }
  console.log(`Finished crawl ${runId}: ${completed} completed, ${failed} failed. Data: ${DATA_ROOT}`);
}

if (import.meta.url === `file://${process.argv[1]}`) run().catch((error) => { console.error(error); process.exitCode = 1; });

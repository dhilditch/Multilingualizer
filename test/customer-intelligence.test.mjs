import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { openDatabase } from '../customer-intelligence/lib/db.mjs';
import { classifySite, detectSiteState } from '../customer-intelligence/lib/enrichment.mjs';
import { classifyMultilingualizerEvidence, discoverPageUrl, extractPage } from '../customer-intelligence/lib/extract.mjs';
import { parsePhpSerialized } from '../customer-intelligence/lib/php-serialize.mjs';
import { importSqlResult, normaliseDomain } from '../customer-intelligence/import-clients.mjs';
import { saveResult } from '../customer-intelligence/crawl.mjs';

test('parses the Multilingualizer PHP-serialized installation shape', () => {
  const serialized = 'a:1:{i:0;a:3:{s:3:"url";s:19:"www.example-one.com";s:8:"platform";s:11:"Squarespace";s:9:"languages";a:2:{i:0;s:2:"en";i:1;s:2:"fr";}}}';
  assert.deepEqual(parsePhpSerialized(serialized), [{
    url: 'www.example-one.com',
    platform: 'Squarespace',
    languages: ['en', 'fr'],
  }]);
});

test('normalises supplied installation URLs without inferring email domains', () => {
  assert.equal(normaliseDomain('https://www.Example.com/a-page/'), 'example.com');
  assert.throws(() => normaliseDomain('localhost'));
  assert.throws(() => normaliseDomain('ftp://example.com'));
});

test('imports private SQL result rows into a separate SQLite database', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'multilingualizer-clients-'));
  const database = openDatabase(path.join(temporary, 'test.sqlite3'));
  const serialized = 'a:1:{i:0;a:3:{s:3:"url";s:19:"www.example-one.com";s:8:"platform";s:11:"Squarespace";s:9:"languages";a:2:{i:0;s:2:"en";i:1;s:2:"fr";}}}';
  const columns = [
    'wordpress_user_id', 'customer_name', 'email', 'company', 'country',
    'paid_order_count', 'paid_totals', 'first_paid_order_at', 'last_paid_order_at',
    'products', 'websites_length', 'websites_part_1', 'websites_part_2',
  ];
  const payload = { columns, rows: [[
    '42', 'Private Client', 'private@example.invalid', 'Private Company', 'GB',
    '2', 'EUR:99.00|GBP:20.00', '2020-01-01 10:00:00', '2021-01-01 10:00:00',
    'Multilingualizer', String(Buffer.byteLength(serialized)), serialized, '',
  ]] };
  try {
    assert.deepEqual(importSqlResult(database, payload), { clients: 1, installations: 1 });
    const client = database.prepare('SELECT * FROM clients').get();
    const site = database.prepare('SELECT * FROM sites').get();
    assert.equal(client.wordpress_user_id, 42);
    assert.deepEqual(JSON.parse(client.paid_totals_json), { EUR: 9900, GBP: 2000 });
    assert.equal(site.domain, 'example-one.com');
    assert.equal(site.registered_platform, 'Squarespace');
    assert.deepEqual(JSON.parse(site.registered_languages_json), ['en', 'fr']);
  } finally {
    database.close();
  }
});

test('extracts platform, Multilingualizer, contact, price and activity evidence', () => {
  const html = `<!doctype html><html lang="fr"><head><title>Acme Studio</title>
    <meta name="description" content="Independent architectural design studio in Montreal">
    <link rel="alternate" hreflang="en" href="https://acme.example/en"><link rel="alternate" hreflang="fr" href="https://acme.example/fr">
    <script>window.Static = {SQUARESPACE_CONTEXT:{}}; function changeLanguageAndMove(language){return language}</script>
    <script src="https://cdn.weglot.com/weglot.min.js"></script>
    <script src="https://js.hs-scripts.com/123.js"></script>
    <script src="https://widgets.example.invalid/app.js"></script>
    </head><body><nav><a href="/about-us">About us</a><a href="/contact">Contact</a></nav>
    <main><h1>Architectural services</h1><p>We design sustainable homes and commercial spaces for clients across Quebec.</p>
    <a href="mailto:hello@acme.example">Email</a><a href="https://instagram.com/acme">Instagram</a>
    <h2>Design services from €1,250.00</h2></main></body></html>`;
  const result = extractPage(html, 'https://acme.example/', 'home');
  assert.equal(result.platform, 'Squarespace');
  assert.equal(result.multilingualizerStatus, 'detected');
  assert.ok(result.multilingualizerEvidence.includes('changeLanguageAndMove'));
  assert.equal(classifyMultilingualizerEvidence(result.multilingualizerEvidence), 'detected');
  assert.equal(classifyMultilingualizerEvidence(['multilingualizer-name']), 'possible');
  assert.equal(classifyMultilingualizerEvidence([]), 'not_detected');
  assert.deepEqual(result.languageTechnology.tools, ['Multilingualizer', 'Weglot']);
  assert.ok(result.languageTechnology.hasHreflang);
  assert.ok(result.technologies.some(({ name }) => name === 'Weglot'));
  assert.ok(result.technologies.some(({ name }) => name === 'HubSpot'));
  assert.ok(result.technologies.some(({ name, category }) => name === 'widgets.example.invalid' && category === 'Unclassified third-party'));
  assert.deepEqual(result.contact.emails, ['hello@acme.example']);
  assert.equal(result.contact.socials[0].network, 'instagram');
  assert.equal(result.prices[0].currency, 'EUR');
  assert.equal(result.prices[0].amountMinor, 125000);
  assert.match(result.whatTheyDo, /architectural design studio/i);
  assert.equal(discoverPageUrl(html, 'https://acme.example/', 'about'), 'https://acme.example/about-us');
  assert.equal(discoverPageUrl(html, 'https://acme.example/', 'contact'), 'https://acme.example/contact');

  const formattedPrices = extractPage('<body>$1,234 €1.234,56</body>', 'https://acme.example/').prices;
  assert.deepEqual(formattedPrices.map(({ currency, amountMinor }) => [currency, amountMinor]), [
    ['USD', 123400],
    ['EUR', 123456],
  ]);
});

test('classifies customer sites into deterministic sectors and peer groups', () => {
  const classification = classifySite({
    title: 'Nordic Event Studio',
    metaDescription: 'A full-service event agency producing conferences, exhibitions and corporate experiences.',
    whatTheyDo: 'Event management for international clients.',
    technologies: [
      { name: 'Google Analytics', category: 'Analytics/tag management' },
      { name: 'Meta Pixel/Facebook SDK', category: 'Advertising/social' },
      { name: 'YouTube', category: 'Media/embed' },
    ],
    detectedPlatform: 'Squarespace',
  });
  assert.equal(classification.sector, 'Events and experiences');
  assert.equal(classification.businessModel, 'Agency or consultancy');
  assert.equal(classification.peerGroup, 'Events and experiences · Agency or consultancy');
  assert.equal(classification.consentUseCase, 'advertising pixels, analytics, embedded media');
  assert.ok(classification.confidence >= 75);
});

test('marks parking-provider technology as not belonging to the customer business', () => {
  const state = detectSiteState({
    html: '<title>Example is for sale</title><p>Buy this domain</p>',
    finalUrl: 'https://example.invalid/',
    technologies: [{ name: 'HugeDomains', category: 'Domain parking' }],
  });
  assert.deepEqual(state, {
    state: 'parked',
    provider: 'HugeDomains',
    evidence: ['technology:HugeDomains'],
  });
  assert.equal(classifySite({ siteState: 'parked' }).peerGroup, 'Parked domain');
  assert.equal(detectSiteState({
    html: '<title>Expired domain listing</title>',
    finalUrl: 'https://expireddomains.com/domain/example.com',
  }).provider, 'ExpiredDomains.com');
});

test('persists enrichment and customer-attribution fields from a fresh crawl', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'multilingualizer-crawl-save-'));
  const database = openDatabase(path.join(temporary, 'test.sqlite3'));
  const client = database.prepare("INSERT INTO clients (source_key,imported_at) VALUES ('test-customer','2026-08-21T00:00:00Z')").run();
  const inserted = database.prepare("INSERT INTO sites (client_id,domain,supplied_url) VALUES (?,'example.test','https://example.test')").run(client.lastInsertRowid);
  const site = { id: Number(inserted.lastInsertRowid) };
  try {
    saveResult(database, site, {
      summary: {
        active: 1, homepageStatus: 200, finalHomepageUrl: 'https://example.test/', detectedPlatform: 'Squarespace',
        multilingualizerStatus: 'detected', multilingualizerEvidence: ['changeLanguageAndMove'], multilingualStatus: 'detected',
        multilingualTools: ['Multilingualizer'], multilingualEvidence: [], title: 'Example', metaDescription: '', siteName: 'Example',
        whatTheyDo: 'An event agency.', aboutUrl: null, aboutTitle: '', aboutText: '', contactUrl: null,
        emails: [], phones: [], socials: [], currencies: [], minPriceMinor: null, maxPriceMinor: null,
        visiblePriceCount: 0, productsServices: [], siteState: 'customer_site', parkedProvider: '',
        sector: 'Events and experiences', businessModel: 'Agency or consultancy',
        consentUseCase: 'analytics', peerGroup: 'Events and experiences · Agency or consultancy',
        classificationConfidence: 90, classificationEvidence: ['sector:event'],
        lastCrawledAt: '2026-08-21T00:00:00Z', crawlError: null,
      },
      pages: [], contacts: [], prices: [], signals: [],
      technologies: [{
        name: 'Google Analytics', category: 'Analytics/tag management', host: 'googletagmanager.com',
        evidenceType: 'external-script', evidenceValue: 'https://googletagmanager.com/gtag/js',
        sourceUrl: 'https://example.test/', pageKind: 'home', confidence: 98, attributedToCustomer: 1,
      }],
    });
    const stored = database.prepare('SELECT site_state,sector,business_model,peer_group FROM sites WHERE id=?').get(site.id);
    assert.equal(stored.site_state, 'customer_site');
    assert.equal(stored.sector, 'Events and experiences');
    assert.equal(stored.business_model, 'Agency or consultancy');
    assert.equal(stored.peer_group, 'Events and experiences · Agency or consultancy');
    assert.equal(database.prepare('SELECT attributed_to_customer FROM site_technologies WHERE site_id=?').get(site.id).attributed_to_customer, 1);
  } finally {
    database.close();
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseHtml, calculateWeglotPrice, countWords } from '../scripts/lib/audit.mjs';
import { isPublicIp, normaliseWebsiteUrl } from '../scripts/lib/safe-crawl.mjs';

const pricing = {
  currency: 'EUR',
  checkedAt: '2026-08-20',
  source: 'https://example.com/pricing',
  plans: [
    { name: 'Free', translatedWords: 2000, languages: 1, monthly: 0, annual: 0 },
    { name: 'Starter', translatedWords: 10000, languages: 1, monthly: 15, annual: 150 },
    { name: 'Business', translatedWords: 50000, languages: 3, monthly: 29, annual: 290 }
  ]
};

test('countWords handles punctuation and Unicode text', () => {
  assert.equal(countWords("It's a multilingual café website."), 5);
  assert.equal(countWords('Γεια σου κόσμε'), 3);
  assert.equal(countWords(''), 0);
});

test('calculateWeglotPrice multiplies source words by destination languages', () => {
  const result = calculateWeglotPrice(6000, 2, pricing);
  assert.equal(result.translatedWords, 12000);
  assert.equal(result.plan.name, 'Business');
  assert.equal(result.plan.price, 29);
});

test('calculateWeglotPrice respects both word and language limits', () => {
  assert.equal(calculateWeglotPrice(1000, 2, pricing).plan.name, 'Business');
  assert.equal(calculateWeglotPrice(30000, 2, pricing).plan, null);
});

test('analyseHtml counts visible and metadata words and extracts safe signals', () => {
  const result = analyseHtml(`<!doctype html><html lang="en"><head><title>Example Shop</title><meta name="description" content="A useful shop"></head><body><main><h1>Hello world</h1><p>Prices from €20 today.</p><a href="mailto:hello@example.com">Email</a><img src="/missing.jpg" alt="Blue product"></main></body></html>`, 'https://example.com/');
  assert.equal(result.lang, 'en');
  assert.equal(result.h1Count, 1);
  assert.equal(result.contactSignals.emailCount, 1);
  assert.equal(result.hasCurrencySignals, true);
  assert.equal(result.images[0], 'https://example.com/missing.jpg');
  assert.ok(result.estimatedSourceWords > result.visibleWords);
});

test('normaliseWebsiteUrl allows public web URLs but not embedded credentials', () => {
  assert.equal(normaliseWebsiteUrl('example.com/path').href, 'https://example.com/path');
  assert.throws(() => normaliseWebsiteUrl('https://user:pass@example.com'), /credentials/);
  assert.throws(() => normaliseWebsiteUrl('file:///etc/passwd'), /Only HTTP/);
});

test('isPublicIp blocks private, loopback, link-local and documentation ranges', () => {
  for (const address of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.1.1', '203.0.113.10', '::1', 'fd00::1', '2001:db8::1']) {
    assert.equal(isPublicIp(address), false, address);
  }
  assert.equal(isPublicIp('8.8.8.8'), true);
  assert.equal(isPublicIp('2606:4700:4700::1111'), true);
});

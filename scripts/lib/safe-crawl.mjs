import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { analyseHtml, buildTips } from './audit.mjs';

const USER_AGENT = 'MultilingualizerSiteAudit/0.1 (+https://www.multilingualizer.com/)';
const DEFAULT_LIMITS = {
  maxPages: 25,
  maxPageBytes: 2_000_000,
  maxAssetChecks: 50,
  timeoutMs: 10_000,
  redirects: 5,
  delayMs: 150
};

export function normaliseWebsiteUrl(value) {
  let input = String(value || '').trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(input) && !/^https?:\/\//i.test(input)) {
    throw new Error('Only HTTP and HTTPS websites can be audited');
  }
  if (!/^https?:\/\//i.test(input)) input = `https://${input}`;
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS websites can be audited');
  if (url.username || url.password) throw new Error('Website URLs cannot contain credentials');
  url.hash = '';
  return url;
}

function ipv4Parts(address) {
  return address.split('.').map(Number);
}

export function isPublicIp(address) {
  if (net.isIPv4(address)) {
    const [a, b, c] = ipv4Parts(address);
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return false;
    if (a === 198 && (b === 18 || b === 19)) return false;
    if (a === 198 && b === 51 && c === 100) return false;
    if (a === 203 && b === 0 && c === 113) return false;
    return true;
  }
  if (net.isIPv6(address)) {
    const value = address.toLowerCase();
    if (value === '::' || value === '::1') return false;
    if (value.startsWith('fc') || value.startsWith('fd') || /^fe[89ab]/.test(value)) return false;
    if (value.startsWith('::ffff:')) return isPublicIp(value.slice(7));
    return !value.startsWith('2001:db8:');
  }
  return false;
}

async function publicAddress(hostname) {
  if (net.isIP(hostname)) {
    if (!isPublicIp(hostname)) throw new Error('Private and reserved network addresses cannot be audited');
    return { address: hostname, family: net.isIPv4(hostname) ? 4 : 6 };
  }
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new Error('The website resolves to a private or reserved network address');
  }
  return addresses[0];
}

function equivalentHost(a, b) {
  const strip = (host) => host.toLowerCase().replace(/^www\./, '');
  return strip(a) === strip(b);
}

async function requestOnce(url, { method = 'GET', maxBytes, timeoutMs }) {
  const pinned = await publicAddress(url.hostname);
  const transport = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const request = transport.request(url, {
      method,
      headers: {
        'user-agent': USER_AGENT,
        accept: method === 'HEAD' ? '*/*' : 'text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5,*/*;q=0.1'
      },
      servername: url.hostname,
      lookup: (_hostname, lookupOptions, callback) => {
        if (typeof lookupOptions === 'function') return lookupOptions(null, pinned.address, pinned.family);
        if (lookupOptions?.all) return callback(null, [pinned]);
        return callback(null, pinned.address, pinned.family);
      }
    }, (response) => {
      const chunks = [];
      let bytes = 0;
      response.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > maxBytes) {
          request.destroy(new Error(`Response exceeded the ${maxBytes} byte limit`));
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => resolve({
        status: response.statusCode || 0,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8')
      }));
    });
    request.setTimeout(timeoutMs, () => request.destroy(new Error('Website request timed out')));
    request.on('error', reject);
    request.end();
  });
}

export async function safeFetch(input, options = {}) {
  const limits = { ...DEFAULT_LIMITS, ...options };
  const original = normaliseWebsiteUrl(input);
  let current = original;
  for (let index = 0; index <= limits.redirects; index++) {
    const response = await requestOnce(current, limits);
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      if (index === limits.redirects) throw new Error('The website redirected too many times');
      const next = new URL(response.headers.location, current);
      if (!['http:', 'https:'].includes(next.protocol) || !equivalentHost(original.hostname, next.hostname)) {
        throw new Error('The website redirected to a different host');
      }
      current = next;
      continue;
    }
    return { ...response, url: current.href };
  }
  throw new Error('The website could not be fetched');
}

function robotsRules(text) {
  const disallow = [];
  let applies = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    const [field, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (field?.trim().toLowerCase() === 'user-agent') applies = value === '*';
    if (applies && field?.trim().toLowerCase() === 'disallow' && value) disallow.push(value);
  }
  return disallow;
}

function allowedByRobots(url, disallow) {
  return !disallow.some((path) => url.pathname.startsWith(path));
}

function pageCandidate(url, siteHost) {
  return equivalentHost(url.hostname, siteHost)
    && ['http:', 'https:'].includes(url.protocol)
    && !/\.(?:avif|css|gif|ico|jpe?g|js|json|mp3|mp4|pdf|png|svg|webp|xml|zip)$/i.test(url.pathname);
}

function publicPage(page) {
  const { links, images, ...summary } = page;
  return { ...summary, linkCount: links.length, imageCount: images.length };
}

export async function auditHomepage(input, options = {}) {
  const start = normaliseWebsiteUrl(input);
  const response = await safeFetch(start, options);
  if (response.status < 200 || response.status >= 400) throw new Error(`Homepage returned HTTP ${response.status}`);
  if (!String(response.headers['content-type'] || '').includes('text/html')) throw new Error('The URL did not return an HTML page');
  return { status: response.status, ...publicPage(analyseHtml(response.body, response.url)) };
}

export async function crawlWebsite(input, options = {}) {
  const limits = { ...DEFAULT_LIMITS, ...options };
  const start = normaliseWebsiteUrl(input);
  let disallow = [];
  try {
    const robots = await safeFetch(new URL('/robots.txt', start), { ...limits, maxBytes: 250_000 });
    if (robots.status === 200) disallow = robotsRules(robots.body);
  } catch {
    // A missing or unreachable robots.txt does not prevent a bounded audit requested by the site owner.
  }

  const pending = [start.href];
  const seen = new Set();
  const pages = [];
  const failures = [];
  const images = new Set();
  while (pending.length && pages.length < limits.maxPages) {
    const requested = pending.shift();
    if (seen.has(requested)) continue;
    seen.add(requested);
    const pageUrl = new URL(requested);
    if (!allowedByRobots(pageUrl, disallow)) continue;
    try {
      const response = await safeFetch(pageUrl, limits);
      if (response.status < 200 || response.status >= 400) {
        failures.push({ url: requested, status: response.status });
        continue;
      }
      if (!String(response.headers['content-type'] || '').includes('text/html')) continue;
      const page = analyseHtml(response.body, response.url);
      pages.push(page);
      for (const image of page.images) images.add(image);
      for (const link of page.links) {
        try {
          const candidate = new URL(link);
          candidate.hash = '';
          if (pageCandidate(candidate, start.hostname) && !seen.has(candidate.href)) pending.push(candidate.href);
        } catch { /* Ignore malformed links. */ }
      }
      if (limits.delayMs) await new Promise((resolve) => setTimeout(resolve, limits.delayMs));
    } catch (error) {
      failures.push({ url: requested, status: 0, error: error.message });
    }
  }

  const brokenImages = [];
  for (const image of [...images].slice(0, limits.maxAssetChecks)) {
    try {
      const response = await safeFetch(image, { ...limits, method: 'HEAD', maxBytes: 1 });
      if (response.status >= 400) brokenImages.push({ url: image, status: response.status });
    } catch (error) {
      brokenImages.push({ url: image, status: 0, error: error.message });
    }
  }

  const sourceWords = pages.reduce((total, page) => total + page.estimatedSourceWords, 0);
  const summaries = pages.map(publicPage);
  return {
    requestedUrl: start.href,
    completedAt: new Date().toISOString(),
    limits: { maxPages: limits.maxPages, maxAssetChecks: limits.maxAssetChecks },
    truncated: pending.length > 0,
    sourceWords,
    pages: summaries,
    sitemap: summaries.map((page) => page.url),
    brokenLinks: failures,
    brokenImages,
    tips: buildTips(summaries, failures, brokenImages)
  };
}

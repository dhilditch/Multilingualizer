import dns from 'node:dns/promises';
import net from 'node:net';

const USER_AGENT = 'Mozilla/5.0 (compatible; MultilingualizerCustomerResearch/1.0; +https://www.multilingualizer.com/)';
const MAX_REDIRECTS = 5;

function isPublicIp(address) {
  if (net.isIPv4(address)) {
    const octets = address.split('.').map(Number);
    if (octets[0] === 10 || octets[0] === 127 || octets[0] === 0) return false;
    if (octets[0] === 169 && octets[1] === 254) return false;
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return false;
    if (octets[0] === 192 && octets[1] === 168) return false;
    if (octets[0] >= 224) return false;
    return true;
  }
  if (net.isIPv6(address)) {
    const clean = address.toLowerCase();
    return !(clean === '::1' || clean === '::' || clean.startsWith('fc') || clean.startsWith('fd') || clean.startsWith('fe8') || clean.startsWith('fe9') || clean.startsWith('fea') || clean.startsWith('feb'));
  }
  return false;
}
export async function validatePublicUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported URL scheme: ${url.protocol}`);
  if (url.username || url.password) throw new Error('Credentials in URLs are not allowed');
  const addresses = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new Error(`Refusing non-public address for ${url.hostname}`);
  }
  return url;
}

export async function fetchPage(value, options = {}) {
  const timeoutMs = options.timeoutMs ?? 12_000;
  const maxBytes = options.maxBytes ?? 2 * 1024 * 1024;
  let url = new URL(value);
  const started = performance.now();
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await validatePublicUrl(url);
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.7',
        'accept-language': 'en-GB,en;q=0.8',
      },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new Error(`HTTP ${response.status} without Location`);
      url = new URL(location, url);
      continue;
    }
    const reader = response.body?.getReader();
    const chunks = [];
    let total = 0;
    let truncated = false;
    if (reader) {
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const remaining = maxBytes - total;
        if (chunk.byteLength > remaining) {
          if (remaining > 0) chunks.push(chunk.slice(0, remaining));
          truncated = true;
          await reader.cancel();
          break;
        }
        chunks.push(chunk);
        total += chunk.byteLength;
      }
    }
    const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString('utf8');
    return {
      requestedUrl: value,
      finalUrl: url.href,
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get('content-type') ?? '',
      body,
      bytes: Buffer.byteLength(body),
      truncated,
      responseMs: Math.round(performance.now() - started),
      fetchedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
  }
  throw new Error(`Too many redirects for ${value}`);
}

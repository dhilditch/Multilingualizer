import 'dotenv/config';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateWeglotPrice, countWords, readWeglotPricing } from '../scripts/lib/audit.mjs';
import { createAuditJob, publicJob, readAuditJob } from '../scripts/lib/audit-store.mjs';
import { auditHomepage, normaliseWebsiteUrl } from '../scripts/lib/safe-crawl.mjs';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const pricing = await readWeglotPricing();
const port = Number(process.env.AUDIT_PORT || 4173);
const requests = new Map();

function json(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(value));
}

function securityHeaders(response) {
  response.setHeader('x-content-type-options', 'nosniff');
  response.setHeader('referrer-policy', 'same-origin');
  response.setHeader('content-security-policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:");
  response.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=()');
}

async function body(request, maxBytes = 1_000_000) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > maxBytes) throw new Error('Request body is too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function rateLimited(request, limit = 12) {
  const key = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (requests.get(key) || []).filter((stamp) => now - stamp < 60_000);
  recent.push(now);
  requests.set(key, recent);
  return recent.length > limit;
}

function emailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '')) && String(value).length <= 254;
}

async function serveStatic(requestPath, response) {
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
  const file = path.resolve(publicDir, relative);
  if (!file.startsWith(`${publicDir}${path.sep}`) && file !== path.join(publicDir, 'index.html')) return false;
  try {
    const content = await fs.readFile(file);
    const type = file.endsWith('.html') ? 'text/html; charset=utf-8'
      : file.endsWith('.css') ? 'text/css; charset=utf-8'
        : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'application/octet-stream';
    response.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
    response.end(content);
    return true;
  } catch { return false; }
}

const server = http.createServer(async (request, response) => {
  securityHeaders(response);
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  try {
    if (request.method === 'GET' && url.pathname === '/api/pricing') return json(response, 200, pricing);
    if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
      if (rateLimited(request)) return json(response, 429, { error: 'Too many requests. Please wait a minute and try again.' });
      const input = await body(request);
      if (url.pathname === '/api/calculate') {
        const words = input.text == null ? Number(input.words) : countWords(input.text);
        return json(response, 200, calculateWeglotPrice(words, Number(input.languages), pricing, input.billing || 'monthly'));
      }
      if (url.pathname === '/api/homepage-audit') {
        const homepage = await auditHomepage(input.url, { maxPageBytes: 2_000_000 });
        const price = calculateWeglotPrice(homepage.estimatedSourceWords, Number(input.languages), pricing, input.billing || 'monthly');
        return json(response, 200, { homepage, price });
      }
      if (url.pathname === '/api/queue-audit') {
        if (!input.consent) return json(response, 400, { error: 'Consent is required before storing the email address and running the audit.' });
        if (!emailValid(input.email)) return json(response, 400, { error: 'Enter a valid email address.' });
        const normalised = normaliseWebsiteUrl(input.url);
        const languages = Number(input.languages);
        calculateWeglotPrice(0, languages, pricing);
        const job = await createAuditJob({ email: input.email.trim(), url: normalised.href, destinationLanguages: languages });
        return json(response, 202, publicJob(job));
      }
    }
    if (request.method === 'GET' && /^\/api\/audits\/[a-f0-9-]{36}$/.test(url.pathname)) {
      const job = await readAuditJob(url.pathname.split('/').pop());
      return json(response, 200, publicJob(job));
    }
    if (request.method === 'GET' && await serveStatic(url.pathname, response)) return;
    json(response, 404, { error: 'Not found' });
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : /private|reserved|credentials|Only HTTP|redirected|valid|must|required|large/i.test(error.message) ? 400 : 502;
    json(response, status, { error: error.message });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Multilingual site audit prototype: http://127.0.0.1:${port}`);
});

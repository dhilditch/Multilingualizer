import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { isoDate, readSiteConfig, requiredEnv, root, writeJson } from './lib/common.mjs';

const config = await readSiteConfig();
const siteUrl = (process.env.WP_SITE_URL || config.baseUrl).replace(/\/$/, '');
const command = process.argv[2];
const args = process.argv.slice(3);
const typeArg = args.find((arg) => arg.startsWith('--type='))?.split('=')[1] || 'posts';
const validTypes = new Set(['posts', 'pages', 'product']);

function authHeaders() {
  requiredEnv(['WP_USERNAME', 'WP_APPLICATION_PASSWORD']);
  const token = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`).toString('base64');
  return { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' };
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${siteUrl}/wp-json/wp/v2/${endpoint}`, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  return response;
}

async function all(type) {
  if (!validTypes.has(type)) throw new Error(`Invalid content type: ${type}`);
  const rows = [];
  let page = 1;
  while (true) {
    const response = await request(`${type}?per_page=100&page=${page}&context=view`);
    rows.push(...await response.json());
    if (page >= Number(response.headers.get('x-wp-totalpages') || 1)) break;
    page++;
  }
  return rows;
}

if (command === 'list') {
  const rows = await all(typeArg);
  for (const row of rows) console.log(`${row.id}\t${row.modified}\t${row.slug}\t${row.link}\t${row.title.rendered}`);
} else if (command === 'export') {
  const date = isoDate();
  for (const type of validTypes) {
    const rows = await all(type);
    const output = await writeJson(`data/wp/${date}/${type}.json`, rows);
    console.log(`Saved ${path.relative(root, output)} (${rows.length})`);
  }
} else if (command === 'draft') {
  const input = args.find((arg) => !arg.startsWith('--'));
  if (!input) throw new Error('Usage: npm run wp:draft -- content/drafts/article.md');
  const inputPath = path.resolve(root, input);
  const parsed = matter(await fs.readFile(inputPath, 'utf8'));
  if (!parsed.data.title) throw new Error('Draft front matter must include title');
  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: await marked.parse(parsed.content),
    categories: parsed.data.categoryIds,
    tags: parsed.data.tagIds,
    status: 'draft'
  };
  for (const key of Object.keys(payload)) if (payload[key] == null) delete payload[key];
  const response = await request('posts', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
  const created = await response.json();
  console.log(`Created WordPress draft ${created.id}: ${created.link}`);
} else {
  console.error('Usage: node scripts/wp-content.mjs <list|export|draft> [--type=posts|pages|product] [file]');
  process.exitCode = 1;
}

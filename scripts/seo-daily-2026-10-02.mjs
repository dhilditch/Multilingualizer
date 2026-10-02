import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { marked } from 'marked';
import { load } from 'cheerio';
import { wpTool } from './lib/wp-mcp.mjs';

const directory = 'data/seo-backups/2026-10-02-daily';
const article = matter(await fs.readFile('content/published/how-to-make-website-bilingual-beginners-guide.md', 'utf8'));
const edits = [
  { id: 44673, path: '/how-to-make-website-bilingual-beginners-guide/', title: article.data.title, description: article.data.excerpt, fields: { post_title: article.data.title, post_excerpt: article.data.excerpt, post_content: await marked.parse(article.content) } },
  { id: 11521, path: '/make-zoho-sites-multilingual/', title: 'Zoho Sites multilingual guide | Multilingualizer', description: 'Read how Multilingualizer handles translated text in Zoho Sites. Find installation instructions, language markers and examples for your pages.' },
  { id: 4462, path: '/product/multilingualizer/', title: 'Multilingualizer: pay once, use forever | Squarespace translations', description: 'Write your translations directly in the Squarespace editor with Multilingualizer. One-time purchase. No monthly or yearly fees. Read setup guides and reviews.' }
];
const decode = result => JSON.parse(result.content[0].text);
const links = new Set();
for (const edit of edits) {
  const before = JSON.parse(await fs.readFile(`${directory}/${edit.id}.json`, 'utf8'));
  const meta = { _yoast_wpseo_title: edit.title, _yoast_wpseo_metadesc: edit.description };
  if (process.argv.includes('--apply')) await wpTool('wp_update_post', { ID: edit.id, fields: edit.fields || {}, meta_input: meta });
  const after = decode(await wpTool('wp_get_post_snapshot', { ID: edit.id, include: ['meta'] }));
  for (const [key, value] of Object.entries(meta)) assert.equal(after.meta[key], value);
  if (edit.fields) for (const [key, value] of Object.entries(edit.fields)) assert.equal(after.post[key], value);
  else assert.equal(after.post.post_content, before.post.post_content, 'Metadata-only edit must preserve content');
  for (const [key, value] of Object.entries(before.meta)) if (!(key in meta)) assert.deepEqual(after.meta[key], value, `Preserve meta ${key}`);
  const response = await fetch(`https://www.multilingualizer.com${edit.path}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200);
  const $ = load(await response.text());
  assert.equal($('link[rel="canonical"]').attr('href'), `https://www.multilingualizer.com${edit.path}`);
  if (!process.argv.includes('--apply')) {
    assert.equal($('title').text(), edit.title);
    assert.equal($('meta[name="description"]').attr('content'), edit.description);
    if (edit.id === 44673) {
      assert.equal($('h1').length, 1);
      assert.ok($('.post-content').text().includes('Pay once, use forever'));
      assert.ok(!$('.post-content').text().includes('$3.99'));
      assert.ok($('[data-ssa-event="multilingualizer_product_click"]').length);
      assert.ok($.html().includes('ajax-price'));
      $('.post-content a[href]').each((i, a) => { const u = new URL($(a).attr('href'), 'https://www.multilingualizer.com'); if (u.origin === 'https://www.multilingualizer.com') links.add(u.href); });
    }
  }
  await fs.writeFile(`${directory}/${edit.id}-after.json`, JSON.stringify(after, null, 2));
}
for (const url of links) assert.equal((await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) })).status, 200, url);
console.log(`${process.argv.includes('--apply') ? 'Applied' : 'Verified'} three SEO actions; ${links.size} internal links checked. Product metadata and Themify layout preserved.`);

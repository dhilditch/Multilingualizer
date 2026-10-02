import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';
import { wpTool } from './lib/wp-mcp.mjs';

const apply = process.argv.includes('--apply');
const directory = 'data/seo-backups/2026-10-02';
await fs.mkdir(directory, { recursive: true });
const decode = (result) => JSON.parse(result.content[0].text);
const changes = [];
const eventLinks = (html) => html.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>/g, (tag, before, href, after) => {
  if (/data-ssa-event=/.test(tag)) return tag;
  const event = /weglot\.com.*fp_ref=/.test(href) ? 'affiliate_click_weglot'
    : /\/product\/multilingualizer\//.test(href) ? 'multilingualizer_product_click'
    : /\/product\/multicurrencyalizer-3\//.test(href) ? 'multicurrencyalizer_product_click' : '';
  return event ? `<a${before}href="${href}"${after} data-ssa-event="${event}"${event.startsWith('affiliate') && !/\brel=/.test(tag) ? ' rel="sponsored"' : ''}>` : tag;
});

async function update(id, fields, meta = {}) {
  const snapshot = decode(await wpTool('wp_get_post_snapshot', { ID: id, include: ['meta'] }));
  const backup = `${directory}/${id}-pre-write.json`;
  try { await fs.writeFile(backup, JSON.stringify(snapshot, null, 2), { flag: 'wx' }); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  const next = { ...fields };
  if (next.post_content) next.post_content = eventLinks(next.post_content);
  changes.push({ id, title: fields.post_title || snapshot.post.post_title, fields: Object.keys(next), meta: Object.keys(meta) });
  if (apply) {
    const inputMeta = { ...meta };
    // WordPress unslashes JSON strings passed through wp_update_post's meta_input.
    if (inputMeta._themify_builder_settings_json) {
      inputMeta._themify_builder_settings_json = inputMeta._themify_builder_settings_json.replaceAll('\\', '\\\\');
    }
    await wpTool('wp_update_post', { ID: id, fields: next, meta_input: inputMeta });
    const actual = decode(await wpTool('wp_get_post_snapshot', { ID: id, include: ['meta'] }));
    for (const [key, value] of Object.entries(next)) {
      if (actual.post[key] !== value) throw new Error(`Post ${id}: ${key} readback differs`);
    }
    for (const [key, value] of Object.entries(meta)) {
      if (actual.meta[key] !== value) throw new Error(`Post ${id}: ${key} metadata differs`);
    }
  }
}

for (const [slug, id] of [['godaddy-website-builder-no-multilingual-fix', 44679], ['website-builders-multilingual-support-comparison', 44676]]) {
  const parsed = matter(await fs.readFile(`content/published/${slug}.md`, 'utf8'));
  await update(id, { post_title: parsed.data.title, post_excerpt: parsed.data.excerpt, post_content: await marked.parse(parsed.content) }, {
    _yoast_wpseo_title: parsed.data.title,
    _yoast_wpseo_metadesc: parsed.data.excerpt
  });
}

const calculator = matter(await fs.readFile('content/published/weglot-pricing-calculator-squarespace.md', 'utf8'));
const calcBefore = decode(await wpTool('wp_get_post_snapshot', { ID: 45656, include: ['meta'] }));
const intro = calculator.content.split('**Affiliate disclosure:**')[0];
let calcContent = calcBefore.post.post_content.replace(/^[\s\S]*?(?=<p><strong>Affiliate disclosure:)/, await marked.parse(intro))
  .replace('on 20 August 2026. Weglot charges', 'on 2 October 2026. Weglot charges');
if (!calcContent.includes('href="/product/multilingualizer/"')) {
  const callout = '<h2>Prefer a one-time purchase?</h2><p>Our very own <a href="/product/multilingualizer/">Multilingualizer</a> lets you write and edit your translated text directly inside the Squarespace editor. It costs [ssp_price product="4462"] as a one-time purchase. Pay once, use forever. No monthly or yearly fees, and no separate translation interface to learn.</p><p>It does not machine-translate content, provide Weglot\'s separate language URLs or translate protected checkout/account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.</p>';
  calcContent = calcContent.replace('<h2>A practical decision sequence</h2>', `${callout}\n<h2>A practical decision sequence</h2>`);
}
await update(45656, { post_title: calculator.data.title, post_excerpt: calculator.data.excerpt, post_content: calcContent }, {
  _yoast_wpseo_title: calculator.data.title,
  _yoast_wpseo_metadesc: calculator.data.excerpt
});

const hub = decode(JSON.parse(await fs.readFile(`${directory}/5936.json`, 'utf8')));
const builder = JSON.parse(hub.meta._themify_builder_settings_json);
const hero = '<h1 style="font-size:32px;line-height:1.25;color:inherit">Make Squarespace multilingual</h1><p>Choose how you want to translate your site, then follow the setup guides below.</p><p>[themify_button style="flat rect yellow" link="/product/multilingualizer/" ]Buy Multilingualizer: pay once, use forever[/themify_button]</p>';
const decision = '<div style="text-align:left;font-size:18px;line-height:1.6;max-width:1100px;margin:0 auto"><h2>Choose your Squarespace translation approach</h2><p>Our very own <a href="/product/multilingualizer/">Multilingualizer</a> lets you write and edit your translated text directly inside the Squarespace editor. It costs [ssp_price product="4462"] as a one-time purchase. Pay once, use forever. No monthly or yearly fees, and no separate translation interface to learn.</p><p>It does not machine-translate content, provide Weglot\'s separate language URLs or translate protected checkout/account screens, but it does put you firmly in control of your own translated text and there will be no monthly fees to pay ever.</p><ul><li><strong>Your own translations in the Squarespace editor:</strong> use <a href="/product/multilingualizer/">Multilingualizer</a> for text switching on the same page.</li><li><strong>Automatic translation and language URLs:</strong> use the <a href="/weglot-pricing-calculator-squarespace/">Weglot pricing calculator</a>, then check the integration and the parts of your site it translates.</li><li><strong>Separately maintained language pages:</strong> follow <a href="https://support.squarespace.com/hc/en-us/articles/16552875658765-Manually-creating-a-multilingual-site">Squarespace\'s manual multilingual instructions</a>. Allow time to keep every version updated.</li></ul><h3>Start with one important page</h3><ol><li>Choose the languages your visitors need and who will review the translations.</li><li>Decide whether each language needs its own URL for search.</li><li>Test navigation, forms and checkout in the selected workflow.</li><li>Translate your key pages, then use the <a href="/squarespace-multilingual-launch-checklist/">launch checklist</a>.</li></ol><p>For the detailed trade-offs, read <a href="/weglot-vs-the-multilingualizer-for-squarespace/">Weglot vs Multilingualizer</a>. For a shop, start with the <a href="/squarespace-multilingual-ecommerce/">multilingual ecommerce guide</a>.</p></div>';
let foundHero = 0, foundDecision = 0;
function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (value.element_id === '1rno025') { value.mod_settings.content_text = eventLinks(hero); foundHero++; }
  if (value.element_id === 'j7yc118') {
    const old = value.mod_settings.content_text;
    const index = old.indexOf('<div id="squarespace-guide-library"');
    if (index < 0) throw new Error('Hub guide library anchor missing');
    value.mod_settings.content_text = eventLinks(decision + old.slice(index));
    foundDecision++;
  }
  for (const child of Object.values(value)) if (child && typeof child === 'object') walk(child);
}
walk(builder);
if (foundHero !== 1 || foundDecision !== 1) throw new Error('Expected exactly two Themify text modules');
const hubContent = hub.post.post_content
  .replace(/<p>The quickest and easiest way[\s\S]*?\[\/themify_button\]<\/p>/, hero)
  .replace(/<p>The Multilingualizer works[\s\S]*?(?=<h2>Squarespace multilingual guides)/, decision)
  .replaceAll('/shop/multilingualizer/', '/product/multilingualizer/');
await update(5936, { post_content: hubContent }, {
  _themify_builder_settings_json: JSON.stringify(builder),
  _yoast_wpseo_title: 'Squarespace Multilingual Guide: Compare Your 3 Options',
  _yoast_wpseo_metadesc: 'Make Squarespace multilingual with your own translations, manual language pages or Weglot. Compare costs, editor workflows, SEO and ecommerce setup.'
});

const base = process.env.WP_SITE_URL.replace(/\/$/, '');
for (const slug of ['weglot-squarespace-checkout-forms-emails', 'squarespace-weglot-seo', 'how-weglot-counts-words-squarespace', 'weglot-language-subdomains-squarespace', 'what-weglot-does-not-translate-squarespace', 'squarespace-multilingual-launch-checklist', 'is-weglot-worth-it-small-squarespace-site', 'squarespace-multilingual-ecommerce']) {
  const rows = await (await fetch(`${base}/wp-json/wp/v2/posts?slug=${slug}`)).json();
  if (rows.length !== 1) throw new Error(`Expected one post: ${slug}`);
  const p = decode(await wpTool('wp_get_post_snapshot', { ID: rows[0].id, include: ['meta'] }));
  let content = p.post.post_content;
  if (['weglot-squarespace-checkout-forms-emails', 'squarespace-weglot-seo'].includes(slug)) {
    const contextual = '<p>If you are still choosing your translation approach, start with the <a href="/make-squarespace-multilingual/">Squarespace multilingual guide</a>. It compares direct editor control, separate manual pages and Weglot before you configure this part of the site.</p>';
    if (!content.includes(contextual)) content = content.replace('</p>', `</p>\n${contextual}`);
  }
  if (eventLinks(content) !== p.post.post_content) await update(rows[0].id, { post_content: content });
}
await fs.writeFile(`${directory}/${apply ? 'applied' : 'preview'}.json`, JSON.stringify(changes, null, 2));
console.log(JSON.stringify({ apply, changes }, null, 2));

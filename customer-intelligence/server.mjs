import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { openDatabase } from './lib/db.mjs';

const HOST = '127.0.0.1';
const DEFAULT_PORT = 4174;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]
  ));
}

function parseJson(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function money(amountMinor, currency) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amountMinor / 100);
  } catch {
    return `${currency} ${(amountMinor / 100).toFixed(2)}`;
  }
}

function clientSpend(value) {
  const entries = Object.entries(parseJson(value, {}));
  return entries.length
    ? entries.map(([currency, amount]) => money(amount, currency)).join(' + ')
    : 'Unknown';
}

function status(value) {
  if (value === null || value === undefined || value === 'unknown') return '<span class="unknown">Unknown</span>';
  if (value === 'possible') return '<span class="unknown">Possible</span>';
  return Number(value) === 1 || value === 'detected'
    ? '<span class="yes">Yes</span>'
    : '<span class="no">No</span>';
}

function layout(title, content) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>
:root{color-scheme:dark;--bg:#10131a;--panel:#191e29;--panel2:#222938;--text:#edf2f7;--muted:#9ba8ba;--line:#30394a;--blue:#68a9ff;--green:#55d68b;--red:#ff7d8b;--amber:#f5c768}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}.wrap{max-width:1500px;margin:auto;padding:28px}.top{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}h1{font-size:28px;margin:4px 0}h2{font-size:19px;margin:26px 0 12px}h3{margin:0 0 6px}.muted{color:var(--muted)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0}.card,.panel{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px}.card strong{font-size:24px;display:block}.filters{display:flex;gap:10px;flex-wrap:wrap;align-items:end;margin:18px 0}.filters label{display:grid;gap:5px;color:var(--muted)}input,select,button{background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:6px;padding:9px 11px}button{cursor:pointer;background:#285c9c}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:10px}table{width:100%;border-collapse:collapse;background:var(--panel)}th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:11px 12px}th{position:sticky;top:0;background:var(--panel2);font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}tr:last-child td{border-bottom:0}.pill{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 8px;margin:1px 3px 1px 0;font-size:12px}.yes{color:var(--green)}.no{color:var(--red)}.unknown{color:var(--amber)}.grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(300px,1fr);gap:16px}.stack{display:grid;gap:16px}.prose{white-space:pre-wrap;max-height:460px;overflow:auto}.bar{display:grid;grid-template-columns:150px 1fr 55px;gap:10px;align-items:center;margin:7px 0}.bar i{height:8px;background:var(--blue);border-radius:9px}.pagination{display:flex;justify-content:space-between;margin:16px 0}@media(max-width:850px){.grid{grid-template-columns:1fr}.wrap{padding:18px}.top{align-items:start;flex-direction:column}}
</style></head><body><main class="wrap">${content}</main></body></html>`;
}

function renderBars(rows, filterName = '') {
  const maximum = Math.max(1, ...rows.map(({ count }) => Number(count)));
  return rows.map(({ label, count }) => {
    const name = label || 'Unknown';
    const renderedName = filterName ? `<a href="/?${filterName}=${encodeURIComponent(name)}">${escapeHtml(name)}</a>` : escapeHtml(name);
    return `<div class="bar"><span>${renderedName}</span><i style="width:${Math.round(Number(count) / maximum * 100)}%"></i><strong>${escapeHtml(count)}</strong></div>`;
  }).join('') || '<p class="muted">No crawled data yet.</p>';
}

function listPage(database, url) {
  const q = url.searchParams.get('q')?.trim() ?? '';
  const active = url.searchParams.get('active') ?? '';
  const ml = url.searchParams.get('ml') ?? '';
  const multilingual = url.searchParams.get('multilingual') ?? '';
  const tool = url.searchParams.get('tool') ?? '';
  const technology = url.searchParams.get('technology') ?? '';
  const techCategory = url.searchParams.get('tech_category') ?? '';
  const platform = url.searchParams.get('platform') ?? '';
  const siteState = url.searchParams.get('site_state') ?? '';
  const sector = url.searchParams.get('sector') ?? '';
  const businessModel = url.searchParams.get('business_model') ?? '';
  const consentUseCase = url.searchParams.get('consent_use_case') ?? '';
  const peerGroup = url.searchParams.get('peer_group') ?? '';
  const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10));
  const perPage = 50;
  const clauses = [];
  const parameters = [];
  if (q) {
    clauses.push('(s.domain LIKE ? OR c.customer_name LIKE ? OR c.company LIKE ? OR s.what_they_do LIKE ? OR s.sector LIKE ? OR s.peer_group LIKE ? OR EXISTS (SELECT 1 FROM site_technologies search_tech WHERE search_tech.site_id=s.id AND search_tech.attributed_to_customer=1 AND (search_tech.name LIKE ? OR search_tech.host LIKE ?)))');
    parameters.push(...Array(8).fill(`%${q}%`));
  }
  if (active) { clauses.push('s.active=?'); parameters.push(active === 'yes' ? 1 : 0); }
  if (ml) { clauses.push('s.multilingualizer_status=?'); parameters.push(ml); }
  if (multilingual) { clauses.push('s.multilingual_status=?'); parameters.push(multilingual); }
  if (tool) {
    clauses.push('EXISTS (SELECT 1 FROM json_each(s.multilingual_tools_json) tools WHERE tools.value=?)');
    parameters.push(tool);
  }
  if (technology) {
    clauses.push('EXISTS (SELECT 1 FROM site_technologies selected_tech WHERE selected_tech.site_id=s.id AND selected_tech.attributed_to_customer=1 AND selected_tech.name=?)');
    parameters.push(technology);
  }
  if (techCategory) {
    clauses.push('EXISTS (SELECT 1 FROM site_technologies category_tech WHERE category_tech.site_id=s.id AND category_tech.attributed_to_customer=1 AND category_tech.category=?)');
    parameters.push(techCategory);
  }
  if (platform) {
    clauses.push(platform === 'Unknown' ? "s.detected_platform=''" : 's.detected_platform=?');
    if (platform !== 'Unknown') parameters.push(platform);
  }
  if (siteState) { clauses.push('s.site_state=?'); parameters.push(siteState); }
  if (sector) { clauses.push('s.sector=?'); parameters.push(sector); }
  if (businessModel) { clauses.push('s.business_model=?'); parameters.push(businessModel); }
  if (consentUseCase) { clauses.push('s.consent_use_case=?'); parameters.push(consentUseCase); }
  if (peerGroup) { clauses.push('s.peer_group=?'); parameters.push(peerGroup); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const total = Number(database.prepare(`SELECT COUNT(*) count FROM sites s JOIN clients c ON c.id=s.client_id ${where}`).get(...parameters).count);
  const rows = database.prepare(`SELECT s.*,c.customer_name,c.company,c.country,c.paid_order_count,c.paid_totals_json,c.last_paid_order_at,
    COALESCE((SELECT json_group_array(name) FROM (SELECT DISTINCT site_tech.name name FROM site_technologies site_tech WHERE site_tech.site_id=s.id AND site_tech.attributed_to_customer=1 ORDER BY name)),'[]') technology_names_json
    FROM sites s JOIN clients c ON c.id=s.client_id ${where} ORDER BY COALESCE(s.last_crawled_at,'') DESC,s.domain LIMIT ? OFFSET ?`).all(...parameters, perPage, (page - 1) * perPage);
  const summary = database.prepare(`SELECT
    (SELECT COUNT(*) FROM clients) clients,
    (SELECT COUNT(*) FROM sites) installations,
    (SELECT COUNT(DISTINCT domain) FROM sites) domains,
    SUM(last_crawled_at IS NOT NULL) crawled,
    SUM(active=1) active,
    SUM(multilingualizer_status='detected') ml_detected,
    SUM(multilingual_status='detected') multilingual_detected,
    SUM(multilingual_status='detected' AND multilingualizer_status='not_detected') other_tool,
    SUM(visible_price_count>0) priced,
    SUM(json_array_length(emails_json)>0) with_email
    ,SUM(site_state='parked') parked
    ,SUM(sector<>'' AND sector<>'Unclassified' AND site_state='customer_site') sector_classified
    ,(SELECT COUNT(DISTINCT name) FROM site_technologies WHERE attributed_to_customer=1) technologies
    ,(SELECT COUNT(DISTINCT site_id) FROM site_technologies WHERE attributed_to_customer=1) sites_with_technology
    FROM sites`).get();
  const platforms = database.prepare("SELECT COALESCE(NULLIF(detected_platform,''),'Unknown') label,COUNT(*) count FROM sites WHERE last_crawled_at IS NOT NULL GROUP BY label ORDER BY count DESC").all();
  const languageTools = database.prepare("SELECT tools.value label,COUNT(DISTINCT s.id) count FROM sites s,json_each(s.multilingual_tools_json) tools GROUP BY tools.value ORDER BY count DESC,label").all();
  const platformOptions = database.prepare("SELECT DISTINCT detected_platform value FROM sites WHERE detected_platform<>'' ORDER BY detected_platform").all();
  const toolOptions = languageTools.map(({ label }) => ({ value: label }));
  const technologies = database.prepare('SELECT name label,COUNT(DISTINCT site_id) count FROM site_technologies WHERE attributed_to_customer=1 GROUP BY name ORDER BY count DESC,label').all();
  const technologyCategories = database.prepare('SELECT category value,COUNT(DISTINCT site_id) count FROM site_technologies WHERE attributed_to_customer=1 GROUP BY category ORDER BY count DESC,value').all();
  const siteStates = database.prepare("SELECT site_state value,COUNT(*) count FROM sites WHERE site_state<>'' GROUP BY site_state ORDER BY count DESC,value").all();
  const sectors = database.prepare("SELECT sector label,COUNT(*) count FROM sites WHERE site_state='customer_site' AND sector<>'' GROUP BY sector ORDER BY count DESC,label").all();
  const businessModels = database.prepare("SELECT business_model value,COUNT(*) count FROM sites WHERE site_state='customer_site' AND business_model<>'' GROUP BY business_model ORDER BY count DESC,value").all();
  const consentUseCases = database.prepare("SELECT consent_use_case value,COUNT(*) count FROM sites WHERE site_state='customer_site' AND consent_use_case<>'' GROUP BY consent_use_case ORDER BY count DESC,value").all();
  const peerGroups = database.prepare("SELECT peer_group label,COUNT(*) count FROM sites WHERE site_state='customer_site' AND peer_group<>'' GROUP BY peer_group ORDER BY count DESC,label").all();
  const cards = [
    ['Paid customers', summary.clients], ['Registered installations', summary.installations],
    ['Distinct domains', summary.domains], ['Crawled', summary.crawled ?? 0],
    ['Live', summary.active ?? 0, '/?active=yes'], ['Multilingualizer detected', summary.ml_detected ?? 0, '/?ml=detected'],
    ['Still multilingual', summary.multilingual_detected ?? 0, '/?multilingual=detected'], ['Other tool/setup', summary.other_tool ?? 0, '/?multilingual=detected&ml=not_detected'],
    ['SaaS/JS tools', summary.technologies ?? 0], ['Sites with third party', summary.sites_with_technology ?? 0],
    ['Sector classified', summary.sector_classified ?? 0], ['Parked domains', summary.parked ?? 0, '/?site_state=parked'],
    ['Prices found', summary.priced ?? 0], ['Public email found', summary.with_email ?? 0],
  ];
  const queryString = (newPage) => {
    const next = new URLSearchParams(url.searchParams);
    next.set('page', newPage);
    return `/?${next}`;
  };
  const tableRows = rows.map((row) => `<tr>
    <td><a href="/site/${row.id}"><strong>${escapeHtml(row.domain)}</strong></a><br><span class="muted">${escapeHtml(row.registered_platform || 'Unspecified')} · ${escapeHtml(parseJson(row.registered_languages_json, []).join(', '))}</span><br><span class="pill">${escapeHtml(row.site_state || 'unknown')}</span></td>
    <td>Live ${status(row.active)}<br>Multilingual ${status(row.multilingual_status)}<br>Multilingualizer ${status(row.multilingualizer_status)}<br>${parseJson(row.multilingual_tools_json, []).map((value) => `<span class="pill">${escapeHtml(value)}</span>`).join('') || '<span class="muted">No current tool identified</span>'}<br><span class="pill">${escapeHtml(row.detected_platform || 'Unknown')}</span>${row.visible_price_count ? `<span class="pill">${row.visible_price_count} prices</span>` : ''}</td>
    <td>${escapeHtml(row.what_they_do || row.meta_description || 'Not extracted yet').slice(0, 320)}<div><a class="pill" href="/?sector=${encodeURIComponent(row.sector)}">${escapeHtml(row.sector || 'Unclassified')}</a><a class="pill" href="/?business_model=${encodeURIComponent(row.business_model)}">${escapeHtml(row.business_model || 'Unclassified')}</a></div><div>${parseJson(row.technology_names_json, []).slice(0, 8).map((value) => `<a class="pill" href="/?technology=${encodeURIComponent(value)}">${escapeHtml(value)}</a>`).join('')}${parseJson(row.technology_names_json, []).length > 8 ? `<span class="muted"> +${parseJson(row.technology_names_json, []).length - 8} more</span>` : ''}</div></td>
    <td>${parseJson(row.emails_json, []).slice(0, 2).map(escapeHtml).join('<br>') || '<span class="muted">None found</span>'}</td>
    <td>${escapeHtml(row.customer_name || row.company || 'Unknown')}<br>${escapeHtml(clientSpend(row.paid_totals_json))}<br><span class="muted">${row.paid_order_count} paid order(s)</span></td>
  </tr>`).join('');
  return layout('Multilingualizer customer intelligence', `<div class="top"><div><h1>Multilingualizer customer intelligence</h1><div class="muted">Paid buyer installations and current public-site evidence</div></div><div class="muted">Local, read-only explorer</div></div>
  <div class="cards">${cards.map(([label, value, href]) => `<div class="card"><strong>${href ? `<a href="${href}">${escapeHtml(value ?? 0)}</a>` : escapeHtml(value ?? 0)}</strong><span class="muted">${label}</span></div>`).join('')}</div>
  <div class="grid"><section><form class="filters"><label>Search<input name="q" value="${escapeHtml(q)}" placeholder="Domain, customer, sector, SaaS or host"></label><label>Site state<select name="site_state"><option value="">All</option>${siteStates.map(({ value, count }) => `<option value="${escapeHtml(value)}" ${siteState === value ? 'selected' : ''}>${escapeHtml(value)} (${count})</option>`).join('')}</select></label><label>Sector<select name="sector"><option value="">All</option>${sectors.map(({ label, count }) => `<option value="${escapeHtml(label)}" ${sector === label ? 'selected' : ''}>${escapeHtml(label)} (${count})</option>`).join('')}</select></label><label>Business model<select name="business_model"><option value="">All</option>${businessModels.map(({ value, count }) => `<option value="${escapeHtml(value)}" ${businessModel === value ? 'selected' : ''}>${escapeHtml(value)} (${count})</option>`).join('')}</select></label><label>Peer group<select name="peer_group"><option value="">All</option>${peerGroups.map(({ label, count }) => `<option value="${escapeHtml(label)}" ${peerGroup === label ? 'selected' : ''}>${escapeHtml(label)} (${count})</option>`).join('')}</select></label><label>Consent use case<select name="consent_use_case"><option value="">All</option>${consentUseCases.map(({ value, count }) => `<option value="${escapeHtml(value)}" ${consentUseCase === value ? 'selected' : ''}>${escapeHtml(value)} (${count})</option>`).join('')}</select></label><label>Live<select name="active"><option value="">All</option><option value="yes" ${active === 'yes' ? 'selected' : ''}>Yes</option><option value="no" ${active === 'no' ? 'selected' : ''}>No</option></select></label><label>Still multilingual<select name="multilingual"><option value="">All</option><option value="detected" ${multilingual === 'detected' ? 'selected' : ''}>Yes</option><option value="possible" ${multilingual === 'possible' ? 'selected' : ''}>Possible</option><option value="not_detected" ${multilingual === 'not_detected' ? 'selected' : ''}>No evidence</option><option value="unknown" ${multilingual === 'unknown' ? 'selected' : ''}>Site unavailable</option></select></label><label>Current language tool<select name="tool"><option value="">All</option>${toolOptions.map(({ value }) => `<option value="${escapeHtml(value)}" ${tool === value ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}</select></label><label>SaaS / JS tool<select name="technology"><option value="">All</option>${technologies.map(({ label, count }) => `<option value="${escapeHtml(label)}" ${technology === label ? 'selected' : ''}>${escapeHtml(label)} (${count})</option>`).join('')}</select></label><label>SaaS category<select name="tech_category"><option value="">All</option>${technologyCategories.map(({ value, count }) => `<option value="${escapeHtml(value)}" ${techCategory === value ? 'selected' : ''}>${escapeHtml(value)} (${count})</option>`).join('')}</select></label><label>Multilingualizer<select name="ml"><option value="">All</option><option value="detected" ${ml === 'detected' ? 'selected' : ''}>Detected</option><option value="possible" ${ml === 'possible' ? 'selected' : ''}>Possible</option><option value="not_detected" ${ml === 'not_detected' ? 'selected' : ''}>Not detected</option><option value="unknown" ${ml === 'unknown' ? 'selected' : ''}>Unknown</option></select></label><label>Platform<select name="platform"><option value="">All</option>${platformOptions.map(({ value }) => `<option ${platform === value ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}</select></label><button>Filter</button></form>
  <div class="table-wrap"><table><thead><tr><th>Site</th><th>Current evidence</th><th>What they do</th><th>Public contacts</th><th>Purchase</th></tr></thead><tbody>${tableRows}</tbody></table></div>
  <div class="pagination"><span>${total} matching installation(s), page ${page}</span><span>${page > 1 ? `<a href="${queryString(page - 1)}">Previous</a>` : ''} ${page * perPage < total ? `<a href="${queryString(page + 1)}">Next</a>` : ''}</span></div></section><aside class="stack"><section class="panel"><h3>Customer sectors</h3>${renderBars(sectors, 'sector')}</section><section class="panel"><h3>Peer groups</h3>${renderBars(peerGroups.slice(0, 30), 'peer_group')}</section><section class="panel"><h3>Detected SaaS and JavaScript</h3>${renderBars(technologies.slice(0, 40), 'technology')}</section><section class="panel"><h3>Current language tools</h3>${renderBars(languageTools, 'tool')}</section><section class="panel"><h3>Detected platforms</h3>${renderBars(platforms, 'platform')}</section></aside></div>`);
}

function sitePage(database, id) {
  const site = database.prepare('SELECT s.*,c.customer_name,c.email client_email,c.company,c.country,c.paid_order_count,c.paid_totals_json,c.products_json,c.first_paid_order_at,c.last_paid_order_at FROM sites s JOIN clients c ON c.id=s.client_id WHERE s.id=?').get(id);
  if (!site) return null;
  const contacts = database.prepare('SELECT * FROM contacts WHERE site_id=? ORDER BY contact_type,value').all(id);
  const prices = database.prepare('SELECT * FROM prices WHERE site_id=? ORDER BY currency,amount_minor').all(id);
  const signals = database.prepare('SELECT * FROM signals WHERE site_id=? ORDER BY signal_type,value').all(id);
  const technologies = database.prepare('SELECT * FROM site_technologies WHERE site_id=? ORDER BY category,name,host,evidence_type').all(id);
  const pages = database.prepare('SELECT * FROM pages WHERE site_id=? ORDER BY id DESC LIMIT 20').all(id);
  const products = parseJson(site.products_services_json, []);
  const purchasedProducts = parseJson(site.products_json, []);
  const registeredLanguages = parseJson(site.registered_languages_json, []);
  return layout(site.domain, `<div class="top"><div><a href="/">← All installations</a><h1>${escapeHtml(site.domain)}</h1><div class="muted">${escapeHtml(site.customer_name || site.company || 'Unknown customer')} · ${escapeHtml(clientSpend(site.paid_totals_json))} · ${site.paid_order_count} paid order(s)</div></div>${site.final_homepage_url ? `<a href="${escapeHtml(site.final_homepage_url)}" target="_blank" rel="noreferrer">Open live site ↗</a>` : ''}</div>
  <div class="cards"><div class="card"><strong>${status(site.active)}</strong><span class="muted">Site live</span></div><div class="card"><strong>${escapeHtml(site.site_state || 'unknown')}</strong><span class="muted">Current site state${site.parked_provider ? ` · ${escapeHtml(site.parked_provider)}` : ''}</span></div><div class="card"><strong>${status(site.multilingual_status)}</strong><span class="muted">Still multilingual</span></div><div class="card"><strong>${status(site.multilingualizer_status)}</strong><span class="muted">Multilingualizer detected</span></div><div class="card"><strong>${escapeHtml(parseJson(site.multilingual_tools_json, []).join(', ') || 'None identified')}</strong><span class="muted">Current language tool</span></div><div class="card"><strong>${escapeHtml(site.detected_platform || 'Unknown')}</strong><span class="muted">Detected platform</span></div><div class="card"><strong>${site.visible_price_count}</strong><span class="muted">Visible prices</span></div></div>
  <div class="grid"><div class="stack"><section class="panel"><h3>Classification</h3><p><a class="pill" href="/?sector=${encodeURIComponent(site.sector)}">${escapeHtml(site.sector || 'Unclassified')}</a><a class="pill" href="/?business_model=${encodeURIComponent(site.business_model)}">${escapeHtml(site.business_model || 'Unclassified')}</a><a class="pill" href="/?peer_group=${encodeURIComponent(site.peer_group)}">${escapeHtml(site.peer_group || 'No peer group')}</a></p><p><strong>Consent use case:</strong> ${escapeHtml(site.consent_use_case || 'Not classified')}<br><span class="muted">Deterministic confidence: ${site.classification_confidence}%</span></p></section><section class="panel"><h3>What they do</h3><p>${escapeHtml(site.what_they_do || site.meta_description || 'Not extracted')}</p>${products.length ? `<div>${products.map((value) => `<span class="pill">${escapeHtml(value)}</span>`).join('')}</div>` : ''}</section><section class="panel"><h3>About</h3>${site.about_url ? `<p><a href="${escapeHtml(site.about_url)}" target="_blank" rel="noreferrer">${escapeHtml(site.about_title || site.about_url)} ↗</a></p>` : '<p class="muted">No About page found.</p>'}<div class="prose">${escapeHtml(site.about_text)}</div></section><section class="panel"><h3>Detected SaaS and third-party JavaScript</h3>${site.site_state === 'parked' ? '<p class="unknown">This is a parked page. Its technology evidence is retained below but is not attributed to the customer or included in aggregate SaaS counts.</p>' : ''}${technologies.length ? `<div class="table-wrap"><table><thead><tr><th>Technology</th><th>Category</th><th>Evidence</th></tr></thead><tbody>${technologies.map((technology) => `<tr><td>${technology.attributed_to_customer ? `<a href="/?technology=${encodeURIComponent(technology.name)}">${escapeHtml(technology.name)}</a>` : escapeHtml(technology.name)}</td><td>${escapeHtml(technology.category)}</td><td>${escapeHtml(technology.host || technology.evidence_type)}<br><span class="muted">${escapeHtml(technology.evidence_type)} · ${technology.confidence}% · ${escapeHtml(technology.page_kind)} · ${technology.attributed_to_customer ? 'customer-attributed' : 'parking-provider only'}</span></td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No external JavaScript or recognised SaaS fingerprint found.</p>'}</section><section class="panel"><h3>Price evidence</h3>${prices.length ? `<div class="table-wrap"><table><thead><tr><th>Price</th><th>Context</th><th>Source</th></tr></thead><tbody>${prices.map((price) => `<tr><td>${escapeHtml(money(price.amount_minor, price.currency))}</td><td>${escapeHtml(price.context)}</td><td><a href="${escapeHtml(price.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(price.page_kind)}</a></td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No visible prices found on the fetched pages.</p>'}</section></div>
  <aside class="stack"><section class="panel"><h3>Customer record</h3><p>${escapeHtml(site.customer_name || 'Name unavailable')}<br>${escapeHtml(site.client_email || 'Email unavailable')}<br>${escapeHtml(site.company || 'Company unavailable')}<br>${escapeHtml(site.country || 'Country unavailable')}</p><p>${escapeHtml(clientSpend(site.paid_totals_json))}<br>${site.paid_order_count} paid order(s)<br><span class="muted">${escapeHtml(site.first_paid_order_at || 'Unknown')} to ${escapeHtml(site.last_paid_order_at || 'Unknown')}</span></p>${purchasedProducts.length ? `<div>${purchasedProducts.map((value) => `<span class="pill">${escapeHtml(value)}</span>`).join('')}</div>` : ''}</section><section class="panel"><h3>Registration</h3><p>Supplied: ${escapeHtml(site.supplied_url)}<br>Platform: ${escapeHtml(site.registered_platform || 'Unspecified')}<br>Languages: ${escapeHtml(registeredLanguages.join(', ') || 'Unspecified')}</p></section><section class="panel"><h3>Public contacts</h3>${contacts.length ? contacts.map((contact) => `<p><span class="pill">${escapeHtml(contact.contact_type)}</span> <a href="${escapeHtml(contact.url || contact.value)}">${escapeHtml(contact.value)}</a></p>`).join('') : '<p class="muted">None found.</p>'}${site.contact_url ? `<p><a href="${escapeHtml(site.contact_url)}" target="_blank" rel="noreferrer">Contact page ↗</a></p>` : ''}</section><section class="panel"><h3>Evidence</h3>${signals.map((signal) => `<p><span class="pill">${escapeHtml(signal.signal_type)}</span> ${escapeHtml(signal.value)}<br><span class="muted">${escapeHtml(signal.evidence_method)} · ${signal.confidence}%</span></p>`).join('') || '<p class="muted">Not crawled.</p>'}</section><section class="panel"><h3>Fetched pages</h3>${pages.map((page) => `<p><span class="pill">${escapeHtml(page.page_kind)}</span> ${page.http_status ?? 'failed'} · ${page.response_bytes} bytes<br><a href="${escapeHtml(page.final_url || page.requested_url)}" target="_blank" rel="noreferrer">${escapeHtml(page.title || page.final_url || page.requested_url)}</a><br><span class="muted">${escapeHtml(page.fetched_at)}</span></p>`).join('') || '<p class="muted">None yet.</p>'}</section></aside></div>`);
}

function parseArguments(argv) {
  const args = { port: DEFAULT_PORT, database: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--port') args.port = Number.parseInt(argv[++index], 10);
    else if (argv[index] === '--database') args.database = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return args;
}

const args = parseArguments(process.argv.slice(2));
const database = openDatabase(args.database ?? undefined);
const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${HOST}:${args.port}`);
  let body;
  let statusCode = 200;
  if (request.method !== 'GET') { statusCode = 405; body = 'Method not allowed'; }
  else if (url.pathname === '/') body = listPage(database, url);
  else if (/^\/site\/\d+$/.test(url.pathname)) {
    body = sitePage(database, Number(url.pathname.split('/').pop()));
    if (!body) { statusCode = 404; body = 'Not found'; }
  } else { statusCode = 404; body = 'Not found'; }
  response.writeHead(statusCode, {
    'content-type': body.startsWith('<!doctype') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8',
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    'x-content-type-options': 'nosniff',
    'cache-control': 'no-store',
  });
  response.end(body);
});
server.listen(args.port, HOST, () => console.log(`Multilingualizer customer intelligence: http://${HOST}:${args.port}`));
process.on('SIGINT', () => { server.close(); database.close(); });

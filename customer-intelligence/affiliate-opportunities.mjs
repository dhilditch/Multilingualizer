import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { openDatabase } from './lib/db.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTPUT = path.join(ROOT, '.docs', 'affiliates', 'opportunities');

const PROGRAMMES = [
  ['squarespace', 'Squarespace', ['Squarespace'], 'organic', 'Commission disclosed after approval', 'https://www.squarespace.com/affiliates', 'Use the dominant customer platform as evidence for Squarespace-specific multilingual guides. This is an organic acquisition route, not a reason to move an existing customer.'],
  ['shopify', 'Shopify', ['Shopify'], 'organic', 'Qualified full-price plan referrals', 'https://www.shopify.com/affiliates', 'Publish multilingual commerce guidance for businesses already evaluating Shopify. Do not treat current Shopify customers as referral prospects.'],
  ['webflow', 'Webflow', ['Webflow'], 'organic', '50% for up to 12 months', 'https://webflow.com/solutions/affiliates', 'Build Webflow localisation and migration content around the customer sectors already observed using it.'],
  ['wix', 'Wix', ['Wix'], 'organic', 'Variable Premium-plan reward', 'https://www.wix.com/about/affiliates/home', 'Use current sector evidence to create honest Wix multilingual setup and comparison content.'],
  ['zoho', 'Zoho', ['Zoho Sites', 'Zoho PageSense', 'Zoho Forms', 'Zoho Campaigns'], 'crm', '15% for 12 months, with higher tiers', 'https://www.zoho.com/affiliate/', 'Recommend the relevant Zoho product only where a service business actually needs CRM, forms, campaigns or testing.'],
  ['godaddy', 'GoDaddy', ['GoDaddy Website Builder'], 'organic', 'Qualifying sales through CJ', 'https://www.godaddy.com/en-ph/affiliate-programs', 'Limit this to domain, migration and site-builder evaluation content. Existing customer sites are evidence, not prospects.'],
  ['framer', 'Framer', ['Framer'], 'organic', 'Creator programme subject to qualification', 'https://www.framer.com/help/articles/how-the-creator-program-works/', 'Only pursue after producing a qualifying Framer template or remix-linked resource.'],
  ['format', 'Format', ['Format'], 'organic', '50% during the first year', 'https://www.format.com/affiliates', 'Create multilingual portfolio-site guidance for creative professionals evaluating Format.'],
  ['wpml', 'WPML', ['WPML'], 'translation', '20%, with a published 40% tier', 'https://wpml.org/account/affiliate/', 'Use only for WordPress cases where Multilingualizer is not the right fit. Never promote a migration merely for commission.'],
  ['weglot', 'Weglot', ['Weglot'], 'translation', 'Existing programme, lifetime revenue share', 'https://www.weglot.com/partners', 'Improve the existing revenue stream with platform-specific comparison and migration pages tied to observed customer use cases.'],
  ['translatepress', 'TranslatePress', ['TranslatePress'], 'translation', '20%, rising to 30%', 'https://translatepress.com/affiliate-program/', 'Recommend for suitable WordPress use cases, supported by the observed migrations away from Multilingualizer.'],
  ['conveythis', 'ConveyThis', ['ConveyThis'], 'translation', 'Rate supplied privately', 'https://www.conveythis.com/become-a-partner', 'Include in cross-platform translation comparisons only where its feature set genuinely fits.'],
  ['linguise', 'Linguise', ['Linguise'], 'translation', '20% recurring for one year', 'https://www.linguise.com/linguise-affiliate-program/', 'Use in multilingual comparisons and platform cases where server-side translation is relevant.'],
  ['hubspot', 'HubSpot', ['HubSpot'], 'crm', '30% recurring for one year', 'https://www.hubspot.com/partners/affiliates', 'Target agencies, consultancies, software and professional-service businesses that need CRM and marketing automation, not every site with a contact form.'],
  ['fathom', 'Fathom Analytics', ['Fathom Analytics'], 'analytics', '25% lifetime recurring', 'https://usefathom.com/affiliates', 'Offer a privacy-focused analytics guide to sites currently using heavier analytics stacks. Explain capability differences plainly.'],
  ['mailerlite', 'MailerLite', ['MailerLite'], 'crm', '30% lifetime recurring', 'https://www.mailerlite.com/affiliate', 'Focus on small service, education and ecommerce businesses that need email marketing without an identified CRM platform.'],
  ['pipedrive', 'Pipedrive', ['Pipedrive'], 'crm', '20% for one year, tiering to 30%', 'https://www.pipedrive.com/en/affiliate-partnership', 'Focus on sales-led agencies, consultancies and professional services with no detected CRM.'],
  ['cookieyes', 'CookieYes', ['CookieYes'], 'consent', '30% recurring for three years', 'https://www.cookieyes.com/documentation/cookieyes-affiliate-program-tapfiliate/', 'Use sector-specific consent examples based on the actual advertising, analytics, embeds, forms and ecommerce scripts detected.'],
  ['usercentrics', 'Usercentrics', ['Usercentrics'], 'consent', '30% for one year', 'https://usercentrics.com/affiliates/', 'Position as a consent option in careful comparisons, especially for European businesses with more complex tracking stacks.'],
  ['iubenda', 'iubenda', ['iubenda'], 'consent', 'Up to 40% on the first purchase', 'https://www.iubenda.com/en/join-the-iubenda-affiliate-program/', 'Cover policy and consent tooling without presenting generated policies as legal advice.'],
  ['ccm19', 'CCM19', ['CCM19'], 'consent_de', '20% lifetime commission', 'https://www.ccm19.de/en/affiliate.html', 'Prioritise German-speaking customer sectors and comparisons where a German-focused CMP is relevant.'],
  ['elfsight', 'Elfsight', ['Elfsight'], 'widgets', '30% for 360 days', 'https://elfsight.com/affiliate-program/', 'Create platform-and-sector widget guides, for example reviews, social feeds and galleries, using observed customer patterns.'],
  ['spark-plugin', 'Spark Plugin', ['Spark Plugin'], 'squarespace', 'US$50 to US$250 by plan', 'https://www.sparkplugin.com/affiliate', 'Recommend concrete Squarespace design enhancements to customers on Squarespace where the plugin solves a visible need.'],
  ['ghost-plugins', 'Ghost Plugins', ['Ghost Plugins'], 'squarespace', '20% per referred sale', 'https://www.ghostplugins.com/affiliates', 'Create narrowly useful Squarespace enhancement tutorials rather than a generic plugin list.'],
  ['powr', 'POWR', ['POWR'], 'widgets', '30% recurring while paid', 'https://get.powr.io/affiliate-and-agency-partner-program', 'Recommend forms, galleries or commerce widgets by sector and platform only where the native platform lacks the required function.'],
  ['jotform', 'Jotform', ['Jotform'], 'forms', '30% for the first year', 'https://www.jotform.com/partnership/affiliate/', 'Build form and intake workflow guides for service, event and booking businesses without an identified form SaaS.'],
  ['foxycart', 'FoxyCart', ['FoxyCart'], 'embedded_commerce', 'At least 15% of eligible revenue', 'https://affiliate.foxycart.com/home', 'Focus on Squarespace and Webflow businesses needing embedded commerce rather than moving their whole site.'],
  ['trustindex', 'Trustindex', ['Trustindex'], 'reviews', '30% lifetime recurring', 'https://www.trustindex.io/affiliate/', 'Target review-dependent ecommerce, hospitality, food and appointment businesses without a detected review widget.'],
  ['gorgias', 'Gorgias', ['Gorgias'], 'shopify_support', '20% for two years, tiering to 40%', 'https://www.gorgias.com/affiliate-program', 'Keep this specific to Shopify stores with a genuine customer-support workload.'],
  ['optimonk', 'OptiMonk', ['OptiMonk'], 'ecommerce_conversion', '20% for two years', 'https://www.optimonk.com/partners-program', 'Use ecommerce conversion guides where personalisation or cart recovery has a measurable purpose.'],
  ['poptin', 'Poptin', ['Poptin'], 'ecommerce_conversion', '25% lifetime recurring', 'https://www.poptin.com/affiliate/', 'Use lead-capture and ecommerce examples, with care not to recommend intrusive popups by default.'],
  ['n8n', 'n8n', ['n8n'], 'automation', '30% of Cloud revenue for 12 months', 'https://n8n.io/affiliates/', 'Publish real workflows connecting forms, CRM and marketing tools rather than promoting automation in the abstract.'],
  ['cookiebot', 'Cookiebot reseller', ['Cookiebot'], 'consent', 'Reseller: 40% for three years then 20%', 'https://www.cookiebot.com/en/resellers/', 'Treat this as a managed-consent service decision, not a normal content affiliate link.'],
  ['hotjar', 'Hotjar partner', ['Hotjar'], 'analytics', 'Partner: 25% on qualifying multi-year contracts', 'https://help.hotjar.com/hc/en-us/articles/36820042225553-Hotjar-Partner-Program', 'Use only if Multilingualizer develops a consulting or optimisation service around behaviour analytics.'],
  ['cloudbeds', 'Cloudbeds Ambassador', ['Cloudbeds'], 'hospitality', 'Up to 35% on qualified deals', 'https://www.cloudbeds.com/ambassadors/', 'Develop only as part of a deliberate hospitality vertical with property-management guidance.'],
];

function placeholders(values) {
  return values.map(() => '?').join(',');
}

function technologyCondition(names, alias = 's') {
  if (!names.length) return { sql: '0', parameters: [] };
  return {
    sql: `(EXISTS (SELECT 1 FROM site_technologies st WHERE st.site_id=${alias}.id AND st.attributed_to_customer=1 AND st.name IN (${placeholders(names)})) OR EXISTS (SELECT 1 FROM json_each(${alias}.multilingual_tools_json) language_tools WHERE language_tools.value IN (${placeholders(names)})))`,
    parameters: [...names, ...names],
  };
}

function audienceCondition(kind, names) {
  const own = technologyCondition(names);
  const absent = names.length ? `NOT (${own.sql})` : '1';
  const base = "s.active=1 AND s.site_state='customer_site'";
  const values = [...own.parameters];
  const rules = {
    organic: ['0', []],
    translation: [`${base} AND s.multilingualizer_status='not_detected' AND s.multilingual_status IN ('detected','possible') AND ${absent}`, values],
    crm: [`${base} AND s.business_model IN ('Agency or consultancy','Professional services','Software or subscription','Courses or membership','Ecommerce') AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='CRM/marketing')`, []],
    analytics: [`${base} AND EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.name='Google Analytics') AND ${absent}`, values],
    consent: [`${base} AND s.consent_use_case<>'Basic consent only' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Consent/privacy')`, []],
    consent_de: [`${base} AND c.country IN ('DE','AT','CH') AND s.consent_use_case<>'Basic consent only' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Consent/privacy')`, []],
    widgets: [`${base} AND s.detected_platform IN ('Squarespace','Shopify','Webflow','Wix') AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Widgets')`, []],
    squarespace: [`${base} AND s.detected_platform='Squarespace' AND ${absent}`, values],
    forms: [`${base} AND (s.sector='Events and experiences' OR s.business_model IN ('Agency or consultancy','Professional services','Appointments or bookings')) AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Scheduling/forms')`, []],
    embedded_commerce: [`${base} AND s.detected_platform IN ('Squarespace','Webflow') AND s.business_model='Ecommerce' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Payments/commerce')`, []],
    reviews: [`${base} AND (s.business_model IN ('Ecommerce','Appointments or bookings','Hospitality or travel bookings') OR s.sector IN ('Food and drink','Travel and hospitality')) AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Reviews/widgets')`, []],
    shopify_support: [`${base} AND s.detected_platform='Shopify' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Support/chat')`, []],
    ecommerce_conversion: [`${base} AND s.business_model='Ecommerce' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Marketing/optimisation')`, []],
    automation: [`${base} AND (EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category IN ('CRM/marketing','Scheduling/forms')) OR s.business_model='Agency or consultancy') AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Automation')`, []],
    hospitality: [`${base} AND s.sector='Travel and hospitality' AND NOT EXISTS (SELECT 1 FROM site_technologies x WHERE x.site_id=s.id AND x.attributed_to_customer=1 AND x.category='Scheduling/booking')`, []],
  };
  const [sql, parameters] = rules[kind];
  return { sql, parameters, label: kind === 'organic' ? 'Organic acquisition only' : 'Potential customer audience' };
}

function counts(database, condition) {
  return database.prepare(`SELECT COUNT(DISTINCT s.id) installations,COUNT(DISTINCT s.client_id) customers FROM sites s JOIN clients c ON c.id=s.client_id WHERE ${condition.sql}`).get(...condition.parameters);
}

function top(database, condition, column, limit = 5) {
  const allowed = new Set(['sector', 'peer_group', 'detected_platform', 'consent_use_case']);
  if (!allowed.has(column)) throw new Error(`Unsupported grouping: ${column}`);
  return database.prepare(`SELECT COALESCE(NULLIF(s.${column},''),'Unclassified') label,COUNT(DISTINCT s.client_id) customers FROM sites s JOIN clients c ON c.id=s.client_id WHERE ${condition.sql} GROUP BY label ORDER BY customers DESC,label LIMIT ?`).all(...condition.parameters, limit);
}

function observedPeerCondition(database, currentCondition, audience) {
  const groups = database.prepare(`SELECT DISTINCT s.peer_group FROM sites s JOIN clients c ON c.id=s.client_id WHERE ${currentCondition.sql} AND s.peer_group NOT IN ('','Unclassified','Parked domain')`).all(...currentCondition.parameters).map(({ peer_group: value }) => value);
  if (!groups.length || audience.sql === '0') return { sql: '0', parameters: [] };
  return {
    sql: `(${audience.sql}) AND s.peer_group IN (${placeholders(groups)})`,
    parameters: [...audience.parameters, ...groups],
  };
}

function list(rows) {
  return rows.length ? rows.map(({ label, customers }) => `${label} (${customers})`).join(', ') : 'None';
}

function explorerLink(name, value) {
  return `http://127.0.0.1:4174/?${name}=${encodeURIComponent(value)}`;
}

function renderProgramme(database, programme) {
  const [slug, name, technologies, kind, reward, url, angle] = programme;
  const current = technologyCondition(technologies);
  const currentCondition = { sql: `s.site_state='customer_site' AND ${current.sql}`, parameters: current.parameters };
  const currentCounts = counts(database, currentCondition);
  const audience = audienceCondition(kind, technologies);
  const audienceCounts = counts(database, audience);
  const peerOpportunity = observedPeerCondition(database, currentCondition, audience);
  const peerOpportunityCounts = counts(database, peerOpportunity);
  const currentSectors = top(database, currentCondition, 'sector');
  const currentPeers = top(database, currentCondition, 'peer_group');
  const audienceSectors = top(database, audience, 'sector');
  const audiencePlatforms = top(database, audience, 'detected_platform');
  const peerOpportunityGroups = top(database, peerOpportunity, 'peer_group');
  const direct = kind === 'organic'
    ? 'No existing customer referral audience is counted. Platform customers cannot be new-plan referrals, and a platform switch should never be suggested merely for commission.'
    : `The rule identifies ${audienceCounts.customers} unique paid customers across ${audienceCounts.installations} current installations. It is a relevance signal, not permission to market to them and not proof that the product is suitable.`;
  const technologyLinks = technologies.map((technology) => `[${technology}](${explorerLink('technology', technology)})`).join(', ');
  const body = `# ${name} customer opportunity\n\nGenerated: 21 August 2026\n\n- **Programme:** [Official page](${url})\n- **Published reward summary:** ${reward}\n- **Current attributed evidence:** ${currentCounts.customers} unique paid customers across ${currentCounts.installations} installations${technologyLinks ? `, browse ${technologyLinks}` : ''}\n- **Top current sectors:** ${list(currentSectors)}\n- **Top current peer groups:** ${list(currentPeers)}\n- **${audience.label}:** ${audienceCounts.customers} customers across ${audienceCounts.installations} installations\n- **Top audience sectors:** ${list(audienceSectors)}\n- **Top audience platforms:** ${list(audiencePlatforms)}\n\n## Opportunity\n\n${angle}\n\n${direct}\n\n## Guardrails\n\n- Existing users are evidence of relevance, not new affiliate conversions.\n- A browser-visible script proves use, not payment or satisfaction.\n- Review marketing permission and suppression status before any customer communication.\n- Recheck programme terms and product fit immediately before publishing a recommendation.\n- Keep Multilingualizer and Multicurrencyalizer as the first-party commercial priority.\n`;
  const bodyWithPeers = body.replace('\n- **Top audience sectors:**', `\n- **Observed peer opportunity:** ${peerOpportunityCounts.customers} customers across ${peerOpportunityCounts.installations} installations\n- **Top peer opportunity groups:** ${list(peerOpportunityGroups)}\n- **Top audience sectors:**`);
  return { slug, name, kind, angle, currentCounts, audienceCounts, peerOpportunityCounts, peerOpportunityGroups, body: bodyWithPeers };
}

function run() {
  const database = openDatabase(process.argv[2] ? path.resolve(process.argv[2]) : undefined);
  fs.mkdirSync(OUTPUT, { recursive: true });
  const rendered = PROGRAMMES.map((programme) => renderProgramme(database, programme));
  const table = rendered.map(({ slug, name, kind, currentCounts, audienceCounts }) => `| [${name}](./${slug}.md) | ${kind === 'organic' ? 'Organic only' : audienceCounts.customers} | ${currentCounts.customers} |`).join('\n');
  const peerTable = rendered.map(({ slug, name, peerOpportunityCounts }) => `| [${name}](./${slug}.md) | ${peerOpportunityCounts.customers} |`).join('\n');
  const readme = `# Affiliate opportunities from customer intelligence\n\nGenerated: 21 August 2026\n\nThese files turn deterministic, customer-attributed technology evidence into aggregate opportunity segments. They contain no customer names, domains or contact details. Counts are unique paid customers unless explicitly described as installations.\n\n| Programme | Potential customer audience | Current users |\n|---|---:|---:|\n${table}\n\nPotential audiences are deliberately broad discovery filters. They are not recommendations, proof of eligibility, or permission to contact a customer. Open the local explorer and review individual evidence before using a segment.\n`;
  const readmeWithPeers = `${readme}\n## Observed peer opportunities\n\nThis is the narrower equivalent of the CookieYes exercise: technically relevant installations in the same sector and business-model peer groups as current attributed users.\n\n| Programme | Peer customers |\n|---|---:|\n${peerTable}\n`;
  fs.writeFileSync(path.join(OUTPUT, 'README.md'), readmeWithPeers);
  for (const item of rendered) fs.writeFileSync(path.join(OUTPUT, `${item.slug}.md`), item.body);
  const ranked = rendered.filter(({ kind, peerOpportunityCounts }) => kind !== 'organic' && peerOpportunityCounts.customers > 0).sort((left, right) => right.peerOpportunityCounts.customers - left.peerOpportunityCounts.customers || left.name.localeCompare(right.name));
  const findingsTable = ranked.map(({ slug, name, currentCounts, peerOpportunityCounts, peerOpportunityGroups }) => `| [${name}](./${slug}.md) | ${peerOpportunityCounts.customers} | ${currentCounts.customers} | ${list(peerOpportunityGroups)} |`).join('\n');
  const findings = `# Ranked customer-peer affiliate findings\n\nGenerated: 21 August 2026\n\nThis ranks the narrower peer opportunities, not the broader technical audiences. A peer is an active customer installation in the same deterministic sector and business-model group as a current attributed user, passing that programme's relevance rule and without the product detected. Counts are discovery evidence, not a recommendation score or contact permission.\n\n| Programme | Peer customers | Current users | Strongest matching peer groups |\n|---|---:|---:|---|\n${findingsTable}\n\n## Strongest themes\n\n- **Cross-platform widgets:** Elfsight has the largest observed peer set. The useful route is platform-and-sector tutorials for specific widgets, not a generic widget roundup.\n- **CRM and marketing:** HubSpot and Zoho have large peer sets among agencies, consultancies, software, education and professional services. Qualification matters because a browser crawl cannot prove CRM need.\n- **Translation alternatives:** Weglot has the strongest existing commercial fit. These audiences exclude current Multilingualizer detections and include only sites still showing another multilingual setup. Multilingualizer remains the first recommendation where it fits.\n- **Consent:** CookieYes and Usercentrics have substantial peer sets tied to detected analytics, advertising, embeds, forms or ecommerce scripts. CookieYes's eight current users produce 51 narrower peers.\n- **Squarespace enhancements:** Spark Plugin and Ghost Plugins map directly to the dominant customer platform. Review visible site needs before suggesting any specific enhancement.\n- **Behaviour analytics:** Hotjar's number is commercially interesting but belongs to a service/partner motion, not ordinary affiliate content.\n\nBefore customer communication, add marketing-permission and suppression data to the explorer. Until then, use these segments for research and content planning only.\n`;
  fs.writeFileSync(path.join(OUTPUT, 'priority-findings.md'), findings);
  database.close();
  console.log(`Wrote ${rendered.length} aggregate affiliate opportunity files to ${OUTPUT}`);
}

run();

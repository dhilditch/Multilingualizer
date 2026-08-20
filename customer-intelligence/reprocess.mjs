import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { openDatabase, transaction } from './lib/db.mjs';
import {
  classifyMultilingualizerEvidence,
  extractPage,
  summariseLanguageTechnology,
} from './lib/extract.mjs';
import { classifySite, detectSiteState } from './lib/enrichment.mjs';
import { DATA_ROOT } from './lib/paths.mjs';
import { detectTechnologies } from './lib/technology.mjs';

function parseArguments(argv) {
  const options = { database: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--database') options.database = path.resolve(argv[++index]);
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return options;
}

function retainedPath(relativePath) {
  const absolute = path.resolve(DATA_ROOT, relativePath);
  const allowedRoot = `${path.resolve(DATA_ROOT)}${path.sep}`;
  if (!absolute.startsWith(allowedRoot)) throw new Error(`Retained HTML path escaped the data directory: ${relativePath}`);
  return absolute;
}

function unique(values) {
  return [...new Set(values.flat())];
}

function run() {
  const options = parseArguments(process.argv.slice(2));
  const database = openDatabase(options.database ?? undefined);
  const sites = database.prepare('SELECT id,active FROM sites ORDER BY id').all();
  const pages = database.prepare(`
    SELECT p.* FROM pages p
    JOIN (
      SELECT site_id,page_kind,MAX(id) page_id
      FROM pages
      WHERE html_path IS NOT NULL
      GROUP BY site_id,page_kind
    ) latest ON latest.page_id=p.id
    ORDER BY p.site_id,p.page_kind
  `).all();
  const pagesBySite = new Map();
  for (const page of pages) {
    const absolute = retainedPath(page.html_path);
    if (!fs.existsSync(absolute)) continue;
    const values = pagesBySite.get(page.site_id) ?? [];
    const html = fs.readFileSync(absolute, 'utf8');
    const sourceUrl = page.final_url || page.requested_url;
    values.push({
      page,
      html,
      extracted: extractPage(html, sourceUrl, page.page_kind),
      technologies: detectTechnologies(html, sourceUrl, page.page_kind),
    });
    pagesBySite.set(page.site_id, values);
  }

  const update = database.prepare(`UPDATE sites SET
    multilingualizer_status=?, multilingualizer_evidence_json=?,
    multilingual_status=?, multilingual_tools_json=?, multilingual_evidence_json=?,
    site_state=?, parked_provider=?, sector=?, business_model=?, consent_use_case=?,
    peer_group=?, classification_confidence=?, classification_evidence_json=?
    WHERE id=?`);
  const deleteSignals = database.prepare("DELETE FROM signals WHERE site_id=? AND signal_type IN ('multilingualizer_marker','language_tool')");
  const insertSignal = database.prepare('INSERT OR IGNORE INTO signals (site_id,signal_type,value,source_url,confidence,evidence_method) VALUES (?,?,?,?,?,?)');
  const deleteTechnologies = database.prepare('DELETE FROM site_technologies WHERE site_id=?');
  const insertTechnology = database.prepare('INSERT OR IGNORE INTO site_technologies (site_id,name,category,host,evidence_type,evidence_value,source_url,page_kind,confidence,attributed_to_customer) VALUES (?,?,?,?,?,?,?,?,?,?)');
  const totals = { processed: 0, detected: 0, possible: 0, notDetected: 0, unknown: 0, parked: 0, classified: 0 };

  transaction(database, () => {
    for (const site of sites) {
      const retained = pagesBySite.get(site.id) ?? [];
      const hasCurrentHtml = site.active === 1 && retained.some(({ page }) => page.page_kind === 'home');
      const detections = retained.map(({ extracted }) => extracted.languageTechnology);
      const languageSummary = summariseLanguageTechnology(detections, hasCurrentHtml);
      const mlEvidence = unique(retained.map(({ extracted }) => extracted.multilingualizerEvidence));
      const mlStatus = hasCurrentHtml ? classifyMultilingualizerEvidence(mlEvidence) : 'unknown';
      const home = retained.find(({ page }) => page.page_kind === 'home');
      const about = retained.find(({ page }) => page.page_kind === 'about');
      const technologies = unique(retained.map((value) => value.technologies));
      const siteState = hasCurrentHtml
        ? detectSiteState({ html: home?.html ?? '', finalUrl: home?.page.final_url || home?.page.requested_url || '', technologies })
        : { state: 'unavailable', provider: '', evidence: [] };
      const classification = classifySite({
        title: home?.extracted.title ?? '',
        metaDescription: home?.extracted.metaDescription ?? '',
        siteName: home?.extracted.siteName ?? '',
        whatTheyDo: home?.extracted.whatTheyDo || about?.extracted.whatTheyDo || '',
        aboutText: about ? (about.extracted.paragraphs.join('\n\n') || about.extracted.textExcerpt).slice(0, 12_000) : '',
        productsServices: unique(retained.map(({ extracted }) => extracted.productsServices)),
        technologies,
        detectedPlatform: home?.extracted.platform || about?.extracted.platform || '',
        siteState: siteState.state,
      });
      update.run(
        mlStatus,
        JSON.stringify(mlEvidence),
        languageSummary.status,
        JSON.stringify(languageSummary.tools),
        JSON.stringify(languageSummary.evidence),
        siteState.state,
        siteState.provider,
        classification.sector,
        classification.businessModel,
        classification.consentUseCase,
        classification.peerGroup,
        classification.confidence,
        JSON.stringify([...siteState.evidence, ...classification.evidence]),
        site.id,
      );
      deleteSignals.run(site.id);
      deleteTechnologies.run(site.id);
      if (hasCurrentHtml) {
        for (const { page, extracted, technologies: pageTechnologies } of retained) {
          const sourceUrl = page.final_url || page.requested_url;
          const pageMlEvidence = extracted.multilingualizerEvidence;
          for (const marker of pageMlEvidence) {
            const confidence = marker === 'multilingualizer-name' || marker === 'changeLanguage' ? 60 : 98;
            insertSignal.run(site.id, 'multilingualizer_marker', marker, sourceUrl, confidence, 'retained-html-marker');
          }
          for (const evidence of extracted.languageTechnology.evidence) {
            insertSignal.run(site.id, 'language_tool', `${evidence.tool || 'Unidentified'}: ${evidence.marker}`, sourceUrl, evidence.confidence, 'retained-html-marker');
          }
          for (const technology of pageTechnologies) {
            insertTechnology.run(site.id, technology.name, technology.category, technology.host, technology.evidenceType, technology.evidenceValue, technology.sourceUrl, technology.pageKind, technology.confidence, siteState.state === 'parked' ? 0 : 1);
          }
        }
      }
      totals.processed += 1;
      if (siteState.state === 'parked') totals.parked += 1;
      if (classification.sector !== 'Unclassified' && classification.sector !== 'Parked domain') totals.classified += 1;
      if (languageSummary.status === 'detected') totals.detected += 1;
      else if (languageSummary.status === 'possible') totals.possible += 1;
      else if (languageSummary.status === 'not_detected') totals.notDetected += 1;
      else totals.unknown += 1;
    }
  });
  database.close();
  console.log(`Reprocessed ${totals.processed} installations: ${totals.detected} multilingual, ${totals.possible} possible, ${totals.notDetected} not detected, ${totals.unknown} unavailable; ${totals.parked} parked, ${totals.classified} sector-classified.`);
}

run();

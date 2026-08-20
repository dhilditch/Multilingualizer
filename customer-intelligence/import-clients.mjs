import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { openDatabase, transaction } from './lib/db.mjs';
import { parsePhpSerialized } from './lib/php-serialize.mjs';

function isoNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function normaliseDomain(value) {
  const raw = String(value ?? '').trim();
  if (!raw) throw new Error('Blank site URL');
  const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) {
    throw new Error(`Unsupported site URL: ${raw}`);
  }
  const domain = url.hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  if (!domain || !domain.includes('.')) throw new Error(`Invalid site domain: ${raw}`);
  return domain;
}

function moneyToMinor(value) {
  const match = String(value ?? '0').trim().match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) throw new Error(`Invalid money value: ${value}`);
  const minor = Number.parseInt(match[2], 10) * 100 + Number.parseInt((match[3] ?? '').padEnd(2, '0') || '0', 10);
  return match[1] ? -minor : minor;
}

function parseCurrencyTotals(value) {
  const totals = {};
  for (const item of String(value ?? '').split('|').filter(Boolean)) {
    const separator = item.indexOf(':');
    if (separator === -1) continue;
    const currency = item.slice(0, separator).trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) continue;
    totals[currency] = moneyToMinor(item.slice(separator + 1));
  }
  return totals;
}

function sqlResultObjects(payload) {
  if (!Array.isArray(payload.columns) || !Array.isArray(payload.rows)) {
    throw new Error('Input must be an SQL MCP result containing columns and rows');
  }
  return payload.rows.map((row) => Object.fromEntries(payload.columns.map((column, index) => [column, row[index]])));
}

function parseInstallations(row) {
  const serialized = `${row.websites_part_1 ?? ''}${row.websites_part_2 ?? ''}`;
  if (!serialized) return [];
  const expectedLength = Number.parseInt(row.websites_length ?? String(serialized.length), 10);
  if (Buffer.byteLength(serialized) !== expectedLength) {
    throw new Error(`Installation record for WordPress user ${row.wordpress_user_id} is incomplete`);
  }
  const parsed = parsePhpSerialized(serialized);
  if (!Array.isArray(parsed)) throw new Error(`Installation record for WordPress user ${row.wordpress_user_id} is not a list`);
  const sites = new Map();
  for (const [ordinal, installation] of parsed.entries()) {
    if (!installation || typeof installation !== 'object') continue;
    const suppliedUrl = String(installation.url ?? '').trim();
    if (!suppliedUrl) continue;
    let domain;
    try {
      domain = normaliseDomain(suppliedUrl);
    } catch {
      continue;
    }
    const languages = Array.isArray(installation.languages)
      ? [...new Set(installation.languages.map((language) => String(language).trim().toLowerCase()).filter(Boolean))]
      : [];
    if (!sites.has(domain)) {
      sites.set(domain, {
        domain,
        suppliedUrl,
        registeredPlatform: String(installation.platform ?? '').trim(),
        languages,
        ordinal,
      });
    }
  }
  return [...sites.values()];
}

export function importSqlResult(database, payload, sourceFile = 'stdin') {
  const rows = sqlResultObjects(payload);
  const importedAt = isoNow();
  const upsertClient = database.prepare(`
    INSERT INTO clients (
      source_key, wordpress_user_id, customer_name, email, company, country,
      paid_order_count, paid_total_minor, paid_totals_json, first_paid_order_at,
      last_paid_order_at, products_json, imported_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(source_key) DO UPDATE SET
      wordpress_user_id=excluded.wordpress_user_id,
      customer_name=excluded.customer_name,
      email=excluded.email,
      company=excluded.company,
      country=excluded.country,
      paid_order_count=excluded.paid_order_count,
      paid_total_minor=excluded.paid_total_minor,
      paid_totals_json=excluded.paid_totals_json,
      first_paid_order_at=excluded.first_paid_order_at,
      last_paid_order_at=excluded.last_paid_order_at,
      products_json=excluded.products_json,
      imported_at=excluded.imported_at
  `);
  const findClient = database.prepare('SELECT id FROM clients WHERE source_key = ?');
  const upsertSite = database.prepare(`
    INSERT INTO sites (
      client_id, domain, supplied_url, registered_platform,
      registered_languages_json, registration_ordinal
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(client_id, domain) DO UPDATE SET
      supplied_url=excluded.supplied_url,
      registered_platform=excluded.registered_platform,
      registered_languages_json=excluded.registered_languages_json,
      registration_ordinal=excluded.registration_ordinal
  `);
  const deleteSites = database.prepare('DELETE FROM sites WHERE client_id = ?');
  const deleteOtherSites = database.prepare(`DELETE FROM sites WHERE client_id = ? AND domain NOT IN (SELECT value FROM json_each(?))`);
  let siteCount = 0;
  let clientCount = 0;

  transaction(database, () => {
    for (const row of rows) {
      const userId = Number.parseInt(row.wordpress_user_id, 10);
      if (!Number.isInteger(userId) || userId <= 0) throw new Error(`Invalid WordPress user ID: ${row.wordpress_user_id}`);
      const sourceKey = `user:${userId}`;
      const products = String(row.products ?? '').split('|').map((value) => value.trim()).filter(Boolean).sort();
      const currencyTotals = parseCurrencyTotals(row.paid_totals);
      upsertClient.run(
        sourceKey,
        userId,
        String(row.customer_name ?? ''),
        String(row.email ?? '').trim().toLowerCase(),
        String(row.company ?? ''),
        String(row.country ?? ''),
        Number.parseInt(row.paid_order_count ?? '0', 10),
        Object.values(currencyTotals).reduce((sum, amount) => sum + amount, 0),
        JSON.stringify(currencyTotals),
        row.first_paid_order_at || null,
        row.last_paid_order_at || null,
        JSON.stringify(products),
        importedAt,
      );
      const clientId = findClient.get(sourceKey).id;
      const installations = parseInstallations(row);
      if (installations.length === 0) {
        deleteSites.run(clientId);
      } else {
        for (const installation of installations) {
          upsertSite.run(
            clientId,
            installation.domain,
            installation.suppliedUrl,
            installation.registeredPlatform,
            JSON.stringify(installation.languages),
            installation.ordinal,
          );
          siteCount += 1;
        }
        deleteOtherSites.run(clientId, JSON.stringify(installations.map(({ domain }) => domain)));
      }
      clientCount += 1;
    }
    database.prepare(`INSERT INTO imports (imported_at, source_file, source_sha256, source_rows) VALUES (?, ?, ?, ?)`)
      .run(importedAt, sourceFile, crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex'), rows.length);
  });
  return { clients: clientCount, installations: siteCount };
}

function parseArguments(argv) {
  const args = { input: null, database: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--database') args.database = argv[++index];
    else if (!args.input) args.input = argv[index];
    else throw new Error(`Unexpected argument: ${argv[index]}`);
  }
  if (!args.input) throw new Error('Usage: npm run clients:import -- <sql-result.json> [--database <path>]');
  return args;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArguments(process.argv.slice(2));
  const sourcePath = path.resolve(args.input);
  const payload = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const database = openDatabase(args.database ? path.resolve(args.database) : undefined);
  try {
    const result = importSqlResult(database, payload, sourcePath);
    console.log(`Imported ${result.clients} paid clients and ${result.installations} registered installations.`);
  } finally {
    database.close();
  }
}

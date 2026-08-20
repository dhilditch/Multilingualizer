import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_DATABASE, SCHEMA_PATH } from './paths.mjs';

export function openDatabase(databasePath = DEFAULT_DATABASE) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const siteColumns = new Set(database.prepare('PRAGMA table_info(sites)').all().map(({ name }) => name));
  const additions = [
    ['multilingual_status', "TEXT NOT NULL DEFAULT 'unknown'"],
    ['multilingual_tools_json', "TEXT NOT NULL DEFAULT '[]'"],
    ['multilingual_evidence_json', "TEXT NOT NULL DEFAULT '[]'"],
    ['site_state', "TEXT NOT NULL DEFAULT 'unknown'"],
    ['parked_provider', "TEXT NOT NULL DEFAULT ''"],
    ['sector', "TEXT NOT NULL DEFAULT ''"],
    ['business_model', "TEXT NOT NULL DEFAULT ''"],
    ['consent_use_case', "TEXT NOT NULL DEFAULT ''"],
    ['peer_group', "TEXT NOT NULL DEFAULT ''"],
    ['classification_confidence', 'INTEGER NOT NULL DEFAULT 0'],
    ['classification_evidence_json', "TEXT NOT NULL DEFAULT '[]'"],
  ];
  for (const [column, definition] of additions) {
    if (!siteColumns.has(column)) database.exec(`ALTER TABLE sites ADD COLUMN ${column} ${definition}`);
  }
  database.exec('CREATE INDEX IF NOT EXISTS sites_multilingual_status_idx ON sites(multilingual_status)');
  const technologyColumns = new Set(database.prepare('PRAGMA table_info(site_technologies)').all().map(({ name }) => name));
  if (!technologyColumns.has('attributed_to_customer')) database.exec('ALTER TABLE site_technologies ADD COLUMN attributed_to_customer INTEGER NOT NULL DEFAULT 1');
  database.exec('CREATE INDEX IF NOT EXISTS sites_enrichment_idx ON sites(site_state, sector, business_model, peer_group)');
  database.exec('PRAGMA foreign_keys = ON');
  return database;
}
export function transaction(database, callback) {
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = callback();
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

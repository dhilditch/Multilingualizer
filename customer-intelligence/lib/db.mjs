import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_DATABASE, SCHEMA_PATH } from './paths.mjs';

export function openDatabase(databasePath = DEFAULT_DATABASE) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
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

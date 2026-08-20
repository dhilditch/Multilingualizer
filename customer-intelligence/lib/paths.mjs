import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PROJECT_ROOT = path.resolve(TOOL_ROOT, '..');
export const DATA_ROOT = path.join(PROJECT_ROOT, 'data', 'customer-intelligence');
export const DEFAULT_DATABASE = path.join(DATA_ROOT, 'customer-intelligence.sqlite3');
export const HTML_ROOT = path.join(DATA_ROOT, 'html');
export const SCHEMA_PATH = path.join(TOOL_ROOT, 'schema.sql');

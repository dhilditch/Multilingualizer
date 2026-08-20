import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function readSiteConfig() {
  return JSON.parse(await fs.readFile(path.join(root, 'config/site.json'), 'utf8'));
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function shiftDate(date, days) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

export function reportingPeriods(lagDays = 3, periodDays = 28, now = new Date()) {
  const end = shiftDate(now, -lagDays);
  const start = shiftDate(end, -(periodDays - 1));
  const previousEnd = shiftDate(start, -1);
  const previousStart = shiftDate(previousEnd, -(periodDays - 1));
  return {
    current: { startDate: isoDate(start), endDate: isoDate(end) },
    previous: { startDate: isoDate(previousStart), endDate: isoDate(previousEnd) }
  };
}

export async function writeJson(relativePath, value) {
  const outputPath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`);
  return outputPath;
}

export async function writeText(relativePath, value) {
  const outputPath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, value);
  return outputPath;
}

export function csvCell(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows, columns) {
  return `${columns.join(',')}\n${rows.map((row) => columns.map((column) => csvCell(row[column])).join(',')).join('\n')}\n`;
}

export function requiredEnv(names) {
  const missing = names.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing environment variable${missing.length === 1 ? '' : 's'}: ${missing.join(', ')}`);
  }
}

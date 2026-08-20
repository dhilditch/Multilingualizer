import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from './common.mjs';

const queueDir = path.join(root, 'data/audit-queue');
const reportDir = path.join(root, 'data/audit-reports');
const outboxDir = path.join(root, 'data/audit-outbox');

async function ensureDirectories() {
  await Promise.all([queueDir, reportDir, outboxDir].map((directory) => fs.mkdir(directory, { recursive: true })));
}

function jobPath(id) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Invalid audit ID');
  return path.join(queueDir, `${id}.json`);
}

export async function createAuditJob({ email, url, destinationLanguages }) {
  await ensureDirectories();
  const id = crypto.randomUUID();
  const job = {
    id,
    status: 'queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email,
    url,
    destinationLanguages
  };
  await fs.writeFile(jobPath(id), `${JSON.stringify(job, null, 2)}\n`, { flag: 'wx' });
  return job;
}

export async function readAuditJob(id) {
  return JSON.parse(await fs.readFile(jobPath(id), 'utf8'));
}

export async function updateAuditJob(id, changes) {
  const job = await readAuditJob(id);
  const updated = { ...job, ...changes, id, updatedAt: new Date().toISOString() };
  await fs.writeFile(jobPath(id), `${JSON.stringify(updated, null, 2)}\n`);
  return updated;
}

export async function queuedAuditJobs(limit = 10) {
  await ensureDirectories();
  const files = (await fs.readdir(queueDir)).filter((file) => file.endsWith('.json')).sort();
  const jobs = [];
  for (const file of files) {
    const job = JSON.parse(await fs.readFile(path.join(queueDir, file), 'utf8'));
    if (job.status === 'queued') jobs.push(job);
    if (jobs.length >= limit) break;
  }
  return jobs;
}

export async function saveAuditReport(id, report) {
  await ensureDirectories();
  const output = path.join(reportDir, `${id}.json`);
  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  return output;
}

export async function saveAuditEmail(id, email) {
  await ensureDirectories();
  const output = path.join(outboxDir, `${id}.json`);
  await fs.writeFile(output, `${JSON.stringify(email, null, 2)}\n`);
  return output;
}

export function publicJob(job) {
  return {
    id: job.id,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    completedAt: job.completedAt || null,
    error: job.status === 'failed' ? job.error : undefined
  };
}

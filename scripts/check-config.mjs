import fs from 'node:fs/promises';
import path from 'node:path';
import { readSiteConfig, root } from './lib/common.mjs';

const config = await readSiteConfig();
const errors = [];

for (const key of ['siteName', 'baseUrl', 'sitemapUrl', 'searchConsoleSiteUrl']) {
  if (!config[key]) errors.push(`config/site.json is missing ${key}`);
}

for (const relativePath of ['.docs', 'content/briefs', 'content/drafts', 'content/published', 'outreach']) {
  try {
    const stat = await fs.stat(path.join(root, relativePath));
    if (!stat.isDirectory()) errors.push(`${relativePath} is not a directory`);
  } catch {
    errors.push(`${relativePath} does not exist`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Configuration valid for ${config.baseUrl}`);
}

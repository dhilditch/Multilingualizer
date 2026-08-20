import 'dotenv/config';
import { calculateWeglotPrice, readWeglotPricing } from '../scripts/lib/audit.mjs';
import { renderAuditEmail } from '../scripts/lib/audit-report.mjs';
import { queuedAuditJobs, saveAuditEmail, saveAuditReport, updateAuditJob } from '../scripts/lib/audit-store.mjs';
import { crawlWebsite } from '../scripts/lib/safe-crawl.mjs';

const pricing = await readWeglotPricing();
const jobs = await queuedAuditJobs(Number(process.env.AUDIT_WORKER_BATCH || 5));

for (const job of jobs) {
  console.log(`Processing audit ${job.id} for ${new URL(job.url).hostname}`);
  await updateAuditJob(job.id, { status: 'processing' });
  try {
    const report = await crawlWebsite(job.url, {
      maxPages: Number(process.env.AUDIT_MAX_PAGES || 25),
      maxAssetChecks: Number(process.env.AUDIT_MAX_ASSET_CHECKS || 50)
    });
    const price = calculateWeglotPrice(report.sourceWords, job.destinationLanguages, pricing, 'monthly');
    const email = {
      to: job.email,
      subject: `Your multilingual website audit for ${new URL(job.url).hostname}`,
      html: renderAuditEmail({
        report,
        price,
        weglotUrl: process.env.WEGLOT_AFFILIATE_URL || 'https://www.weglot.com/',
        multicurrencyUrl: process.env.MULTICURRENCYALIZER_URL || 'https://www.multilingualizer.com/product/multicurrencyalizer-3/'
      }),
      status: 'pending-provider',
      createdAt: new Date().toISOString()
    };
    await saveAuditReport(job.id, { report, price });
    await saveAuditEmail(job.id, email);
    await updateAuditJob(job.id, { status: 'complete', completedAt: new Date().toISOString() });
    console.log(`Completed audit ${job.id}; email is in the local outbox`);
  } catch (error) {
    await updateAuditJob(job.id, { status: 'failed', error: error.message });
    console.error(`Failed audit ${job.id}: ${error.message}`);
  }
}

if (!jobs.length) console.log('No queued audits');

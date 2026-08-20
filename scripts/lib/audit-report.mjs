function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function money(value, currency) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function renderAuditEmail({ report, price, weglotUrl, multicurrencyUrl }) {
  const plan = price.plan;
  const priceLine = plan
    ? `${plan.name}: ${money(plan.price, price.currency)} per ${plan.period}`
    : 'The site is above the published plan limits checked, so Weglot needs to confirm pricing.';
  const pageRows = report.pages.map((page) => (
    `<tr><td><a href="${escapeHtml(page.url)}">${escapeHtml(page.title || page.url)}</a></td><td>${page.estimatedSourceWords.toLocaleString('en-GB')}</td></tr>`
  )).join('');
  const tips = report.tips.length
    ? `<ul>${report.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>`
    : '<p>No basic technical problems were found in the pages checked.</p>';

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Your multilingual website audit</title></head>
<body style="font-family:Arial,sans-serif;color:#18221f;line-height:1.55;max-width:720px;margin:0 auto;padding:24px">
  <h1 style="font-size:28px">Your multilingual website audit</h1>
  <p>I checked ${report.pages.length} page${report.pages.length === 1 ? '' : 's'} and counted approximately <strong>${report.sourceWords.toLocaleString('en-GB')} source words</strong>.</p>
  <p>Across ${price.destinationLanguages} destination language${price.destinationLanguages === 1 ? '' : 's'}, Weglot would count approximately <strong>${price.translatedWords.toLocaleString('en-GB')} translated words</strong>.</p>
  <h2 style="font-size:21px">Estimated Weglot plan</h2>
  <p><strong>${escapeHtml(priceLine)}</strong></p>
  <p>This is an estimate based on public pages and pricing checked on ${escapeHtml(price.checkedAt)}. Weglot may detect text this crawler cannot see, including dynamic or account-only content.</p>
  <p><a href="${escapeHtml(weglotUrl)}" style="display:inline-block;background:#176b52;color:white;text-decoration:none;padding:12px 18px;border-radius:5px">Check the final price with Weglot</a></p>
  <h2 style="font-size:21px">Other things worth checking</h2>
  ${tips}
  ${report.pages.some((page) => page.hasCurrencySignals) ? `<p>If the site sells internationally, translating the text is only half the job. <a href="${escapeHtml(multicurrencyUrl)}">See the currency display options</a>.</p>` : ''}
  <h2 style="font-size:21px">Pages found</h2>
  <table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Page</th><th align="right">Estimated words</th></tr></thead><tbody>${pageRows}</tbody></table>
  ${report.truncated ? `<p><small>The audit stopped at its ${report.limits.maxPages}-page safety limit.</small></p>` : ''}
  <p>Cheers,<br>Dave</p>
</body></html>`;
}

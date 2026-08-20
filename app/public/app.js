const calculatorForm = document.querySelector('#calculator-form');
const calculatorResult = document.querySelector('#calculator-result');
const homepageForm = document.querySelector('#homepage-form');
const homepageResult = document.querySelector('#homepage-result');
const queueForm = document.querySelector('#queue-form');
const queueResult = document.querySelector('#queue-result');
const wordsField = document.querySelector('#words-field');
const textField = document.querySelector('#text-field');
let mode = 'words';
let auditedUrl = '';
let auditedLanguages = 1;

function escapeHtml(value) {
  const span = document.createElement('span');
  span.textContent = String(value ?? '');
  return span.innerHTML;
}

function number(value) {
  return new Intl.NumberFormat('en-GB').format(value);
}

function money(value, currency) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

async function api(path, payload) {
  const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || 'The request failed');
  return value;
}

function showError(target, error) {
  target.hidden = false;
  target.classList.add('error');
  target.innerHTML = `<h3>Could not complete that check</h3><p>${escapeHtml(error.message)}</p>`;
}

function priceHtml(price) {
  if (!price.plan) return `<h3>Custom quote needed</h3><p><span class="number">${number(price.translatedWords)}</span> translated words are above the published plan limits checked.</p>`;
  return `<h3>${escapeHtml(price.plan.name)} plan</h3>
    <p><span class="number">${money(price.plan.price, price.currency)}</span> per ${escapeHtml(price.plan.period)}</p>
    <p>${number(price.sourceWords)} source words × ${price.destinationLanguages} destination language${price.destinationLanguages === 1 ? '' : 's'} = <strong>${number(price.translatedWords)} translated words</strong>.</p>
    <p><small>Pricing checked ${escapeHtml(price.checkedAt)}.</small></p>`;
}

document.querySelectorAll('.mode').forEach((button) => button.addEventListener('click', () => {
  mode = button.dataset.mode;
  document.querySelectorAll('.mode').forEach((candidate) => candidate.classList.toggle('active', candidate === button));
  wordsField.hidden = mode !== 'words';
  textField.hidden = mode !== 'text';
  calculatorForm.elements.words.required = mode === 'words';
  calculatorForm.elements.text.required = mode === 'text';
}));

calculatorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = calculatorForm.querySelector('[type="submit"]');
  button.disabled = true;
  calculatorResult.classList.remove('error');
  try {
    const form = new FormData(calculatorForm);
    const payload = { languages: Number(form.get('languages')), billing: form.get('billing') };
    payload[mode] = mode === 'words' ? Number(form.get('words')) : form.get('text');
    const result = await api('/api/calculate', payload);
    calculatorResult.hidden = false;
    calculatorResult.innerHTML = priceHtml(result);
  } catch (error) { showError(calculatorResult, error); }
  finally { button.disabled = false; }
});

homepageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = homepageForm.querySelector('[type="submit"]');
  button.disabled = true;
  homepageResult.classList.remove('error');
  queueForm.hidden = true;
  try {
    const form = new FormData(homepageForm);
    const result = await api('/api/homepage-audit', {
      url: form.get('url'), languages: Number(form.get('languages')), billing: form.get('billing')
    });
    auditedUrl = result.homepage.url;
    auditedLanguages = result.price.destinationLanguages;
    homepageResult.hidden = false;
    homepageResult.innerHTML = `${priceHtml(result.price)}
      <p>Homepage title: <strong>${escapeHtml(result.homepage.title || 'Missing')}</strong></p>
      <p>${result.homepage.linkCount} links and ${result.homepage.imageCount} images detected. ${result.homepage.contactSignals.emailCount || result.homepage.contactSignals.phoneCount ? 'Public contact links were found.' : 'No public email or telephone links were found.'}</p>`;
    queueForm.hidden = false;
  } catch (error) { showError(homepageResult, error); }
  finally { button.disabled = false; }
});

queueForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = queueForm.querySelector('[type="submit"]');
  button.disabled = true;
  queueResult.classList.remove('error');
  try {
    const form = new FormData(queueForm);
    const job = await api('/api/queue-audit', {
      url: auditedUrl,
      email: form.get('email'),
      languages: auditedLanguages,
      consent: form.get('consent') === 'on'
    });
    queueResult.hidden = false;
    queueResult.innerHTML = `<h3>Audit queued</h3><p>Your audit reference is <code>${escapeHtml(job.id)}</code>. The report will be prepared for the email address supplied.</p>`;
    queueForm.hidden = true;
  } catch (error) { showError(queueResult, error); }
  finally { button.disabled = false; }
});

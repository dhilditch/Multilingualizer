(() => {
  const root = document.querySelector('[data-msa-calculator]');
  if (!root || !window.msaCalculator) return;
  const form = root.querySelector('[data-form]');
  const result = root.querySelector('[data-result]');
  const queue = root.querySelector('[data-queue]');
  const queueResult = root.querySelector('[data-queue-result]');
  let mode = 'words';

  const escape = (value) => {
    const node = document.createElement('span');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };
  const number = (value) => new Intl.NumberFormat('en-GB').format(value);
  const money = (value) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  root.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    root.querySelectorAll('[data-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
    root.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== mode; });
    queue.hidden = true;
    result.hidden = true;
  }));

  async function request(action, values) {
    values.set('action', action);
    const response = await fetch(msaCalculator.ajaxUrl, { method: 'POST', body: values, credentials: 'same-origin' });
    const body = await response.json();
    if (!response.ok || !body.success) throw new Error(body.data?.message || 'The request failed.');
    return body.data;
  }

  function showPrice(price, prefix = '') {
    const summary = price.plan
      ? `<h3>${escape(price.plan.name)} plan</h3><p class="msa__price">${money(price.plan.price)} per ${escape(price.plan.period)}</p>`
      : '<h3>Custom quote needed</h3><p>Your estimate is above the published plan limits.</p>';
    result.classList.remove('is-error');
    result.innerHTML = `${prefix}${summary}<p>${number(price.source_words)} source words × ${price.destination_languages} destination language${price.destination_languages === 1 ? '' : 's'} = <strong>${number(price.translated_words)} translated words</strong>.</p><p><a class="msa__button" href="${escape(msaCalculator.affiliateUrl)}" rel="sponsored noopener">Check the current Weglot plan</a></p>`;
    result.hidden = false;
  }

  function error(target, message) {
    target.classList.add('is-error');
    target.innerHTML = `<p>${escape(message)}</p>`;
    target.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    queue.hidden = true;
    try {
      const values = new FormData(form);
      if (mode === 'words') values.delete('text');
      if (mode === 'text') values.delete('words');
      if (mode === 'url') {
        const data = await request('msa_homepage', values);
        showPrice(data.price, `<p><strong>${escape(data.homepage.title || 'Untitled homepage')}</strong></p><p>We found about ${number(data.homepage.estimated_source_words)} source words, ${number(data.homepage.link_count)} links and ${number(data.homepage.image_count)} images on this homepage.</p>`);
        queue.hidden = false;
      } else {
        showPrice(await request('msa_calculate', values));
      }
    } catch (caught) {
      error(result, caught.message);
    } finally {
      button.disabled = false;
    }
  });

  queue.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = new FormData(queue);
    const source = new FormData(form);
    values.set('url', source.get('url'));
    values.set('languages', source.get('languages'));
    const button = queue.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const data = await request('msa_queue', values);
      queueResult.classList.remove('is-error');
      queueResult.innerHTML = `<p><strong>Audit queued.</strong> Reference: <code>${escape(data.job_id)}</code>. Check your inbox shortly.</p>`;
    } catch (caught) {
      error(queueResult, caught.message);
    } finally {
      button.disabled = false;
    }
  });
})();

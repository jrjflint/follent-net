import { submitFormspark } from './form-provider.js';
const form = document.querySelector('#enquiry-form');
if (form) {
  const queryField = form.dataset.queryField ? form.elements.namedItem(form.dataset.queryField) : null;
  const selected = form.dataset.queryField ? new URLSearchParams(location.search).get(form.dataset.queryField) : null;
  if (queryField instanceof HTMLSelectElement && selected !== null && Array.from(queryField.options).some(option => option.value === selected)) queryField.value = selected;
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const originalButton = button.innerHTML;
  const conditionalField = form.dataset.conditionalField ? form.elements.namedItem(form.dataset.conditionalField) : null;
  const controller = form.dataset.conditionController ? form.elements.namedItem(form.dataset.conditionController) : null;
  if (conditionalField && controller) {
    const updateConditional = () => {
      const hide = controller.value === form.dataset.conditionValue && !conditionalField.value;
      conditionalField.closest('.field').hidden = hide;
      conditionalField.disabled = hide || form.dataset.enabled !== 'true';
    };
    controller.addEventListener('change', updateConditional);
    updateConditional();
  }
  let pending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || form.dataset.enabled !== 'true') return;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) { status.textContent = 'Submission could not be verified. Please use a contact link.'; status.focus(); return; }
    const turnstile = form.querySelector('.cf-turnstile');
    if (turnstile && !data['cf-turnstile-response']) { status.textContent = 'Please complete the spam verification before sending.'; status.focus(); return; }
    // Redirect controls belong to the native HTML path, not the AJAX payload.
    delete data._redirect; delete data._error; delete data._append;
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your enquiry…';
    try {
      await submitFormspark(form.action, data);
      const analyticsField = form.dataset.analyticsField ? form.elements.namedItem(form.dataset.analyticsField) : null;
      const submittedSelection = analyticsField ? data[analyticsField.name] : '';
      const selection = analyticsField instanceof HTMLSelectElement && Array.from(analyticsField.options).some(option => option.value === submittedSelection) ? submittedSelection : '';
      if (typeof window.siteTrack === 'function') window.siteTrack('generate_lead', { package: selection || 'unspecified' });
      location.assign(form.dataset.success);
    } catch {
      status.textContent = 'We could not confirm your enquiry was received. Your details are still here. Check your connection and try again, or use a contact link. A retry may send a duplicate if the connection dropped after delivery.';
      status.focus();
      if (turnstile && window.turnstile) window.turnstile.reset();
    } finally {
      pending = false;
      button.disabled = false;
      button.innerHTML = originalButton;
      form.removeAttribute('aria-busy');
    }
  });
}

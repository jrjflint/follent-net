import { submitFormspark } from './form-provider.js';
import { initVerification } from './form-verification.js';
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
  const verification = initVerification(form);
  form.addEventListener('verification-ready', () => {
    if (!pending && status.dataset.verification === 'required') { status.textContent = ''; delete status.dataset.verification; }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || form.dataset.enabled !== 'true') return;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) { status.textContent = 'Submission could not be verified. Please use a contact link.'; status.focus(); return; }
    const turnstile = form.querySelector('.cf-turnstile');
    if (turnstile && !data['cf-turnstile-response']) { status.dataset.verification = 'required'; status.textContent = 'Please complete the spam verification before sending. If it is unavailable, retry verification; direct contact availability is shown below.'; status.focus(); return; }
    // Redirect controls belong to the native HTML path, not the AJAX payload.
    delete data._redirect; delete data._error; delete data._append;
    pending = true;
    delete status.dataset.verification;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    form.dispatchEvent(new Event('verification-pending'));
    status.textContent = 'Sending your enquiry…';
    let failed = false;
    try {
      await submitFormspark(form.action, data);
      const analyticsField = form.dataset.analyticsField ? form.elements.namedItem(form.dataset.analyticsField) : null;
      const submittedSelection = analyticsField ? data[analyticsField.name] : '';
      const selection = analyticsField instanceof HTMLSelectElement && Array.from(analyticsField.options).some(option => option.value === submittedSelection) ? submittedSelection : '';
      // Give the optional tag time to dispatch before navigation. Tracking failure
      // must never turn an accepted enquiry into a submission error.
      try {
        if (typeof window.siteTrack === 'function') await window.siteTrack('generate_lead', { package: selection || 'unspecified' });
      } catch { /* The enquiry was accepted even if analytics is unavailable. */ }
      location.assign(form.dataset.success);
    } catch {
      failed = true;
      status.textContent = 'We could not confirm your enquiry was received. Your details are still here. Check your connection and try again, or use a contact link. A retry may send a duplicate if the connection dropped after delivery.';
      status.focus();
    } finally {
      pending = false;
      button.disabled = false;
      button.innerHTML = originalButton;
      form.removeAttribute('aria-busy');
      form.dispatchEvent(new Event('verification-pending'));
      if (failed) verification?.reset();
    }
  });
}

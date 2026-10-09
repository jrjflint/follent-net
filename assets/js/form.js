import { submitFormspark } from './form-provider.js';
const form = document.querySelector('#enquiry-form');
if (form) {
  const packageField = form.elements.namedItem('package');
  const selected = new URLSearchParams(location.search).get('package');
  if (selected !== null && Array.from(packageField.options).some(option => option.value === selected)) packageField.value = selected;
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const originalButton = button.innerHTML;
  const needField = form.elements.namedItem('need');
  const websiteField = form.elements.namedItem('website');
  const updateWebsite = () => {
    const hide = needField.value === 'A new website' && !websiteField.value;
    websiteField.closest('.field').hidden = hide;
    websiteField.disabled = hide || form.dataset.enabled !== 'true';
  };
  needField.addEventListener('change', updateWebsite);
  updateWebsite();
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
      if (typeof window.follentTrack === 'function') window.follentTrack('generate_lead', { package: data.package || 'unspecified' });
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

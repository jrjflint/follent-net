// Progressive enhancement only. Formspark remains responsible for validating the token.
export function initVerification(form) {
  const container = form.querySelector('.cf-turnstile');
  if (form.dataset.enabled !== 'true' || !container) return null;
  const status = form.querySelector('[data-verification-status]');
  const retry = form.querySelector('[data-verification-retry]');
  let widget = null;
  let script;
  let timer;
  let attempt = 0;
  const busy = () => form.getAttribute('aria-busy') === 'true';
  const recovery = form.parentElement.querySelector('.form-contact a') ? 'Retry verification or use a contact option below.' : 'Retry verification. Your details are still here.';
  const state = (name, message) => {
    container.dataset.state = name;
    status.textContent = message;
    retry.hidden = !['error', 'expired', 'timeout'].includes(name);
    if (name === 'ready') form.dispatchEvent(new Event('verification-ready'));
  };
  const unavailable = () => state('error', `Spam verification is unavailable. ${recovery}`);
  const clearToken = () => {
    const field = form.elements.namedItem('cf-turnstile-response');
    if (field) field.value = '';
  };
  function reset() {
    if (busy()) return;
    clearToken();
    state('loading', 'Checking spam protection…');
    if (widget !== null && window.turnstile) {
      try { window.turnstile.reset(widget); } catch { unavailable(); }
    } else load();
  }
  function render() {
    clearTimeout(timer);
    try {
      widget = window.turnstile.render(container, {
        sitekey: container.dataset.sitekey,
        size: 'compact',
        callback: () => state('ready', 'Spam verification complete.'),
        'error-callback': () => { clearToken(); unavailable(); return true; },
        'expired-callback': () => { clearToken(); state('expired', 'Spam verification expired. Retry verification before sending.'); },
        'timeout-callback': () => { clearToken(); state('timeout', `Spam verification timed out. ${recovery}`); }
      });
    } catch { unavailable(); }
  }
  function load() {
    if (busy()) return;
    const current = ++attempt;
    clearTimeout(timer);
    state('loading', 'Loading spam verification…');
    if (window.turnstile?.render) { render(); return; }
    script?.remove();
    script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.addEventListener('load', () => { if (current === attempt) render(); });
    script.addEventListener('error', () => { if (current === attempt) { clearTimeout(timer); unavailable(); } });
    // A blocked request may not dispatch an error promptly. Late success can still recover.
    timer = setTimeout(() => { if (current === attempt) unavailable(); }, 15000);
    document.head.append(script);
  }
  retry.addEventListener('click', () => { reset(); status.focus(); });
  form.addEventListener('verification-pending', () => { retry.disabled = busy(); });
  load();
  return { reset };
}

// Basic consent mode: no Google request before explicit opt-in.
// Run early in head; bind preference controls once HTML is available.
(() => {
  const id = document.currentScript.dataset.analyticsId;
  const container = document.currentScript.dataset.tagManagerId;
  const key = 'website-analytics-preference';
  const blocked = () => navigator.globalPrivacyControl || navigator.doNotTrack === '1';
  const stored = () => { try { return localStorage.getItem(key); } catch { return null; } };
  let preference = stored();
  // Reserve the in-flow prompt before first paint, without enabling tracking.
  if (!preference && !blocked()) document.documentElement.dataset.analyticsPrompt = 'pending';
  let loaded = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function activate() {
    if (loaded || (!id && !container) || blocked()) return;
    loaded = true;
    if (id) window[`ga-disable-${id}`] = false;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* No valid referrer. */ }
    const page = { page_location: location.origin + location.pathname, page_referrer: referrer };
    const script = document.createElement('script');
    if (container) {
      // Container tags must use these sanitised variables rather than Page URL.
      window.dataLayer.push({ ...page, 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(container)}`;
    } else {
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: true, ...page });
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    }
    script.async = true;
    document.head.append(script);
  }
  window.siteTrack = (event, params) => {
    if (!loaded || preference !== 'allow' || blocked() || event !== 'generate_lead') return;
    const selection = { package: params.package };
    return new Promise(resolve => {
      const timer = setTimeout(resolve, 800);
      const done = () => { clearTimeout(timer); resolve(); };
      if (container) window.dataLayer.push({ event, ...selection, eventCallback: done, eventTimeout: 800 });
      else window.gtag('event', event, { ...selection, event_callback: done, event_timeout: 800 });
    });
  };
  if (preference === 'allow') activate();
  document.addEventListener('DOMContentLoaded', () => {
    const notice = document.querySelector('.analytics-notice');
    if (!notice) return;
    if (!preference && !blocked()) notice.hidden = false;
    delete document.documentElement.dataset.analyticsPrompt;
    document.querySelectorAll('[data-analytics-choice]').forEach(button => button.addEventListener('click', () => {
      preference = button.dataset.analyticsChoice;
      try { localStorage.setItem(key, preference); } catch { /* Navigation works without storage. */ }
      notice.hidden = true;
      if (preference === 'allow') activate();
      else {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
        if (id) window[`ga-disable-${id}`] = true;
        if (loaded) location.reload();
      }
    }));
    document.querySelectorAll('[data-analytics-settings]').forEach(button => button.addEventListener('click', () => { notice.hidden = false; notice.querySelector('button').focus(); }));
  });
})();

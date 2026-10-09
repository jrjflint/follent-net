// No GA script or request before explicit opt-in. No form contents in events.
const id = document.body.dataset.analyticsId;
const notice = document.querySelector('.analytics-notice');
const key = 'website-analytics-preference';
let loaded = false;
const stored = () => { try { return localStorage.getItem(key); } catch { return null; } };
let preference = stored();
function activate() {
  if (loaded || !id || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  loaded = true;
  window[`ga-disable-${id}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  let referrer = '';
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* No valid referrer. */ }
  window.gtag('config', id, { send_page_view: true, page_location: location.origin + location.pathname, page_referrer: referrer });
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.async = true;
  document.head.append(script);
}
window.follentTrack = (event, params) => { if (loaded && preference === 'allow') window.gtag('event', event, params); };
if (id && notice) {
  if (stored() === 'allow') activate();
  else if (!stored() && !navigator.globalPrivacyControl && navigator.doNotTrack !== '1') notice.hidden = false;
  document.querySelectorAll('[data-analytics-choice]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.analyticsChoice;
    preference = choice;
    try { localStorage.setItem(key, choice); } catch { /* A denied storage API does not break navigation. */ }
    notice.hidden = true;
    if (choice === 'allow') activate();
    else { window[`ga-disable-${id}`] = true; if (loaded) location.reload(); }
  }));
  document.querySelectorAll('[data-analytics-settings]').forEach(button => button.addEventListener('click', () => { notice.hidden = false; notice.querySelector('button').focus(); }));
}

import { safeURL } from './html.mjs';

// Small explicit checks for the existing public config, not a schema framework.
export function validateConfig(site) {
  const object = (value, key) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${key} must be an object`);
  };
  const string = (value, key, { empty = true } = {}) => {
    if (typeof value !== 'string' || (!empty && !value.trim())) throw new Error(`${key} must be ${empty ? 'a string' : 'a non-empty string'}`);
  };
  const boolean = (value, key) => { if (typeof value !== 'boolean') throw new Error(`${key} must be a boolean`); };
  const array = (value, key) => { if (!Array.isArray(value)) throw new Error(`${key} must be an array`); };
  const url = (value, key) => {
    string(value, key);
    if (value) {
      try {
        safeURL(value);
        if (value.startsWith('https://')) {
          const parsed = new URL(value);
          if (!parsed.hostname || parsed.username || parsed.password) throw new Error('Invalid HTTPS destination');
        }
      } catch { throw new Error(`${key} must use an allowed URL`); }
    }
  };
  object(site, 'config');
  for (const key of ['brand', 'address', 'primaryCTA', 'secondaryCTA', 'form', 'analytics', 'privacy', 'launch']) object(site[key], key);
  for (const key of ['businessName', 'wordmark', 'tagline', 'description', 'domain', 'package']) string(site[key], key, { empty: false });
  for (const key of ['legalName', 'abn', 'phone', 'email', 'serviceArea', 'bookingURL', 'googleBusinessProfileURL']) string(site[key], key);
  if (site.schemaType !== undefined && (typeof site.schemaType !== 'string' || !/^[A-Z][A-Za-z0-9]*$/.test(site.schemaType))) throw new Error('schemaType must be a simple Schema.org type token');
  if (!['essential', 'professional', 'growth'].includes(site.package)) throw new Error('Unknown package');
  let domain;
  try { domain = new URL(site.domain); } catch { throw new Error('domain must be an HTTPS origin'); }
  if (domain.protocol !== 'https:' || domain.pathname !== '/' || domain.search || domain.hash || domain.username || domain.password) throw new Error('domain must be an HTTPS origin');
  site.domain = domain.origin;
  for (const key of ['ivory', 'noir', 'bordeaux']) {
    string(site.brand[key], `brand.${key}`);
    if (!/^#[\da-f]{6}$/i.test(site.brand[key])) throw new Error(`brand.${key} must use six-digit hex`);
  }
  for (const key of ['street', 'suburb', 'city', 'state', 'postcode', 'country']) string(site.address[key], `address.${key}`);
  for (const key of ['primaryCTA', 'secondaryCTA']) {
    string(site[key].label, `${key}.label`, { empty: false });
    string(site[key].href, `${key}.href`, { empty: false });
    url(site[key].href, `${key}.href`);
  }
  array(site.socialURLs, 'socialURLs');
  site.socialURLs.forEach((value, i) => url(value, `socialURLs[${i}]`));
  url(site.bookingURL, 'bookingURL');
  url(site.googleBusinessProfileURL, 'googleBusinessProfileURL');
  if (!Number.isInteger(site.copyrightYear) || site.copyrightYear < 2000) throw new Error('copyrightYear must be a year integer');
  for (const key of ['endpoint', 'turnstileSiteKey', 'externalURL']) string(site.form[key], `form.${key}`);
  if (!['formspark', 'external'].includes(site.form.provider)) throw new Error('Supported form providers: formspark or external');
  if (site.form.formtrackEnabled !== undefined) boolean(site.form.formtrackEnabled, 'form.formtrackEnabled');
  if (site.form.endpoint && !/^https:\/\/submit-form\.com\/[a-zA-Z0-9_-]+$/.test(site.form.endpoint)) throw new Error('Use a valid Formspark HTTPS endpoint');
  if (site.form.externalURL) { url(site.form.externalURL, 'form.externalURL'); if (!/^https:\/\//.test(site.form.externalURL)) throw new Error('External forms require HTTPS'); }
  for (const key of ['measurementId', 'searchConsoleVerification']) string(site.analytics[key], `analytics.${key}`);
  if (site.analytics.measurementId && !/^G-[A-Z0-9]+$/.test(site.analytics.measurementId)) throw new Error('Use a valid GA4 measurement ID');
  for (const key of ['approved']) boolean(site.privacy[key], `privacy.${key}`);
  for (const key of ['contactEmail', 'retention']) string(site.privacy[key], `privacy.${key}`);
  for (const [value, key] of [[site.email, 'email'], [site.privacy.contactEmail, 'privacy.contactEmail']]) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error(`${key} must be a valid email address`);
  }
  if (site.privacy.policy !== undefined && !['follent', 'client'].includes(site.privacy.policy)) throw new Error('privacy.policy must be follent or client');
  for (const key of ['migrationReviewed', 'businessDetailsReviewed']) boolean(site.launch[key], `launch.${key}`);
  array(site.redirects, 'redirects');
  site.redirects.forEach((redirect, i) => {
    const key = `redirects[${i}]`;
    object(redirect, key);
    string(redirect.from, `${key}.from`);
    string(redirect.to, `${key}.to`);
    boolean(redirect.reviewed, `${key}.reviewed`);
    if (!redirect.reviewed || !/^\/(?!\/)[^\s?#]*$/.test(redirect.from) || ![301, 302].includes(redirect.status)) throw new Error(`${key} needs reviewed=true, a path and status 301 or 302`);
    url(redirect.to, `${key}.to`);
    if (/\s/.test(redirect.to) || redirect.from === redirect.to || !redirect.to) throw new Error(`${key} has an invalid redirect destination`);
  });
  return site;
}

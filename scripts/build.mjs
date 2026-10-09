import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { document } from '../src/layouts/document.mjs';
import { pageDefinitions } from '../src/pages/content.mjs';
import { escapeHTML, safeURL } from '../src/lib/html.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function loadConfig(filename = 'config/site.json') {
  const s = JSON.parse(await readFile(path.resolve(root, filename), 'utf8'));
  if (!['essential', 'professional', 'growth'].includes(s.package)) throw new Error('Unknown package');
  const domain = new URL(s.domain);
  if (domain.protocol !== 'https:' || domain.pathname !== '/' || domain.search || domain.hash) throw new Error('domain must be an HTTPS origin');
  s.domain = domain.origin;
  for (const value of Object.values(s.brand)) if (!/^#[\da-f]{6}$/i.test(value)) throw new Error('Brand colours must use six-digit hex');
  for (const url of [s.primaryCTA.href, s.secondaryCTA.href, s.bookingURL, s.googleBusinessProfileURL, s.form.externalURL, ...s.socialURLs].filter(Boolean)) safeURL(url);
  if (!['formspark', 'external'].includes(s.form.provider)) throw new Error('Supported form providers: formspark or external');
  if (s.form.formtrackEnabled !== undefined && typeof s.form.formtrackEnabled !== 'boolean') throw new Error('form.formtrackEnabled must be a boolean');
  if (s.form.endpoint && !/^https:\/\/submit-form\.com\/[a-zA-Z0-9_-]+$/.test(s.form.endpoint)) throw new Error('Use a valid Formspark HTTPS endpoint');
  if (s.analytics.measurementId && !/^G-[A-Z0-9]+$/.test(s.analytics.measurementId)) throw new Error('Use a valid GA4 measurement ID');
  if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) throw new Error('Invalid business email');
  if (s.form.externalURL && !/^https:\/\//.test(s.form.externalURL)) throw new Error('External forms require HTTPS');
  return s;
}
export function context(site, { preview = false } = {}) {
  const isEssential = site.package === 'essential';
  const route = slug => isEssential && !['privacy', 'success', 'form-error', '404'].includes(slug) ? `/#${slug === 'how-it-works' ? 'process' : slug === 'about' ? 'examples' : slug}` : slug ? `/${slug}/` : '/';
  const adapt = href => isEssential && /^\/(services|pricing|how-it-works|about|contact)\/$/.test(href) ? route(href.split('/')[1]) : href;
  const configured = site.form.endpoint && !/FORM_ID|PLACEHOLDER/i.test(site.form.endpoint);
  const formEnabled = Boolean(!preview && site.package === 'growth' && site.form.provider === 'formspark' && configured && site.privacy.approved && (site.privacy.contactEmail || site.email) && site.privacy.retention);
  return {
    site, isEssential, route, preview,
    primaryHref: adapt(site.primaryCTA.href), secondaryHref: adapt(site.secondaryCTA.href),
    contactURL: id => isEssential ? '/#contact' : `/contact/?package=${id}`,
    formEnabled,
    formtrackEnabled: formEnabled && site.form.formtrackEnabled === true,
    analyticsEnabled: Boolean(!preview && site.package !== 'essential' && site.analytics.measurementId)
  };
}
export function headers(ctx, hashes) {
  const scripts = ["'self'", ...hashes];
  const connect = ["'self'"];
  const images = ["'self'", 'data:'];
  const frames = ["'none'"];
  if (ctx.formEnabled) connect.push('https://submit-form.com');
  // Allow the requested package entry point, not every script on the CDN.
  // CSP permits the package's versioned destination after the CDN redirect.
  if (ctx.formtrackEnabled) scripts.push('https://unpkg.com/@formspark/formtrack');
  if (ctx.formEnabled && ctx.site.form.turnstileSiteKey) { scripts.push('https://challenges.cloudflare.com'); frames.splice(0, 1, 'https://challenges.cloudflare.com'); connect.push('https://challenges.cloudflare.com'); }
  if (ctx.analyticsEnabled) { scripts.push('https://www.googletagmanager.com'); connect.push('https://*.google-analytics.com', 'https://www.googletagmanager.com'); images.push('https://*.google-analytics.com', 'https://www.googletagmanager.com'); }
  const csp = `default-src 'self'; base-uri 'self'; object-src 'none'; script-src ${scripts.join(' ')}; style-src 'self'; font-src 'self'; img-src ${images.join(' ')}; connect-src ${connect.join(' ')}; frame-src ${frames.join(' ')}; frame-ancestors 'none'; form-action 'self'${ctx.formEnabled ? ' https://submit-form.com' : ''}; upgrade-insecure-requests`;
  return `/*\n  Content-Security-Policy: ${csp}\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n${ctx.preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}\n/assets/*\n  Cache-Control: public, max-age=3600\n\n/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/success/*\n  X-Robots-Tag: noindex\n\n/form-error/*\n  X-Robots-Tag: noindex\n`;
}
export async function build({ configFile = 'config/site.json', output = 'dist', preview = false, packageOverride } = {}) {
  const site = await loadConfig(configFile);
  if (packageOverride) {
    if (!['essential', 'professional', 'growth'].includes(packageOverride)) throw new Error('Invalid package override');
    site.package = packageOverride;
  }
  const ctx = context(site, { preview });
  const out = path.resolve(root, output);
  // Never delete source or a computed path outside the designated generated trees.
  const rel = path.relative(root, out);
  if (!(rel === 'dist' || rel.startsWith(`.qa${path.sep}`)) || rel.includes('..')) throw new Error('Output must be dist or a child of .qa');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
  await writeFile(path.join(out, 'assets/css/brand.css'), `:root{--ivory:${site.brand.ivory};--noir:${site.brand.noir};--bordeaux:${site.brand.bordeaux}}\n`);
  const selected = pageDefinitions.filter(p => !ctx.isEssential || ['', 'privacy', '404'].includes(p.slug));
  const hashes = new Set();
  for (const page of selected) {
    const html = document(page, ctx);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
    const filename = page.slug === '404' ? path.join(out, '404.html') : path.join(out, page.slug, 'index.html');
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, html);
  }
  const urls = selected.filter(p => !p.noindex).map(p => `${site.domain}/${p.slug ? `${p.slug}/` : ''}`);
  await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escapeHTML(url)}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(path.join(out, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
  await writeFile(path.join(out, '_headers'), headers(ctx, hashes));
  const redirects = site.redirects.map(r => {
    if (!r.reviewed || !/^\/(?!\/)[^\s?#]*$/.test(r.from) || ![301, 302].includes(r.status)) throw new Error('Redirects need reviewed=true, a path and status 301 or 302');
    safeURL(r.to);
    if (/\s/.test(r.to) || r.from === r.to) throw new Error('Invalid redirect destination');
    return `${r.from} ${r.to} ${r.status}`;
  });
  await writeFile(path.join(out, '_redirects'), `# Only reviewed migration mappings are emitted.\n${redirects.join('\n')}\n`);
  await writeFile(path.join(out, 'build-info.json'), JSON.stringify({ package: site.package, preview, pages: selected.map(p => p.slug), formEnabled: ctx.formEnabled, analyticsEnabled: ctx.analyticsEnabled }, null, 2));
  return { out, pages: selected.length, ctx };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const value = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
  const isPreview = args.includes('--preview') || (process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH !== 'main');
  const result = await build({ output: value('--out') || 'dist', configFile: value('--config') || 'config/site.json', preview: isPreview, packageOverride: value('--package') });
  console.log(`Built ${result.pages} pages (${result.ctx.site.package}) → ${path.relative(root, result.out)}${isPreview ? ' [preview: forms and analytics off]' : ''}`);
  if (!result.ctx.formEnabled && result.ctx.site.package === 'growth') console.log('Setup: enquiry submission disabled until endpoint and reviewed privacy details are supplied.');
}

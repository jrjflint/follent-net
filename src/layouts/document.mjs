import { escapeHTML as e, jsonScript } from '../lib/html.mjs';
import { button, contactDetails } from '../partials/components.mjs';

export function schemaFor(page, ctx) {
  const s = ctx.site;
  const business = { '@type': 'ProfessionalService', '@id': `${s.domain}/#business`, name: s.businessName, url: s.domain, description: s.description, areaServed: s.serviceArea };
  if (s.legalName) business.legalName = s.legalName;
  if (s.phone) business.telephone = s.phone;
  if (s.email) business.email = s.email;
  if (s.abn) business.identifier = { '@type': 'PropertyValue', propertyID: 'ABN', value: s.abn };
  // Only include a physical address when an actual business address is supplied.
  if (s.address.street && s.address.postcode) business.address = { '@type': 'PostalAddress', streetAddress: s.address.street, addressLocality: s.address.suburb || s.address.city, addressRegion: s.address.state, postalCode: s.address.postcode, addressCountry: s.address.country };
  const sameAs = [...s.socialURLs, s.googleBusinessProfileURL].filter(Boolean);
  if (sameAs.length) business.sameAs = sameAs;
  const graph = [business, { '@type': 'WebSite', '@id': `${s.domain}/#website`, url: s.domain, name: s.businessName, publisher: { '@id': business['@id'] } }];
  if (page.slug && !page.noindex) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${s.domain}/` }, { '@type': 'ListItem', position: 2, name: page.nav, item: `${s.domain}/${page.slug}/` }] });
  return { '@context': 'https://schema.org', '@graph': graph };
}
export function document(page, ctx) {
  const { site: s } = ctx;
  const canonical = `${s.domain}${page.slug === '404' ? '/404.html' : page.slug ? `/${page.slug}/` : '/'}`;
  const title = `${page.title} | ${s.businessName}`;
  const nav = ctx.isEssential ? [['services', 'Services'], ['pricing', 'Pricing'], ['process', 'Process'], ['contact', 'Contact']] : [['services', 'Services'], ['pricing', 'Pricing'], ['how-it-works', 'Process'], ['about', 'About']];
  const navLinks = nav.map(([slug, label]) => `<a href="${ctx.route(slug)}"${page.slug === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const schema = jsonScript(schemaFor(page, ctx));
  const scripts = `<script src="/assets/js/site.js" defer></script>${page.slug === 'contact' && s.package === 'growth' && s.form.provider === 'formspark' ? '<script type="module" src="/assets/js/form.js"></script>' : ''}${ctx.formEnabled && s.form.turnstileSiteKey && page.slug === 'contact' ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}${ctx.analyticsEnabled ? '<script src="/assets/js/analytics.js" defer></script>' : ''}`;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(page.description)}">
<link rel="canonical" href="${e(canonical)}">
<meta name="robots" content="${page.noindex || ctx.preview ? 'noindex, nofollow' : 'index, follow'}">
<meta name="theme-color" content="${e(s.brand.ivory)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_AU">
<meta property="og:site_name" content="${e(s.businessName)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(page.description)}">
<meta property="og:url" content="${e(canonical)}">
<meta property="og:image" content="${e(s.domain)}/assets/images/social.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(s.businessName)} — ${e(s.tagline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(page.description)}">
<meta name="twitter:image" content="${e(s.domain)}/assets/images/social.png">
${s.analytics.searchConsoleVerification ? `<meta name="google-site-verification" content="${e(s.analytics.searchConsoleVerification)}">` : ''}
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/libre-baskerville-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/brand.css">
<link rel="stylesheet" href="/assets/css/site.css">
<script type="application/ld+json">${schema}</script>
${scripts}
</head>
<body${ctx.analyticsEnabled ? ` data-analytics-id="${e(s.analytics.measurementId)}"` : ''}>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner"><a class="wordmark" href="/" aria-label="${e(s.businessName)} home">${e(s.wordmark)}<span>.</span></a><button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav" hidden>Menu <span aria-hidden="true">☰</span></button><nav id="main-nav" aria-label="Main navigation">${navLinks}${button(ctx.primaryHref, s.primaryCTA.label)}</nav></div></header>
<main id="main" tabindex="-1">${page.render(ctx)}</main>
<footer class="site-footer"><div class="container"><div class="footer-main"><div><a class="wordmark" href="/" aria-label="${e(s.businessName)} home">${e(s.wordmark)}<span>.</span></a><p>${e(s.tagline)}</p><p class="small">Serving ${e(s.serviceArea)}, ${e(s.address.state)}, Australia.</p></div><div><p class="eyebrow">Explore</p><nav aria-label="Footer navigation">${navLinks}<a href="/privacy-policy/">Privacy</a></nav></div><div><p class="eyebrow">Let’s talk</p>${contactDetails(s)}${s.socialURLs.length ? `<div class="contact-links">${s.socialURLs.map((url, i) => `<a href="${e(url)}">Social profile ${i + 1}</a>`).join('')}</div>` : ''}</div></div><div class="footer-bottom"><span>© ${e(s.copyrightYear)} ${e(s.legalName || s.businessName)}${s.abn ? ` · ABN ${e(s.abn)}` : ''}</span><span>All prices AUD, ex GST.</span></div></div></footer>
${ctx.analyticsEnabled ? '<aside class="analytics-notice" aria-label="Analytics preference" hidden><p>Allow optional analytics to help us improve this website? <a href="/privacy-policy/">Privacy notice</a></p><div class="button-row"><button type="button" class="button" data-analytics-choice="allow">Allow analytics</button><button type="button" class="button button-secondary" data-analytics-choice="deny">Decline</button></div></aside>' : ''}
${page.slug === 'contact' && ctx.formtrackEnabled ? '<script src="https://unpkg.com/@formspark/formtrack" async></script>' : ''}
</body>
</html>`;
}

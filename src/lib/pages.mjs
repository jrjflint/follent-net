export const packages = ['essential', 'professional', 'growth'];

function validPackages(value, label) {
  if (!Array.isArray(value) || !value.length || new Set(value).size !== value.length || value.some(item => !packages.includes(item))) throw new Error(`${label} must list supported packages without duplicates`);
}

export function validatePages(pages) {
  if (!Array.isArray(pages) || !pages.length) throw new Error('Page manifest must be a non-empty array');
  const seen = new Set();
  for (const page of pages) {
    if (!page || typeof page !== 'object') throw new Error('Page definitions must be objects');
    if (typeof page.slug !== 'string' || !/^(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(page.slug)) throw new Error('Page slug must be a safe, lowercase relative path');
    if (seen.has(page.slug)) throw new Error(`Duplicate page slug: ${page.slug}`);
    seen.add(page.slug);
    for (const key of ['nav', 'title', 'description']) if (typeof page[key] !== 'string' || !page[key].trim()) throw new Error(`Page ${page.slug || 'home'} needs ${key}`);
    if (typeof page.render !== 'function') throw new Error(`Page ${page.slug || 'home'} needs a render function`);
    validPackages(page.packages, `Page ${page.slug || 'home'} packages`);
    for (const key of ['utility', 'enquiryForm', 'noindex']) if (page[key] !== undefined && typeof page[key] !== 'boolean') throw new Error(`Page ${page.slug || 'home'} ${key} must be a boolean`);
    if (page.essentialSection !== undefined && (typeof page.essentialSection !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(page.essentialSection))) throw new Error(`Page ${page.slug} has an invalid Essential section`);
    if (page.navigation !== undefined) {
      if (!page.navigation || typeof page.navigation !== 'object' || !Number.isFinite(page.navigation.order)) throw new Error(`Page ${page.slug} needs a navigation order`);
      validPackages(page.navigation.packages, `Page ${page.slug} navigation packages`);
      for (const packageName of page.navigation.packages) {
        if (!page.packages.includes(packageName) && !(packageName === 'essential' && page.essentialSection)) throw new Error(`Page ${page.slug} navigation has no target for ${packageName}`);
      }
    }
  }
  return pages;
}

export function selectPages(pages, packageName) {
  return pages.filter(page => page.packages.includes(packageName));
}

export function pageRoute(page, packageName) {
  if (packageName === 'essential' && !page.packages.includes(packageName)) {
    if (!page.essentialSection) throw new Error(`Page ${page.slug} has no Essential destination`);
    return `/#${page.essentialSection}`;
  }
  if (!page.packages.includes(packageName)) throw new Error(`Page ${page.slug} is unavailable for ${packageName}`);
  return page.slug === '404' ? '/404.html' : page.slug ? `/${page.slug}/` : '/';
}

export function navigationFor(pages, packageName) {
  return pages.filter(page => page.navigation?.packages.includes(packageName))
    .sort((a, b) => a.navigation.order - b.navigation.order)
    .map(page => ({ slug: page.slug, label: page.nav, href: pageRoute(page, packageName) }));
}

export function validateRenderedTargets(pages, packageName, rendered, ctx) {
  const home = rendered.find(item => item.page.slug === '');
  if (!home) throw new Error(`Page manifest needs a home page for ${packageName}`);
  for (const slug of ['privacy-policy', '404']) if (!rendered.some(item => item.page.slug === slug && item.page.utility)) throw new Error(`Page manifest needs the ${slug} utility for ${packageName}`);
  if (packageName === 'essential') {
    const ids = new Set([...home.html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
    for (const page of pages) if (page.essentialSection && !ids.has(page.essentialSection)) throw new Error(`Missing Essential section: ${page.essentialSection}`);
  }
  for (const [label, href] of [['Primary CTA', ctx.primaryHref], ['Secondary CTA', ctx.secondaryHref]]) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const url = new URL(href, ctx.site.domain);
    if (url.pathname.startsWith('/assets/')) continue;
    const target = rendered.find(item => pageRoute(item.page, packageName) === url.pathname);
    if (!target) throw new Error(`${label} has no page destination: ${url.pathname}`);
    if (url.hash) {
      const ids = new Set([...target.html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
      if (!ids.has(decodeURIComponent(url.hash.slice(1)))) throw new Error(`${label} has no section destination: ${url.hash}`);
    }
  }
  if (ctx.formEnabled && (!rendered.some(item => item.page.enquiryForm) || !rendered.some(item => item.page.slug === 'success') || !rendered.some(item => item.page.slug === 'form-error'))) throw new Error('An active native form requires enquiry, success and form-error pages');
}

import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadConfig } from './build.mjs';

// Read-only local asset checks. Start Wrangler locally with preview output first.
const origin = new URL(process.argv[2] || 'http://127.0.0.1:4191');
assert.ok(origin.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(origin.hostname) && origin.pathname === '/' && !origin.search && !origin.hash && !origin.username && !origin.password, 'Worker QA only accepts a local HTTP origin');
const get = async pathname => {
  const response = await fetch(new URL(pathname, origin), { redirect: 'manual' });
  return { status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() };
};
const metadata = await get('/build-info.json');
assert.equal(metadata.status, 200);
const info = JSON.parse(metadata.body);
const site = await loadConfig(info.configFile);
assert.equal(info.preview, true, 'Worker QA requires an explicit preview build');
assert.equal(info.formEnabled, false);
assert.equal(info.analyticsEnabled, false);
const result = { date: new Date().toISOString(), origin: origin.origin, checks: [], liveSubmission: false };
for (const slug of info.pages.filter(slug => slug !== '404')) {
  const pathname = slug ? `/${slug}/` : '/';
  const page = await get(pathname);
  assert.equal(page.status, 200, pathname);
  assert.match(page.body, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(page.headers['x-robots-tag'], /noindex/);
  assert.ok(page.headers['content-security-policy']);
  assert.doesNotMatch(page.headers['content-security-policy'], /submit-form\.com|google-analytics\.com|googletagmanager\.com|unpkg\.com|unsafe-inline/);
  assert.doesNotMatch(page.body, /<script[^>]+src="(?:https:|[^\"]*analytics\.js)/);
  if (page.body.includes('id="enquiry-form"')) {
    assert.match(page.body, /data-enabled="false"/);
    assert.match(page.body, /<fieldset disabled>/);
    assert.match(page.body, /action="#form-setup"/);
  }
  if (slug) {
    const redirect = await get(`/${slug}`);
    assert.equal(redirect.status, 307, `Clean folder redirect: ${slug}`);
    assert.equal(new URL(redirect.headers.location, origin).pathname, `/${slug}/`);
  }
  result.checks.push({ pathname, status: page.status, noindex: true });
}
const missing = await get('/qa-missing-worker-route/');
assert.equal(missing.status, 404);
assert.equal(missing.body, await readFile('dist/404.html', 'utf8'), 'Custom 404 must serve the generated page, not the homepage');
assert.match(missing.headers['x-robots-tag'], /noindex/);
for (const pathname of ['/config/site.json', '/wrangler.jsonc']) assert.equal((await get(pathname)).status, 404, 'Source configuration must not be an asset');
assert.match((await get('/robots.txt')).body, /Disallow: \//);
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200);
for (const match of sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(match[1].startsWith(`${site.domain}/`), 'Preview sitemap must retain the intended canonical origin');
assert.match((await get('/assets/fonts/montserrat-latin.woff2')).headers['cache-control'], /immutable/);
result.checks.push({ custom404: true, cleanRoutes: true, sourceExcluded: true, robotsBlocked: true, canonicalSitemap: true, fontCaching: true });
await mkdir('.qa', { recursive: true });
await writeFile('.qa/worker-results.json', JSON.stringify(result, null, 2));
console.log(`${info.pages.length - 1} preview pages and static routing/header safeguards passed locally; no live deployment or enquiry.`);

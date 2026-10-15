// Isolated UI-state fixtures only: no production configuration or live delivery.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { root, loadConfig, context, headers } from './build.mjs';
import { document } from '../src/layouts/document.mjs';
import { enquiryForm } from '../src/partials/enquiry-form.mjs';
import { follentEnquiry } from '../src/data/enquiry.mjs';
import { gardenFixture, gardenEnquiry } from '../tests/garden-fixture.mjs';
const require = createRequire(new URL('../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const endpoint = 'https://submit-form.com/qa-shell';
const results = { layouts: [], scenarios: [], errors: [], externalTraffic: 'All requests outside localhost intercepted; only the synthetic endpoint is fulfilled.' };
const servers = [];
const blockedTracking = new WeakMap();
async function serve(directory, port) {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '--dir', directory, '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  servers.push(child);
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); child.once('exit', code => reject(new Error(`Fixture server exited ${code}`))); });
  return `http://127.0.0.1:${port}`;
}
async function isolatedContext(options = {}) {
  const ctx = await browser.newContext(options);
  blockedTracking.set(ctx, 0);
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname === 'unpkg.com' && url.pathname.includes('formtrack')) blockedTracking.set(ctx, blockedTracking.get(ctx) + 1);
    return route.abort();
  });
  return ctx;
}
async function fixture(profile, site, intake, port) {
  site = structuredClone(site);
  site.form.endpoint = endpoint;
  // Transport fixtures are independent of the challenge lifecycle tested by ui-qa.mjs.
  site.form.turnstileSiteKey = '';
  site.form.formtrackEnabled = true;
  site.analytics.measurementId = '';
  const baseContext = context(await loadConfig(), { preview: false });
  // Accepted UI state is intentionally simulated, independently of configuration gates.
  // Normal client builds remain unapproved/disabled and are verified by npm test.
  const ctx = { ...baseContext, site, formEnabled: true, formtrackEnabled: true, analyticsEnabled: false, navigation: [] };
  const pages = [
    { slug: '', nav: 'Home', title: 'Local form-shell fixture', description: 'Synthetic UI fixture only.', noindex: true, render: () => '<h1>Local QA only</h1>' },
    { slug: 'contact', nav: 'Enquiry', title: 'Local enquiry fixture', description: 'Synthetic form fields for mocked delivery.', noindex: true, enquiryForm: true, render: () => `<section class="section"><div class="container"><h1>Local enquiry fixture</h1>${enquiryForm(ctx, intake)}</div></section>` },
    { slug: 'privacy-policy', nav: 'Privacy', title: 'Synthetic privacy', description: 'Not a public policy.', noindex: true, render: () => '<h1>Synthetic privacy</h1><p>No live collection is authorised by this fixture.</p>' },
    { slug: 'success', nav: 'Success', title: 'Mock accepted', description: 'Mock success only.', noindex: true, render: () => '<h1>Mock accepted</h1>' },
    { slug: 'form-error', nav: 'Error', title: 'Mock error', description: 'Mock error only.', noindex: true, render: () => '<h1>Mock error</h1>' },
    { slug: '404', nav: 'Not found', title: 'Mock not found', description: 'Mock 404 only.', noindex: true, render: () => '<h1>Not found</h1>' }
  ];
  const directory = `.qa/form-shell-${profile}`;
  const out = path.join(root, directory);
  await mkdir(out, { recursive: true });
  await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
  await writeFile(path.join(out, 'assets/css/brand.css'), `:root{--ivory:${site.brand.ivory};--noir:${site.brand.noir};--bordeaux:${site.brand.bordeaux}}`);
  const hashes = new Set();
  for (const page of pages) {
    const html = document(page, ctx);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
    const filename = page.slug === '404' ? path.join(out, '404.html') : path.join(out, page.slug, 'index.html');
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, html);
  }
  await writeFile(path.join(out, '_headers'), headers({ ...ctx, preview: true }, hashes));
  await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  const base = await serve(directory, port);
  const selection = profile === 'reference' ? 'growth' : 'pruning';
  const url = `${base}/contact/?${intake.queryField}=${selection}`;
  for (const width of [320, 390, 768, 1440]) {
    const browserContext = await isolatedContext({ viewport: { width, height: 950 } });
    const page = await browserContext.newPage();
    page.on('pageerror', error => results.errors.push(error.message));
    await page.goto(url);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    assert.deepEqual(axe.violations, []);
    results.layouts.push({ profile, width, violations: 0 });
    if (width === 390) await page.screenshot({ path: path.join(root, `.qa/screenshots/form-shell-${profile}-390.png`), fullPage: true });
    await browserContext.close();
  }
  for (const outcome of ['success', 'http-error', 'network-error', 'duplicate']) {
    const browserContext = await isolatedContext();
    const page = await browserContext.newPage();
    page.on('pageerror', error => results.errors.push(error.message));
    const events = [];
    page.on('console', msg => { if (msg.text().startsWith('QA_EVENT:')) events.push(JSON.parse(msg.text().slice(9))); });
    await page.addInitScript(() => { window.siteTrack = (event, params) => console.log('QA_EVENT:' + JSON.stringify([event, params])); });
    let calls = 0, payload, release, seen;
    const waiting = new Promise(resolve => { release = resolve; });
    const requested = new Promise(resolve => { seen = resolve; });
    await page.route(endpoint, async route => {
      calls++;
      payload = JSON.parse(route.request().postData());
      seen();
      if (outcome === 'duplicate') await waiting;
      if (outcome === 'network-error') return route.abort();
      return route.fulfill({ status: outcome === 'http-error' ? 422 : 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto(url);
    assert.ok(blockedTracking.get(browserContext) > 0, 'Tracking request must be intercepted and blocked');
    assert.equal(await page.locator(`#${intake.queryField}`).inputValue(), selection);
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    assert.equal(calls, 0);
    await page.locator('#name').fill('Synthetic QA Person');
    await page.locator('#email').fill('qa@example.com');
    await page.locator('#message').fill('Synthetic form-shell test only.');
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    assert.equal(calls, 0, 'Consent required before submission');
    if (profile === 'reference') {
      await page.locator('#need').selectOption('A new website');
      assert.equal(await page.locator('#website').isDisabled(), true);
      await page.locator('#need').selectOption('Replace an existing website');
      assert.equal(await page.locator('#website').isEnabled(), true);
    } else assert.equal(await page.locator('#need, #website, #package').count(), 0);
    await page.locator('#consent').check();
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    await requested;
    if (outcome === 'duplicate') {
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      assert.equal(events.length, 0, 'No success event before acceptance');
      await page.locator(`#${intake.queryField}`).selectOption(profile === 'reference' ? 'professional' : 'lawn-care');
      await page.evaluate(() => { document.querySelector('form').requestSubmit(); document.querySelector('form').requestSubmit(); });
      release();
    }
    if (outcome === 'success' || outcome === 'duplicate') {
      await page.waitForURL('**/success/');
      assert.equal(new URL(page.url()).search, '');
      assert.deepEqual(events, [['generate_lead', { package: selection }]]);
    } else {
      await page.locator('#form-status').getByText('We could not confirm', { exact: false }).waitFor();
      assert.equal(await page.locator('#message').inputValue(), 'Synthetic form-shell test only.');
      assert.equal(await page.locator('#form-status').evaluate(node => node === document.activeElement), true);
      assert.equal(await page.locator('button[type=submit]').isEnabled(), true);
      assert.equal(events.length, 0);
    }
    assert.equal(calls, 1);
    assert.equal(payload[intake.queryField], selection);
    assert.equal(payload.email, 'qa@example.com');
    for (const control of ['_redirect', '_error', '_append']) assert.equal(control in payload, false);
    results.scenarios.push({ profile, outcome, calls, blockedTrackingRequests: blockedTracking.get(browserContext) });
    await browserContext.close();
  }
  for (const target of ['success', 'form-error']) {
    const browserContext = await isolatedContext({ javaScriptEnabled: false });
    const page = await browserContext.newPage();
    let body;
    await page.route(endpoint, route => { body = new URLSearchParams(route.request().postData()); return route.fulfill({ status: 302, headers: { Location: `${base}/${target}/` } }); });
    await page.goto(url);
    await page.locator('#name').fill('Synthetic Native QA');
    await page.locator('#email').fill('qa@example.com');
    await page.locator('#message').fill('Synthetic native test only.');
    await page.locator(`#${intake.queryField}`).selectOption(selection);
    await page.locator('#consent').check();
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    await page.waitForURL(`**/${target}/`);
    assert.equal(body.get('_append'), 'false');
    assert.equal(body.get('_redirect'), `${site.domain}/success/`);
    assert.equal(body.get('_error'), `${site.domain}/form-error/`);
    assert.equal(body.get(intake.queryField), selection);
    assert.equal(new URL(page.url()).search, '');
    results.scenarios.push({ profile, outcome: `native-${target}`, cleanURL: true });
    await browserContext.close();
  }
}
try {
  await mkdir(path.join(root, '.qa/screenshots'), { recursive: true });
  await fixture('reference', await loadConfig(), follentEnquiry, 4185);
  await fixture('garden', (await gardenFixture()).site, gardenEnquiry, 4186);
  assert.deepEqual(results.errors, []);
  console.log(`${results.layouts.length} form layouts and ${results.scenarios.length} mocked scenarios passed; no live submission.`);
} finally {
  await writeFile(path.join(root, '.qa/form-shell-results.json'), JSON.stringify(results, null, 2));
  for (const child of servers) child.kill();
  await browser.close();
}

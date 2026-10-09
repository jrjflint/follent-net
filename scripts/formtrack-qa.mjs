// Uses the real public library cached in .qa, with all provider/CDN requests mocked.
// Fetch it first: curl -L https://unpkg.com/@formspark/formtrack -o .qa/formtrack.global.js
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { build, loadConfig, root } from './build.mjs';
const require = createRequire(new URL('../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const library = await readFile(path.join(root, '.qa/formtrack.global.js'), 'utf8');
const endpoint = 'https://submit-form.com/qa-formtrack';
const entry = 'https://unpkg.com/@formspark/formtrack';
const redirected = 'https://unpkg.com/@formspark/formtrack@0.1.39/dist/index.global.js';
const attribution = { ref: 'partner & referral', referrer: 'newsletter', utm_source: 'QA Google', utm_medium: 'cpc', utm_campaign: 'spring sale & café / 日本語', utm_term: 'websites + Sydney', utm_content: 'contact/CTA?one=two' };
const results = { scenarios: [], layouts: [], violations: [], scriptErrors: [], cspErrors: [] };
const config = await loadConfig();
config.form.endpoint = endpoint;
config.email = 'qa@example.com'; config.privacy.contactEmail = 'qa@example.com'; config.privacy.retention = 'Local QA fixture only.'; config.privacy.approved = true;
config.form.formtrackEnabled = true;
config.analytics.measurementId = '';
await writeFile(path.join(root, '.qa/formtrack-config.json'), JSON.stringify(config));
await build({ configFile: '.qa/formtrack-config.json', output: '.qa/formtrack' });
const child = spawn(process.execPath, ['scripts/serve.mjs', '--dir', '.qa/formtrack', '--port', '4180'], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const base = 'http://127.0.0.1:4180';
async function environment({ script = 'normal', native = false, javaScriptEnabled = true, outcome = 'success', viewport } = {}) {
  const context = await browser.newContext({ javaScriptEnabled, ...(viewport ? { viewport } : {}) });
  const page = await context.newPage();
  page.on('pageerror', err => results.scriptErrors.push(err.message));
  page.on('console', msg => { if (/content security policy|violates.*policy/i.test(msg.text())) results.cspErrors.push(msg.text()); });
  const state = { calls: 0, payload: null, scripts: 0 };
  await context.route('https://unpkg.com/**', async route => {
    state.scripts++;
    if (script === 'blocked') return route.abort('blockedbyclient');
    if (script === 'delayed') await new Promise(resolve => setTimeout(resolve, 2000));
    if (script === 'late') await new Promise(resolve => setTimeout(resolve, 5000));
    if (route.request().url() === entry) return route.fulfill({ status: 302, headers: { Location: redirected } }).catch(() => {});
    assert.equal(route.request().url(), redirected);
    return route.fulfill({ contentType: 'application/javascript', body: library }).catch(() => {});
  });
  if (native) await context.route('**/assets/js/form.js', route => route.abort('blockedbyclient'));
  // Nothing can fall through to a real Formspark endpoint, including the user's.
  await context.route('https://submit-form.com/**', async route => {
    assert.equal(route.request().url(), endpoint);
    state.calls++;
    state.payload = native || !javaScriptEnabled ? Object.fromEntries(new URLSearchParams(route.request().postData())) : route.request().postDataJSON();
    await new Promise(resolve => setTimeout(resolve, 250));
    if (outcome === 'network') return route.abort('failed');
    if (native || !javaScriptEnabled) return route.fulfill({ status: 302, headers: { Location: base + '/success/' } });
    return route.fulfill({ status: outcome === 'success' ? 200 : 422, contentType: 'application/json', body: '{}' });
  });
  return { context, page, state };
}
async function fill(page) {
  await page.locator('#name').fill('QA Person');
  await page.locator('#business_name').fill('QA Business');
  await page.locator('#email').fill('qa@example.com');
  await page.locator('#phone').fill('0400000000');
  await page.locator('#need').selectOption('Replace an existing website');
  await page.locator('#website').fill('https://example.com/');
  await page.locator('#timeline').selectOption('1–3 months');
  await page.locator('#message').fill('Local mocked enquiry: café & <test>.');
  await page.locator('#consent').check();
}
async function loaded(page) { await page.waitForFunction(() => window.__FORMTRACK_POLLER__ === true); }
try {
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); child.once('exit', code => reject(new Error(`Server exited ${code}`))); });
  for (const width of [320, 390, 768, 1440]) {
    const { context, page } = await environment({ viewport: { width, height: 1000 } });
    await page.goto(base + '/contact/'); await loaded(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    results.violations.push(...report.violations.map(v => ({ width, id: v.id, nodes: v.nodes.map(n => n.target) })));
    await mkdir(path.join(root, '.qa/screenshots'), { recursive: true });
    await page.evaluate(() => document.activeElement?.blur());
    await page.locator('.contact-panel').screenshot({ path: path.join(root, `.qa/screenshots/formtrack-contact-${width}.png`) });
    results.layouts.push(width); await context.close();
  }
  for (const scenario of ['all-parameters', 'absent-parameters', 'delayed-loaded', 'delayed-submission', 'blocked-script']) {
    const script = scenario === 'delayed-loaded' ? 'delayed' : scenario === 'delayed-submission' ? 'late' : scenario === 'blocked-script' ? 'blocked' : 'normal';
    const { context, page, state } = await environment({ script });
    const tracked = scenario === 'all-parameters' || scenario === 'delayed-loaded';
    const query = new URLSearchParams({ ...(scenario !== 'absent-parameters' ? attribution : {}), package: 'managed-lead-capture-pro' });
    await page.goto(`${base}/contact/?${query}`, { waitUntil: 'domcontentloaded' });
    if (script === 'normal' || script === 'delayed') await loaded(page);
    assert.equal(await page.locator('#package').inputValue(), 'managed-lead-capture-pro');
    assert.equal(await page.locator(`script[src="${entry}"]`).count(), 1);
    await page.getByRole('button', { name: 'Send your enquiry' }).click(); assert.equal(state.calls, 0, 'Required validation');
    await fill(page);
    await page.locator('#email').fill('not-an-email');
    await page.getByRole('button', { name: 'Send your enquiry' }).click(); assert.equal(state.calls, 0, 'Email validation');
    await page.locator('#email').fill('qa@example.com'); await page.locator('#website').fill('not-a-url');
    await page.getByRole('button', { name: 'Send your enquiry' }).click(); assert.equal(state.calls, 0, 'URL validation');
    await page.locator('#website').fill('https://example.com/');
    if (tracked) for (const key of Object.keys(attribution)) assert.equal(await page.locator(`input[name="${key}"]`).count(), 1, 'No duplicate attribution fields');
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    await page.waitForURL('**/success/');
    assert.equal(state.calls, 1);
    assert.equal(page.url(), base + '/success/');
    const payload = state.payload;
    assert.equal(payload.business_name, 'QA Business'); assert.equal(payload.package, 'managed-lead-capture-pro');
    assert.equal(payload.name, 'QA Person'); assert.equal(payload.email, 'qa@example.com'); assert.equal(payload.phone, '0400000000');
    assert.equal(payload.website, 'https://example.com/'); assert.equal(payload.need, 'Replace an existing website');
    assert.equal(payload.timeline, '1–3 months'); assert.equal(payload.message, 'Local mocked enquiry: café & <test>.'); assert.equal(payload.consent, 'yes');
    assert.equal(payload.business, undefined); assert.equal(payload._redirect, undefined); assert.equal(payload._append, undefined);
    for (const [key, value] of Object.entries(attribution)) assert.equal(payload[key], tracked ? value : undefined);
    results.scenarios.push(scenario); await context.close();
  }
  // Every selector value is submitted as its stable identifier, not the price label.
  const offerIDs = ['', 'essential', 'professional', 'growth', 'managed-lead-capture', 'managed-lead-capture-pro', 'lead-automation', 'custom'];
  const picker = await environment();
  for (const id of offerIDs) {
    await picker.page.goto(base + '/contact/'); await loaded(picker.page); await fill(picker.page);
    await picker.page.locator('#package').selectOption(id);
    await picker.page.getByRole('button', { name: 'Send your enquiry' }).click(); await picker.page.waitForURL('**/success/');
    assert.equal(picker.state.payload.package, id);
  }
  results.scenarios.push('All eight selector values submitted'); await picker.context.close();
  for (const outcome of ['http', 'network']) {
    const { context, page, state } = await environment({ outcome });
    await page.goto(base + '/contact/?utm_source=test'); await loaded(page); await fill(page);
    // Two synchronous submit events must still produce exactly one request.
    await page.locator('#enquiry-form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
    await page.getByText('We could not confirm your enquiry was received.', { exact: false }).waitFor();
    assert.equal(state.calls, 1); assert.equal(state.payload.utm_source, 'test');
    assert.equal(await page.locator('#email').inputValue(), 'qa@example.com');
    assert.equal(await page.locator('#form-status').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.getByRole('button', { name: 'Send your enquiry' }).isEnabled(), true);
    results.scenarios.push(`${outcome} failure and double-submit protection`); await context.close();
  }
  for (const js of [true, false]) {
    const { context, page, state } = await environment({ native: true, javaScriptEnabled: js });
    await page.goto(base + '/contact/?utm_source=native_test'); if (js) await loaded(page); await fill(page);
    await page.getByRole('button', { name: 'Send your enquiry' }).click(); await page.waitForURL('**/success/');
    assert.equal(state.calls, 1); assert.equal(state.payload._append, 'false');
    assert.equal(state.payload.utm_source, js ? 'native_test' : undefined);
    assert.equal(page.url(), base + '/success/');
    results.scenarios.push(js ? 'Native POST with Formtrack when enhancement fails' : 'Native POST without JavaScript or attribution');
    await context.close();
  }
  assert.deepEqual(results.violations, []);
  assert.deepEqual(results.scriptErrors, []);
  assert.deepEqual(results.cspErrors, []);
  await writeFile(path.join(root, '.qa/formtrack-results.json'), JSON.stringify(results, null, 2));
  console.log(`${results.scenarios.length} form/attribution scenarios passed; ${results.layouts.length} enabled-form layouts; zero axe, script or CSP errors. All submissions mocked.`);
} finally { child.kill(); await browser.close(); }

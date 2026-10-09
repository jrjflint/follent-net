// Optional local browser verification; uses the existing ignored QA tools.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { root } from '../../scripts/build.mjs';

const require = createRequire(new URL('../../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const info = JSON.parse(await readFile(path.join(root, '.qa/privacy-review/build-info.json'), 'utf8'));
assert.equal(info.unpublishedPrivacyDraft, true, 'Generate the review first');
assert.equal(info.preview, true);
assert.equal(info.formEnabled, false);
assert.equal(info.analyticsEnabled, false);
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dir', '.qa/privacy-review', '--port', '4182'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let browser;
const results = { layouts: [], checks: [], errors: [], externalRequests: [] };
try {
  await new Promise((resolve, reject) => {
    server.stdout.once('data', resolve);
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Preview exited: ${code}`)));
  });
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  await mkdir(path.join(root, '.qa/screenshots'), { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => {
      if (new URL(route.request().url()).hostname !== '127.0.0.1') {
        results.externalRequests.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', error => results.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') results.errors.push(message.text()); });
    const response = await page.goto('http://127.0.0.1:4182/privacy-policy/');
    assert.equal(response.status(), 200);
    assert.match(response.headers()['x-robots-tag'], /noindex/);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('article').getByText('Follent.net is operated by James Follent. In this Privacy Policy, ‘we’, ‘us’ and ‘our’ refer to James Follent.', { exact: true }).count(), 1);
    assert.equal(await page.locator('article h2[id^="policy-"]').count(), 9);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const clauses = await page.locator('article p > strong').allTextContents();
    const expected = [3, 3, 3, 3, 4, 3, 3, 4, 2].flatMap((count, i) => Array.from({ length: count }, (_, j) => `${i + 1}.${j + 1}`));
    assert.deepEqual(clauses, expected);
    for (const href of await page.locator('nav[aria-label="Privacy policy contents"] a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      assert.equal(await page.locator(href).count(), 1);
    }
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://follent.net/privacy-policy/');
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    results.layouts.push({ width, overflow: false, violations: axe.violations.map(v => v.id), clauses: clauses.length });
    assert.deepEqual(axe.violations, []);
    await page.screenshot({ path: path.join(root, `.qa/screenshots/privacy-policy-${width}-viewport.png`) });
    await page.screenshot({ path: path.join(root, `.qa/screenshots/privacy-policy-${width}.png`), fullPage: true });
    if (width === 390) {
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      await page.getByRole('link', { name: 'Privacy enquiries and complaints', exact: true }).click();
      assert.match(page.url(), /#policy-8$/);
    }
    await page.goto('http://127.0.0.1:4182/');
    await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Privacy', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, '/privacy-policy/');
    await page.goto('http://127.0.0.1:4182/contact/');
    assert.equal(await page.locator('#enquiry-form button[type="submit"]').isDisabled(), true);
    await context.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await noJS.newPage();
  await page.goto('http://127.0.0.1:4182/privacy-policy/');
  assert.equal(await page.locator('#main-nav').isVisible(), true);
  await page.getByRole('link', { name: 'Access, correction and preferences', exact: true }).click();
  assert.match(page.url(), /#policy-7$/);
  await noJS.close();
  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.externalRequests, []);
  results.checks.push('Exact approved operator wording; 28 clauses in order; nine contents targets; privacy-policy route and canonical; footer link; keyboard skip link; no-JS navigation; disabled form; no external requests or browser/CSP errors.');
  console.log(JSON.stringify(results, null, 2));
} finally {
  await writeFile(path.join(root, '.qa/privacy-policy-results.json'), JSON.stringify(results, null, 2));
  if (browser) await browser.close();
  server.kill();
}

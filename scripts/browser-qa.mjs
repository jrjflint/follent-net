// Optional QA tooling lives in ignored .qa/tools; it is never shipped to users.
// npm install --prefix .qa/tools --no-save playwright @axe-core/playwright lighthouse html-validate
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { root, loadConfig, build } from './build.mjs';
import { gardenFixture } from '../tests/garden-fixture.mjs';
import { pageDefinitions } from '../src/pages/content.mjs';
import { escapeHTML as e } from '../src/lib/html.mjs';
const require = createRequire(new URL('../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const fixtureName = process.argv.includes('--fixture') ? process.argv[process.argv.indexOf('--fixture') + 1] : 'reference';
if (!['reference', 'garden'].includes(fixtureName)) throw new Error('Use --fixture reference or garden');
const browser = await chromium.launch({ executablePath: chrome, headless: true });
await mkdir(path.join(root, '.qa/screenshots'), { recursive: true });
const results = { fixture: fixtureName, layouts: [], accessibility: [], behaviours: [], errors: [], interceptedExternalRequests: [] };
const servers = [];
const sourceImage = path.join(root, 'assets/images/social.png');
const sourceBefore = process.argv.includes('--social-only') ? undefined : { bytes: await readFile(sourceImage), modified: (await stat(sourceImage)).mtimeMs };

async function server(dir, port) {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '--dir', dir, '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  servers.push(child);
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); child.once('exit', code => reject(new Error(`Preview exited: ${code}`))); });
  return `http://127.0.0.1:${port}`;
}
async function socialImage() {
  const s = await loadConfig();
  const font = (await readFile(path.join(root, 'assets/fonts/libre-baskerville-latin.woff2'))).toString('base64');
  const sans = (await readFile(path.join(root, 'assets/fonts/montserrat-latin.woff2'))).toString('base64');
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>@font-face{font-family:Libre;src:url(data:font/woff2;base64,${font})}@font-face{font-family:Mont;src:url(data:font/woff2;base64,${sans})}*{box-sizing:border-box}body{margin:0;background:${s.brand.ivory};color:${s.brand.noir};padding:68px 78px;width:1200px;height:630px;border-bottom:16px solid ${s.brand.bordeaux}}.logo{font:56px Libre;letter-spacing:-4px}.logo span{color:${s.brand.bordeaux}}.label{font:13px Mont;letter-spacing:3px;text-transform:uppercase;color:${s.brand.bordeaux};margin-top:55px}h1{font:52px/1.25 Libre;letter-spacing:-2px;max-width:940px;margin:22px 0}.bottom{font:15px Mont;color:${s.brand.bordeaux};border-top:1px solid #ccc7bd;padding-top:25px;margin-top:42px}</style></head><body><div class="logo">${e(s.wordmark)}<span>.</span></div><div class="label">Website services · ${e(s.serviceArea)}</div><h1>${e(s.tagline)}</h1><div class="bottom">${e(s.businessName)} &nbsp; / &nbsp; Clear scope. Considered design. A proper launch.</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const requested = process.argv.includes('--social-out') ? process.argv[process.argv.indexOf('--social-out') + 1] : 'assets/images/social.png';
  if (!requested || requested.startsWith('--')) throw new Error('--social-out requires a path');
  const destination = path.resolve(root, requested);
  const relative = path.relative(root, destination);
  if (destination !== path.join(root, 'assets/images/social.png') && !relative.startsWith(`.qa${path.sep}`)) throw new Error('Export social artwork only to the source image or a child of .qa');
  await mkdir(path.dirname(destination), { recursive: true });
  await page.screenshot({ path: destination });
  await page.close();
}
async function localContext(options = {}) {
  const ctx = await browser.newContext(options);
  await ctx.route('**/*', route => {
    if (new URL(route.request().url()).hostname === '127.0.0.1') return route.continue();
    results.interceptedExternalRequests.push(route.request().url());
    if (route.request().resourceType() === 'script') return route.fulfill({ contentType: 'application/javascript', body: '/* local QA stub */' });
    return route.abort();
  });
  return ctx;
}
try {
  if (process.argv.includes('--social-only')) await socialImage();
  if (!process.argv.includes('--social-only')) {
    let buildOptions = {};
    if (fixtureName === 'garden') {
      const fixture = await gardenFixture();
      await writeFile(path.join(root, '.qa/browser-garden-config.json'), JSON.stringify(fixture.site));
      buildOptions = { configFile: '.qa/browser-garden-config.json', pages: fixture.pages, output: '.qa/browser-garden' };
    }
    const mainBuild = await build(buildOptions);
    const base = await server(fixtureName === 'garden' ? '.qa/browser-garden' : 'dist', 4175);
    const info = JSON.parse(await readFile(path.join(mainBuild.out, 'build-info.json'), 'utf8'));
    const urls = info.pages.map(slug => slug === '404' ? '/404.html' : slug ? '/' + slug + '/' : '/');
    const definitions = buildOptions.pages || pageDefinitions;
    const enquiryPage = definitions.find(page => page.enquiryForm && info.pages.includes(page.slug));
    const enquiryPath = enquiryPage ? `/${enquiryPage.slug}/` : urls.includes(mainBuild.ctx.primaryHref) ? mainBuild.ctx.primaryHref : '/';
    for (const width of [320, 390, 768, 1440]) {
      const ctx = await localContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      await ctx.route('https://submit-form.com/**', route => route.abort());
      const page = await ctx.newPage();
      page.on('pageerror', err => results.errors.push(err.message));
      for (const url of urls) {
        await page.goto(base + url);
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, headings: document.querySelectorAll('h1').length, font: getComputedStyle(document.querySelector('h1')).fontFamily, bodyFont: getComputedStyle(document.body).fontFamily }));
        assert.equal(layout.overflow, false, `${width}px ${url} overflows`);
        assert.equal(layout.headings, 1);
        results.layouts.push({ width, url, ...layout });
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        results.accessibility.push({ width, url, violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
        if (url === '/') await page.screenshot({ path: path.join(root, `.qa/screenshots/${fixtureName}-home-viewport-${width}.png`) });
        if (['/', '/pricing/', '/contact/'].includes(url)) await page.screenshot({ path: path.join(root, `.qa/screenshots/${fixtureName}-${url === '/' ? 'home' : url.split('/')[1]}-${width}.png`), fullPage: true });
      }
      if (width === 390) {
        await page.goto(base);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
        await page.keyboard.press('Enter');
        assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
        await page.getByRole('button', { name: 'Menu' }).click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
        results.behaviours.push('Mobile menu toggle/Escape and skip-link keyboard navigation passed.');
      }
      await ctx.close();
    }
    const noJS = await localContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const native = await noJS.newPage();
    await native.goto(base);
    assert.equal(await native.locator('#main-nav').isVisible(), true);
    assert.equal(await native.locator('h1').count(), 1);
    assert.ok(await native.locator('h1').textContent());
    await native.goto(base + enquiryPath);
    if (await native.locator('#enquiry-form').count()) assert.equal(await native.locator('#enquiry-form button[type=submit]').isDisabled(), !mainBuild.ctx.formEnabled);
    await build({ ...buildOptions, output: '.qa/browser-preview', preview: true });
    const previewBase = await server('.qa/browser-preview', 4178);
    await native.goto(previewBase + enquiryPath);
    if (await native.locator('#enquiry-form').count()) assert.equal(await native.locator('#enquiry-form button[type=submit]').isDisabled(), true);
    await noJS.close();
    results.behaviours.push(`Without JavaScript: content/navigation visible; ${enquiryPage ? 'normal form follows capabilities; preview form disabled' : 'no native form in this fixture'}.`);

    if (fixtureName === 'reference') {
    // Follent-specific intake/Analytics fixtures are local only. No request is ever sent to a real form service.
    const fixture = await loadConfig();
    fixture.package = 'growth'; // Mocked transport scenarios are independent of normal package choice.
    fixture.form.endpoint = 'https://submit-form.com/qa-test';
    // Attribution has a dedicated actual-library test; keep these mocks isolated.
    fixture.form.formtrackEnabled = false;
    // These transport mocks do not load a real challenge or obtain a Turnstile token.
    fixture.form.turnstileSiteKey = '';
    fixture.email = 'qa@example.com'; fixture.privacy.contactEmail = 'qa@example.com'; fixture.privacy.approved = true; fixture.privacy.retention = 'QA fixture only.';
    await writeFile(path.join(root, '.qa/form-config.json'), JSON.stringify(fixture));
    await build({ configFile: '.qa/form-config.json', output: '.qa/form' });
    const formBase = await server('.qa/form', 4176);
    for (const outcome of ['success', 'http-error', 'network-error']) {
      const ctx = await localContext();
      const page = await ctx.newPage();
      let calls = 0;
      await page.route('https://submit-form.com/qa-test', async route => {
        calls++;
        if (outcome === 'network-error') return route.abort('failed');
        return route.fulfill({ status: outcome === 'success' ? 200 : 422, contentType: 'application/json', body: '{}' });
      });
      await page.goto(formBase + '/contact/?package=growth');
      assert.equal(await page.locator('#package').inputValue(), 'growth');
      await page.getByRole('button', { name: 'Send your enquiry' }).click();
      assert.equal(calls, 0, 'Invalid form must not send');
      await page.locator('#name').fill('QA Person'); await page.locator('#email').fill('qa@example.com'); await page.locator('#message').fill('Local mock submission, not a real enquiry.'); await page.locator('#consent').check();
      await page.getByRole('button', { name: 'Send your enquiry' }).click();
      if (outcome === 'success') await page.waitForURL('**/success/');
      else {
        await page.getByText('We could not confirm your enquiry was received.', { exact: false }).waitFor();
        assert.equal(await page.locator('#email').inputValue(), 'qa@example.com');
        assert.equal(await page.locator('#form-status').evaluate(el => el === document.activeElement), true);
        assert.equal(await page.getByRole('button', { name: 'Send your enquiry' }).isEnabled(), true);
      }
      assert.equal(calls, 1);
      results.behaviours.push(`Enhanced form ${outcome}: passed, with mocked provider.`);
      await ctx.close();
    }
    for (const target of ['success', 'form-error']) {
      const ctx = await localContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      let body = '';
      await page.route('https://submit-form.com/qa-test', route => { body = route.request().postData(); return route.fulfill({ status: 302, headers: { Location: formBase + '/' + target + '/' } }); });
      await page.goto(formBase + '/contact/');
      await page.locator('#name').fill('Native QA'); await page.locator('#email').fill('qa@example.com'); await page.locator('#message').fill('Native local test'); await page.locator('#consent').check();
      await page.getByRole('button', { name: 'Send your enquiry' }).click();
      await page.waitForURL('**/' + target + '/');
      assert.match(body, /_append=false/); assert.match(body, /_error=/); assert.match(body, /_redirect=/);
      results.behaviours.push(`Native HTML form POST and mocked ${target} redirect passed with JavaScript disabled.`);
      await ctx.close();
    }
    fixture.analytics.measurementId = 'G-QATEST1';
    fixture.analytics.tagManagerId = 'GTM-QATEST1';
    await writeFile(path.join(root, '.qa/analytics-config.json'), JSON.stringify(fixture));
    await build({ configFile: '.qa/analytics-config.json', output: '.qa/analytics' });
    const analyticsBase = await server('.qa/analytics', 4177);
    const analyticsContext = await localContext();
    let analyticsRequests = 0;
    await analyticsContext.route('https://www.googletagmanager.com/**', route => { analyticsRequests++; return route.fulfill({ contentType: 'application/javascript', body: 'window.qaAnalyticsLoaded=true;' }); });
    const analyticsPage = await analyticsContext.newPage();
    await analyticsPage.goto(analyticsBase + '/privacy-policy/?privateQuery=neverTrackThis');
    assert.equal(analyticsRequests, 0);
    await analyticsPage.getByRole('button', { name: 'Decline', exact: true }).click();
    assert.equal(analyticsRequests, 0);
    await analyticsPage.getByRole('button', { name: 'Change analytics preference' }).click();
    await analyticsPage.getByRole('button', { name: 'Allow analytics' }).click();
    await analyticsPage.waitForFunction(() => window.qaAnalyticsLoaded);
    assert.equal(analyticsRequests, 1);
    const gaConfig = await analyticsPage.evaluate(() => window.dataLayer.find(x => x.event === 'gtm.js'));
    assert.equal(gaConfig.page_location, analyticsBase + '/privacy-policy/');
    assert.equal(gaConfig.page_location.includes('privateQuery'), false);
    assert.ok(!await analyticsPage.evaluate(() => Array.from(window.dataLayer).some(x => x[0] === 'config')), 'No duplicate direct GA loader');
    await analyticsPage.evaluate(() => window.siteTrack('generate_lead', { package: 'growth' }));
    const event = await analyticsPage.evaluate(() => { const x = window.dataLayer.find(x => x.event === 'generate_lead'); return { event: x.event, package: x.package }; });
    assert.deepEqual(event, { event: 'generate_lead', package: 'growth' });
    let acceptedEvents = 0;
    analyticsPage.on('console', message => { if (message.text() === 'QA_ACCEPTED_LEAD') acceptedEvents++; });
    await analyticsPage.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const push = window.dataLayer.push.bind(window.dataLayer);
        window.dataLayer.push = entry => { if (entry.event === 'generate_lead') console.log('QA_ACCEPTED_LEAD'); return push(entry); };
      });
    });
    let acceptSubmission = false;
    await analyticsPage.route('https://submit-form.com/**', route => route.fulfill({ status: acceptSubmission ? 200 : 500, contentType: 'application/json', body: '{}' }));
    await analyticsPage.goto(analyticsBase + '/contact/?package=growth');
    await analyticsPage.locator('#name').fill('Synthetic GTM QA');
    await analyticsPage.locator('#email').fill('qa@example.com');
    await analyticsPage.locator('#message').fill('Local intercepted test only');
    await analyticsPage.locator('#consent').check();
    await analyticsPage.getByRole('button', { name: 'Send your enquiry' }).click();
    await analyticsPage.locator('#form-status').filter({ hasText: 'We could not confirm' }).waitFor();
    assert.equal(acceptedEvents, 0, 'Failed submissions never emit a conversion');
    acceptSubmission = true;
    await analyticsPage.getByRole('button', { name: 'Send your enquiry' }).click();
    await analyticsPage.waitForURL('**/success/');
    assert.equal(acceptedEvents, 1, 'One accepted submission emits one conversion before redirect');
    results.behaviours.push('Mocked GTM: consent gate, no direct GA loader, sanitised page data, failure emits zero leads, acceptance emits one lead and redirects with bounded tracking wait.');
    await analyticsContext.close();
    }
    assert.equal(results.errors.length, 0, 'Browser script errors');
    assert.deepEqual(await readFile(sourceImage), sourceBefore.bytes, 'Ordinary browser QA must preserve artwork bytes');
    assert.equal((await stat(sourceImage)).mtimeMs, sourceBefore.modified, 'Ordinary browser QA must not rewrite artwork');
    results.brandingUnchanged = true;
    const violations = results.accessibility.filter(r => r.violations.length);
    await writeFile(path.join(root, fixtureName === 'reference' ? '.qa/browser-results.json' : '.qa/browser-garden-results.json'), JSON.stringify(results, null, 2));
    console.log(`${results.layouts.length} responsive page checks; ${violations.length} pages with axe violations. ${results.behaviours.length} behaviour scenarios.`);
    if (violations.length) { console.log(JSON.stringify(violations, null, 2)); process.exitCode = 1; }
  }
} finally {
  for (const child of servers) child.kill();
  await browser.close();
}

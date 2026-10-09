// Optional QA tooling lives in ignored .qa/tools; it is never shipped to users.
// npm install --prefix .qa/tools --no-save playwright @axe-core/playwright lighthouse html-validate
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { root, loadConfig, build } from './build.mjs';
import { escapeHTML as e } from '../src/lib/html.mjs';
const require = createRequire(new URL('../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
await mkdir(path.join(root, '.qa/screenshots'), { recursive: true });
const results = { layouts: [], accessibility: [], behaviours: [], errors: [] };
const servers = [];

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
  await page.screenshot({ path: path.join(root, 'assets/images/social.png') });
  await page.close();
}
try {
  await socialImage();
  if (!process.argv.includes('--social-only')) {
    await build();
    const base = await server('dist', 4175);
    const urls = ['/', '/services/', '/pricing/', '/how-it-works/', '/about/', '/contact/', '/privacy/', '/success/', '/form-error/', '/404.html'];
    for (const width of [320, 390, 768, 1440]) {
      const ctx = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
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
        if (url === '/') await page.screenshot({ path: path.join(root, `.qa/screenshots/home-viewport-${width}.png`) });
        if (['/', '/pricing/', '/contact/'].includes(url)) await page.screenshot({ path: path.join(root, `.qa/screenshots/${url === '/' ? 'home' : url.split('/')[1]}-${width}.png`), fullPage: true });
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
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const native = await noJS.newPage();
    await native.goto(base);
    assert.equal(await native.locator('#main-nav').isVisible(), true);
    assert.match(await native.locator('h1').textContent(), /Professional websites/);
    await native.goto(base + '/contact/');
    assert.equal(await native.getByRole('button', { name: 'Send your enquiry' }).isDisabled(), true);
    await noJS.close();
    results.behaviours.push('Without JavaScript: content/navigation visible; unconfigured form disabled.');

    // Fixture is local only. No request is ever sent to a real form service.
    const fixture = await loadConfig();
    fixture.form.endpoint = 'https://submit-form.com/qa-test';
    // Attribution has a dedicated actual-library test; keep these mocks isolated.
    fixture.form.formtrackEnabled = false;
    fixture.email = 'qa@example.com'; fixture.privacy.contactEmail = 'qa@example.com'; fixture.privacy.approved = true; fixture.privacy.retention = 'QA fixture only.';
    await writeFile(path.join(root, '.qa/form-config.json'), JSON.stringify(fixture));
    await build({ configFile: '.qa/form-config.json', output: '.qa/form' });
    const formBase = await server('.qa/form', 4176);
    for (const outcome of ['success', 'http-error', 'network-error']) {
      const ctx = await browser.newContext();
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
      const ctx = await browser.newContext({ javaScriptEnabled: false });
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
    await writeFile(path.join(root, '.qa/analytics-config.json'), JSON.stringify(fixture));
    await build({ configFile: '.qa/analytics-config.json', output: '.qa/analytics' });
    const analyticsBase = await server('.qa/analytics', 4177);
    const analyticsContext = await browser.newContext();
    let analyticsRequests = 0;
    await analyticsContext.route('https://www.googletagmanager.com/**', route => { analyticsRequests++; return route.fulfill({ contentType: 'application/javascript', body: 'window.qaAnalyticsLoaded=true;' }); });
    const analyticsPage = await analyticsContext.newPage();
    await analyticsPage.goto(analyticsBase + '/privacy/?privateQuery=neverTrackThis');
    assert.equal(analyticsRequests, 0);
    await analyticsPage.getByRole('button', { name: 'Decline', exact: true }).click();
    assert.equal(analyticsRequests, 0);
    await analyticsPage.getByRole('button', { name: 'Change analytics preference' }).click();
    await analyticsPage.getByRole('button', { name: 'Allow analytics' }).click();
    await analyticsPage.waitForFunction(() => window.qaAnalyticsLoaded);
    assert.equal(analyticsRequests, 1);
    const gaConfig = await analyticsPage.evaluate(() => Array.from(window.dataLayer).map(x => Array.from(x)).find(x => x[0] === 'config')[2]);
    assert.equal(gaConfig.page_location, analyticsBase + '/privacy/');
    await analyticsPage.evaluate(() => window.follentTrack('generate_lead', { package: 'growth' }));
    const event = await analyticsPage.evaluate(() => Array.from(window.dataLayer).map(x => Array.from(x)).find(x => x[0] === 'event'));
    assert.deepEqual(event, ['event', 'generate_lead', { package: 'growth' }]);
    results.behaviours.push('Mocked analytics: no request before opt-in or after decline; allow loads GA, query strings omitted, conversion payload excludes personal data.');
    await analyticsContext.close();
    assert.equal(results.errors.length, 0, 'Browser script errors');
    const violations = results.accessibility.filter(r => r.violations.length);
    await writeFile(path.join(root, '.qa/browser-results.json'), JSON.stringify(results, null, 2));
    console.log(`${results.layouts.length} responsive page checks; ${violations.length} pages with axe violations. ${results.behaviours.length} behaviour scenarios.`);
    if (violations.length) { console.log(JSON.stringify(violations, null, 2)); process.exitCode = 1; }
  }
} finally {
  for (const child of servers) child.kill();
  await browser.close();
}

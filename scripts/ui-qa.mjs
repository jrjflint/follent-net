// Optional local UI regression checks. Every external request is intercepted.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { build, loadConfig, root } from './build.mjs';
const require = createRequire(new URL('../.qa/tools/package.json', import.meta.url));
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const children = [];
const results = { passed: false, layouts: [], scenarios: [], errors: [], externalRequests: [], evidence: 'Local mocks only; no live challenge, submission, notification or analytics delivery.' };
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const mockAPI = `window.qaRenders=0;window.qaResets=0;window.turnstile={
 render(container,options){window.qaRenders++;window.qaOptions=options;const frame=document.createElement('iframe');frame.title='Mock spam verification';frame.width=150;frame.height=140;frame.src='https://challenges.cloudflare.com/qa-frame';container.append(frame);const input=document.createElement('input');input.type='hidden';input.name='cf-turnstile-response';container.append(input);window.qaComplete=()=>{input.value='mock-ui-token';options.callback('mock-ui-token');};return 0;},
 reset(){window.qaResets++;document.querySelector('[name="cf-turnstile-response"]').value='';}
};`;
async function serve(directory, port) {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '--dir', directory, '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  children.push(child);
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); child.once('exit', code => reject(new Error(`Server exited ${code}`))); });
  return `http://127.0.0.1:${port}`;
}
async function isolated({ verification = 'mock', preference = 'deny', ...options } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', ...options });
  if (preference) await ctx.addInitScript(value => localStorage.setItem('website-analytics-preference', value), preference);
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    results.externalRequests.push(url.href);
    if (url.hostname === 'challenges.cloudflare.com') {
      if (url.pathname === '/qa-frame') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Mock verification</title><body>Local verification fixture</body></html>' });
      if (verification === 'blocked') return route.abort();
      return route.fulfill({ contentType: 'application/javascript', body: mockAPI });
    }
    if (route.request().resourceType() === 'script') return route.fulfill({ contentType: 'application/javascript', body: '/* external service stub */' });
    return route.abort();
  });
  return ctx;
}
async function noOverflow(page, label) {
  const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, elements: Array.from(document.querySelectorAll('body *')).filter(el => { const r = el.getBoundingClientRect(); return el.getClientRects().length && (r.right > innerWidth + 1 || r.left < -1); }).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0, 45) })).slice(0, 20) }));
  if (overflow.scroll > overflow.width) overflow.internal = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => ({ class: el.className, tag: el.tagName, width: el.clientWidth, scroll: el.scrollWidth, text: el.textContent.slice(0,60) })).slice(-20));
  assert.ok(overflow.scroll <= overflow.width, `${label}: ${JSON.stringify(overflow)}`);
}
try {
  const site = await loadConfig();
  site.form.endpoint = 'https://submit-form.com/qa-ui';
  site.form.formtrackEnabled = false;
  await writeFile(path.join(root, '.qa/ui-config.json'), JSON.stringify(site));
  await build({ configFile: '.qa/ui-config.json', output: '.qa/ui-check' });
  await build({ configFile: '.qa/ui-config.json', output: '.qa/ui-check-preview', preview: true });
  const base = await serve('.qa/ui-check', 4187);
  const preview = await serve('.qa/ui-check-preview', 4188);
  const ctx = await isolated();
  const page = await ctx.newPage();
  page.on('pageerror', error => results.errors.push(error.message));
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/pricing/', '/contact/']) {
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      if (route === '/contact/') await page.waitForFunction(() => window.qaRenders === 1);
      await noOverflow(page, `${route} at ${width}`);
      const layout = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, heroHeight: document.querySelector('.home-hero')?.getBoundingClientRect().height, firstField: document.querySelector('#name')?.getBoundingClientRect().top, inputSize: document.querySelector('#name') && getComputedStyle(document.querySelector('#name')).fontSize, widgetWidth: document.querySelector('.cf-turnstile iframe')?.getBoundingClientRect().width }));
      results.layouts.push({ width, route, ...layout });
      if (width === 390) console.log(`${route}: ${JSON.stringify(layout)}`);
      if (route === '/contact/') {
        assert.equal(layout.inputSize, '16px');
        assert.equal(layout.widgetWidth, 150);
        assert.ok(layout.firstField <= (width === 320 ? 950 : width === 390 ? 844 : Infinity));
      }
      if (width === 390 && route === '/') {
        assert.ok(layout.heroHeight <= 1000, `Hero height ${layout.heroHeight}`);
        assert.ok(layout.height <= 11248 * .8, `Home height ${layout.height}; target <=8998`);
      }
      if ([320,390,768,1440].includes(width)) await page.screenshot({ path: path.join(root, `.qa/screenshots/ui-${route === '/' ? 'home' : route.split('/')[1]}-${width}.png`), fullPage: true });
    }
  }
  for (const width of [600,601,639,640,767,768,850,851,1023,1024,1100,1101,1199,1200]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + '/'); await page.evaluate(() => document.fonts.ready);
    await noOverflow(page, `Home boundary ${width}`);
  }
  results.scenarios.push('Seven-width Home/Pricing/Contact matrix with compact iframe footprint and fourteen Home breakpoint checks.');
  // Enlarged text and 400% equivalent reflow: no clipped controls or document overflow.
  for (const route of ['/', '/pricing/', '/contact/']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + route);
    await page.route('**/qa-large-text.css', route => route.fulfill({ contentType: 'text/css', body: 'html{font-size:200%}body{font-size:1rem}' }));
    await page.addStyleTag({ url: base + '/qa-large-text.css' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '32px');
    await noOverflow(page, `200% text ${route}`);
    await page.setViewportSize({ width: 320, height: 844 });
    await noOverflow(page, `320px reflow with enlarged text ${route}`);
  }
  results.scenarios.push('200% root/body text and 320px reflow for Home/Pricing/Contact. This is not a physical-device zoom check.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const route of ['/', '/contact/']) {
    await page.goto(base + route); await noOverflow(page, `Forced colours ${route}`);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
    const focus = await page.locator(':focus').evaluate(el => ({ width: parseFloat(getComputedStyle(el).outlineWidth), style: getComputedStyle(el).outlineStyle }));
    assert.ok(focus.width >= 2 && focus.style !== 'none');
    await page.screenshot({ path: path.join(root, `.qa/screenshots/ui-forced-colours-${route === '/' ? 'home' : 'contact'}.png`) });
  }
  await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'reduce' });
  results.scenarios.push('Emulated forced colours preserve focused controls and reduced-motion scrolling on Home/Contact.');
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto(base + '/');
  await page.getByRole('button', { name: 'Menu' }).click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.getByRole('button', { name: 'Close' }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement), true);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.locator('h1').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.setViewportSize({ width: 667, height: 390 }); await noOverflow(page, 'Landscape');
  results.scenarios.push('Menu label, Escape/focus, outside click, resize closure and landscape.');
  const fresh = await isolated({ preference: null, viewport: { width: 390, height: 667 } });
  const noticePage = await fresh.newPage(); await noticePage.goto(base + '/');
  const boxes = await noticePage.evaluate(() => ({ notice: document.querySelector('.analytics-notice').getBoundingClientRect().bottom, main: document.querySelector('main').getBoundingClientRect().top }));
  assert.ok(boxes.notice <= boxes.main);
  await noticePage.getByRole('button', { name: 'Decline', exact: true }).click();
  assert.equal(await noticePage.locator('.analytics-notice').isVisible(), false);
  results.scenarios.push('First-visit preference panel occupies document flow and disappears after decline.');
  await fresh.close();
  const blocked = await isolated({ verification: 'blocked' });
  const blockedPage = await blocked.newPage(); await blockedPage.goto(base + '/contact/');
  await blockedPage.getByText('Spam verification is unavailable.', { exact: false }).waitFor();
  assert.equal(await blockedPage.locator('.form-contact a[href="mailto:james@follent.net"]').count(), 1);
  // Change only the fixture response, then exercise script-load retry and recovery.
  await blockedPage.route('https://challenges.cloudflare.com/turnstile/**', route => route.fulfill({ contentType: 'application/javascript', body: mockAPI }));
  await blockedPage.getByRole('button', { name: 'Retry verification' }).click();
  await blockedPage.waitForFunction(() => window.qaRenders === 1);
  await blocked.close();
  results.scenarios.push('Blocked challenge has email fallback; retry reloads the API successfully.');
  const slow = await isolated();
  const slowPage = await slow.newPage();
  let releaseAPI;
  await slowPage.route('https://challenges.cloudflare.com/turnstile/**', route => new Promise(resolve => {
    releaseAPI = () => route.fulfill({ contentType: 'application/javascript', body: mockAPI }).then(resolve);
  }));
  await slowPage.clock.install();
  await slowPage.goto(base + '/contact/', { waitUntil: 'domcontentloaded' });
  await slowPage.waitForFunction(() => document.querySelector('.cf-turnstile').dataset.state === 'loading');
  await slowPage.clock.runFor(15001);
  await slowPage.getByText('Spam verification is unavailable.', { exact: false }).waitFor();
  await releaseAPI(); await slowPage.waitForFunction(() => window.qaRenders === 1);
  await slowPage.evaluate(() => window.qaComplete());
  await slowPage.getByText('Spam verification complete.', { exact: true }).waitFor();
  await slow.close();
  results.scenarios.push('15-second script-load watchdog shows recovery; a late API response still completes one widget.');
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(base + '/contact/?package=professional');
  await page.waitForFunction(() => window.qaRenders === 1);
  assert.equal(await page.locator('#package').inputValue(), 'professional');
  let calls = 0; let accept = false; let finish;
  await page.route('https://submit-form.com/**', async route => { calls++; const data = route.request().postDataJSON(); assert.equal(data['cf-turnstile-response'], 'mock-ui-token'); assert.ok(!('_redirect' in data)); await new Promise(resolve => { finish = resolve; }); await route.fulfill({ status: accept ? 200 : 422, contentType: 'application/json', body: '{}' }); });
  await page.locator('#name').fill('Local UI QA'); await page.locator('#email').fill('qa@example.com'); await page.locator('#message').fill('Intercepted local UI check only.'); await page.locator('#consent').check();
  await page.getByRole('button', { name: 'Send your enquiry' }).click();
  assert.equal(calls, 0); await page.locator('#form-status').filter({ hasText: 'Please complete' }).waitFor();
  for (const callback of ['error-callback','expired-callback','timeout-callback']) {
    await page.evaluate(name => window.qaOptions[name](), callback);
    await page.getByRole('button', { name: 'Retry verification' }).click();
  }
  await page.evaluate(() => window.qaComplete());
  await page.getByRole('button', { name: 'Send your enquiry' }).click();
  await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
  assert.equal(await page.locator('[data-verification-retry]').isDisabled(), true);
  await page.locator('form').evaluate(el => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  for (let attempt = 0; !finish && attempt < 500; attempt++) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(typeof finish, 'function', 'Mock provider request must start');
  finish(); await page.locator('#form-status').filter({ hasText: 'We could not confirm' }).waitFor();
  assert.equal(calls, 1); assert.equal(await page.locator('#email').inputValue(), 'qa@example.com');
  assert.equal(await page.locator('#form-status').evaluate(el => el === document.activeElement), true);
  accept = true; finish = undefined; await page.evaluate(() => window.qaComplete());
  await page.getByRole('button', { name: 'Send your enquiry' }).click();
  for (let attempt = 0; !finish && attempt < 500; attempt++) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(typeof finish, 'function', 'Mock accepted request must start');
  finish(); await page.waitForURL('**/success/');
  assert.equal(calls, 2);
  results.scenarios.push('Missing-token block, error/expiry/timeout retry, pending duplicate protection, retained-input rejection and accepted redirect with mocked token.');
  const timed = await isolated(); const timedPage = await timed.newPage();
  await timedPage.goto(base + '/contact/'); await timedPage.waitForFunction(() => window.qaRenders === 1);
  let heldRequest;
  await timedPage.route('https://submit-form.com/**', route => { heldRequest = route; });
  await timedPage.locator('#name').fill('Timeout QA'); await timedPage.locator('#email').fill('qa@example.com'); await timedPage.locator('#message').fill('Intercepted timeout test.'); await timedPage.locator('#consent').check();
  await timedPage.evaluate(() => window.qaComplete());
  await timedPage.getByRole('button', { name: 'Send your enquiry' }).click();
  await timedPage.locator('#form-status').filter({ hasText: 'We could not confirm' }).waitFor({ timeout: 25000 });
  assert.equal(await timedPage.locator('#email').inputValue(), 'qa@example.com');
  assert.equal(await timedPage.getByRole('button', { name: 'Send your enquiry' }).isEnabled(), true);
  await heldRequest.abort().catch(() => {}); await timed.close();
  results.scenarios.push('Actual 20-second transport abort on an intercepted request restores submit and retains input.');
  const native = await isolated({ javaScriptEnabled: false }); const nativePage = await native.newPage();
  await nativePage.goto(base + '/contact/'); assert.equal(await nativePage.locator('#main-nav').isVisible(), true); assert.equal(await nativePage.locator('.form-contact a[href^="mailto:"]').count(), 1);
  await nativePage.goto(preview + '/contact/'); assert.equal(await nativePage.locator('button[type="submit"]').isDisabled(), true); assert.equal(await nativePage.locator('.cf-turnstile').count(), 0);
  const previewHTML = await readFile(path.join(root, '.qa/ui-check-preview/contact/index.html'), 'utf8'); assert.doesNotMatch(previewHTML, /data-sitekey|src="https:\/\/unpkg/);
  results.scenarios.push('No-JS navigation/direct email and preview disabled form without challenge/attribution.');
  assert.equal(results.errors.length, 0);
  results.passed = true;
  await writeFile(path.join(root, '.qa/ui-results.json'), JSON.stringify(results, null, 2));
  console.log(`${results.layouts.length} measured layouts; ${results.scenarios.length} UI scenarios passed. All external services mocked.`);
} finally {
  await writeFile(path.join(root, '.qa/ui-results.json'), JSON.stringify(results, null, 2));
  for (const child of children) child.kill();
  await browser.close();
}

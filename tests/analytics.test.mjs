import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { loadConfig, context, headers } from '../scripts/build.mjs';
import { document as renderDocument } from '../src/layouts/document.mjs';
import { pageDefinitions } from '../src/pages/content.mjs';
import { validateConfig } from '../src/lib/config.mjs';

const source = await readFile(new URL('../assets/js/analytics.js', import.meta.url), 'utf8');
function fixture({ preference = null, navigator = {}, container = 'GTM-QATEST1' } = {}) {
  const scripts = [];
  const listeners = {};
  const buttons = ['allow', 'deny'].map(choice => ({ dataset: { analyticsChoice: choice }, addEventListener: (_, fn) => { listeners[choice] = fn; } }));
  const notice = { hidden: true };
  const window = {};
  const sandbox = {
    window, navigator, setTimeout, clearTimeout, URL,
    localStorage: { getItem: () => preference, setItem: (_, value) => { preference = value; } },
    location: { origin: 'https://site.example', pathname: '/contact/', reload: () => {} },
    document: {
      documentElement: { dataset: {} },
      currentScript: { dataset: { analyticsId: 'G-QATEST1', tagManagerId: container } },
      referrer: 'https://ref.example/path/?email=private#secret',
      createElement: () => ({}), head: { append: script => scripts.push(script) },
      addEventListener: (_, fn) => { listeners.ready = fn; },
      querySelector: () => notice,
      querySelectorAll: selector => selector === '[data-analytics-choice]' ? buttons : []
    }
  };
  vm.runInNewContext(source, sandbox);
  const initialPrompt = sandbox.document.documentElement.dataset.analyticsPrompt;
  listeners.ready();
  return { scripts, listeners, window, notice, initialPrompt, rootDataset: sandbox.document.documentElement.dataset };
}

test('GTM honours opt-in, decline, DNT and GPC before any Google request', () => {
  for (const options of [{}, { preference: 'deny' }, { preference: 'allow', navigator: { doNotTrack: '1' } }, { preference: 'allow', navigator: { globalPrivacyControl: true } }]) {
    const f = fixture(options);
    assert.equal(f.scripts.length, 0);
    assert.equal(f.initialPrompt, options.preference || options.navigator ? undefined : 'pending');
    assert.equal(f.window.siteTrack('generate_lead', { package: 'growth' }), undefined);
  }
  const f = fixture();
  assert.equal(f.initialPrompt, 'pending');
  assert.equal(f.rootDataset.analyticsPrompt, undefined);
  assert.equal(f.notice.hidden, false);
  f.listeners.deny();
  assert.equal(f.scripts.length, 0);
  f.listeners.allow();
  f.listeners.allow();
  assert.equal(f.scripts.length, 1);
  assert.match(f.scripts[0].src, /\/gtm.js\?id=GTM-QATEST1$/);
  assert.equal(f.window.dataLayer[0][2].ad_storage, 'denied');
  const page = f.window.dataLayer.find(x => x.event === 'gtm.js');
  assert.equal(page.page_location, 'https://site.example/contact/');
  assert.equal(page.page_referrer, 'https://ref.example/path/');
  assert.ok(!f.window.dataLayer.some(x => x[0] === 'config'));
});

test('conversion payload is restricted and dispatch has callback plus timeout fallback', async () => {
  const f = fixture({ preference: 'allow' });
  const pending = f.window.siteTrack('generate_lead', { package: 'growth', email: 'never-send@example.com', message: 'private' });
  const lead = f.window.dataLayer.find(x => x.event === 'generate_lead');
  assert.deepEqual(Object.keys(lead).sort(), ['event', 'eventCallback', 'eventTimeout', 'package']);
  assert.equal(lead.package, 'growth');
  lead.eventCallback();
  await pending;
  await f.window.siteTrack('generate_lead', { package: 'unspecified' });
  assert.equal(f.window.siteTrack('arbitrary_event', {}), undefined);
  const direct = fixture({ preference: 'allow', container: '' });
  assert.match(direct.scripts[0].src, /\/gtag\/js\?id=G-QATEST1$/);
  assert.equal(direct.window.dataLayer.find(x => x[0] === 'config')[2].page_location, 'https://site.example/contact/');
});

test('GTM config applies to all production pages with package and preview containment', async () => {
  const site = await loadConfig();
  assert.equal(site.analytics.tagManagerId, 'GTM-5F9LKZC');
  for (const value of [123, 'G-INVALID', 'GTM-<script>']) {
    const invalid = structuredClone(site); invalid.analytics.tagManagerId = value;
    assert.throws(() => validateConfig(invalid), /valid GTM/);
  }
  for (const page of pageDefinitions) {
    const html = renderDocument(page, context(site));
    assert.equal((html.match(/src="\/assets\/js\/analytics.js"/g) || []).length, 1);
    assert.ok(html.indexOf('/assets/js/analytics.js') < html.indexOf('<title>'));
    assert.ok(html.indexOf('</header>') < html.indexOf('/assets/js/site.js'));
    assert.ok(html.indexOf('/assets/js/site.js') < html.indexOf('<main'));
    assert.match(html, /data-tag-manager-id="GTM-5F9LKZC"/);
    assert.doesNotMatch(html, /ns.html|unsafe-inline/);
    assert.doesNotMatch(renderDocument(page, context(site, { preview: true })), /analytics.js|GTM-5F9LKZC/);
    assert.doesNotMatch(renderDocument(page, context({ ...site, package: 'essential' })), /analytics.js|GTM-5F9LKZC/);
  }
  assert.doesNotMatch(headers(context(site), []), /unsafe-inline|unsafe-eval/);
  assert.doesNotMatch(headers(context(site, { preview: true }), []), /googletagmanager/);
});

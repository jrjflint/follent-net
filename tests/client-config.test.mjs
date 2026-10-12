import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, loadConfig, context } from '../scripts/build.mjs';

test('client example never inherits reference integrations or review approvals', async () => {
  const site = await loadConfig('config/client.example.json');
  const reference = await loadConfig();
  assert.deepEqual(site.analytics, { measurementId: '', searchConsoleVerification: '' });
  assert.deepEqual(site.privacy, { approved: false, contactEmail: '', retention: '', policy: 'client' });
  assert.deepEqual(site.launch, { migrationReviewed: false, businessDetailsReviewed: false });
  assert.deepEqual(site.redirects, []);
  assert.equal(site.form.endpoint, '');
  assert.equal(site.form.turnstileSiteKey, '');
  assert.equal(site.form.externalURL, '');
  assert.equal(site.form.formtrackEnabled, false);
  for (const packageName of ['essential', 'professional', 'growth']) {
    for (const preview of [false, true]) {
      const ctx = context({ ...site, package: packageName }, { preview });
      assert.equal(ctx.formEnabled, false);
      assert.equal(ctx.analyticsEnabled, false);
      assert.equal(ctx.formtrackEnabled, false);
      const result = await build({ configFile: 'config/client.example.json', output: `.qa/client-example-${packageName}-${preview ? 'preview' : 'normal'}`, packageOverride: packageName, preview });
      for (const slug of ['', 'privacy-policy']) {
        const html = await readFile(path.join(result.out, slug, 'index.html'), 'utf8');
        for (const value of [reference.form.endpoint, reference.analytics.measurementId, reference.privacy.contactEmail, reference.abn].filter(Boolean)) assert.ok(!html.includes(value), `Copied reference identifier: ${value}`);
        assert.match(html, /https:\/\/client\.example\//);
        assert.match(html, /preview only/);
        assert.doesNotMatch(html, /src="https:\/\/(?:unpkg|www\.googletagmanager|challenges\.cloudflare)/);
        if (preview) assert.match(html, /name="robots" content="noindex, nofollow"/);
      }
      if (packageName === 'growth') {
        const contact = await readFile(path.join(result.out, 'contact/index.html'), 'utf8');
        assert.match(contact, /<fieldset disabled>/);
        assert.match(contact, /action="#form-setup"/);
      }
      if (preview) {
        assert.match(await readFile(path.join(result.out, 'robots.txt'), 'utf8'), /Disallow: \//);
        assert.match(await readFile(path.join(result.out, '_headers'), 'utf8'), /X-Robots-Tag: noindex, nofollow/);
      }
    }
  }
});

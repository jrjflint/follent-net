import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build, loadConfig, context, headers, root } from '../scripts/build.mjs';
import { document } from '../src/layouts/document.mjs';
import { pageDefinitions } from '../src/pages/content.mjs';
import { submitFormspark } from '../assets/js/form-provider.js';
import { escapeHTML } from '../src/lib/html.mjs';
import { packages, managedPlans } from '../src/data/offers.mjs';

test('all package builds enforce page and form boundaries', async () => {
  const fixture = await loadConfig();
  fixture.privacy.approved = false;
  await mkdir(path.join(root, '.qa'), { recursive: true });
  await writeFile(path.join(root, '.qa/test-disabled.json'), JSON.stringify(fixture));
  for (const variant of ['essential', 'professional', 'growth']) {
    const { out, pages } = await build({ configFile: '.qa/test-disabled.json', output: `.qa/${variant}`, packageOverride: variant });
    assert.equal(pages, variant === 'essential' ? 3 : 10);
    const html = await readFile(path.join(out, variant === 'essential' ? 'index.html' : 'contact/index.html'), 'utf8');
    assert.equal(html.includes('id="enquiry-form"'), variant === 'growth');
    if (variant === 'growth') { assert.match(html, /<fieldset disabled>/); assert.match(html, /data-enabled="false"/); }
    if (variant === 'essential') { assert.match(html, /href="\/#pricing"/); assert.doesNotMatch(html, /href="\/contact\//); }
  }
});
test('configured form has native success and separate error redirects without personal data in URLs', async () => {
  const site = await loadConfig();
  site.package = 'growth';
  site.form.endpoint = 'https://submit-form.com/test-endpoint';
  site.email = 'test@example.com'; site.privacy.approved = true; site.privacy.retention = 'Reviewed retention policy.';
  const ctx = context(site);
  assert.equal(ctx.formEnabled, true);
  const html = document(pageDefinitions.find(p => p.slug === 'contact'), ctx);
  assert.match(html, /action="https:\/\/submit-form.com\/test-endpoint"/);
  assert.ok(html.includes(`name="_error" value="${site.domain}/form-error/"`));
  assert.match(html, /name="_append" value="false"/);
  assert.doesNotMatch(html, /<fieldset disabled>/);
  assert.match(headers(ctx, []), /form-action 'self' https:\/\/submit-form.com/);
  const preview = context(site, { preview: true });
  assert.equal(preview.formEnabled, false);
  assert.equal(preview.analyticsEnabled, false);
});
test('Formspark transport handles success and rejects service or network errors', async () => {
  let request;
  assert.equal(await submitFormspark('https://submit-form.com/test', { email: 'test@example.com' }, async (url, init) => { request = { url, init }; return { ok: true }; }), true);
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers.Accept, 'application/json');
  assert.deepEqual(JSON.parse(request.init.body), { email: 'test@example.com' });
  assert.equal(request.init.credentials, 'omit');
  await assert.rejects(() => submitFormspark('https://submit-form.com/test', {}, async () => ({ ok: false, status: 422 })), /422/);
  await assert.rejects(() => submitFormspark('https://submit-form.com/test', {}, async () => { throw new Error('network'); }), /network/);
});
test('configuration escapes HTML and output deletion cannot target source', async () => {
  assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
  await assert.rejects(() => build({ output: 'src' }), /Output must/);
  await assert.rejects(() => build({ output: '../other' }), /Output must/);
});

test('Formtrack is opt-in and only enabled with an active Growth Formspark form', async () => {
  const site = await loadConfig();
  site.package = 'growth'; site.form.provider = 'formspark'; site.form.endpoint = 'https://submit-form.com/test-endpoint';
  site.privacy.approved = false;
  assert.equal(context(site).formEnabled, false, 'Unreviewed privacy must keep form disabled');
  assert.equal(context(site).formtrackEnabled, false);
  site.email = 'test@example.com'; site.privacy.approved = true; site.privacy.retention = 'QA retention only.';
  site.form.formtrackEnabled = true;
  const page = pageDefinitions.find(p => p.slug === 'contact');
  const ctx = context(site);
  const html = document(page, ctx);
  assert.equal(ctx.formtrackEnabled, true);
  assert.match(html, /<form[^>]* data-formtrack/);
  assert.equal((html.match(/src="https:\/\/unpkg.com\/@formspark\/formtrack"/g) || []).length, 1);
  assert.ok(html.indexOf('https://unpkg.com/@formspark/formtrack') > html.indexOf('</form>'));
  assert.match(headers(ctx, []), /https:\/\/unpkg.com\/@formspark\/formtrack/);
  assert.doesNotMatch(headers(ctx, []), /unsafe-inline|unsafe-eval/);
  assert.doesNotMatch(document(pageDefinitions[0], ctx), /unpkg.com/);
  for (const variant of ['essential', 'professional']) {
    assert.equal(context({ ...site, package: variant }).formtrackEnabled, false);
    assert.doesNotMatch(document(page, context({ ...site, package: variant })), /unpkg.com/);
  }
  const external = structuredClone(site); external.form.provider = 'external'; external.form.externalURL = 'https://example.com/form';
  assert.equal(context(external).formtrackEnabled, false);
  assert.doesNotMatch(document(page, context(external)), /data-formtrack|unpkg.com/);
  assert.equal(context(site, { preview: true }).formtrackEnabled, false);
  site.form.formtrackEnabled = false;
  assert.equal(context(site).formEnabled, true);
  assert.doesNotMatch(document(page, context(site)), /data-formtrack|unpkg.com/);
  assert.doesNotMatch(headers(context(site), []), /unpkg.com/);
});

test('form field contract and selector prices use shared offer data', async () => {
  const site = await loadConfig();
  const html = document(pageDefinitions.find(p => p.slug === 'contact'), context(site));
  for (const name of ['name', 'business_name', 'email', 'phone', 'website', 'need', 'package', 'timeline', 'message', 'consent']) assert.ok(html.includes(`name="${name}"`), `Missing field: ${name}`);
  assert.doesNotMatch(html, /name="business"/);
  for (const offer of [...packages, ...managedPlans]) {
    assert.ok(html.includes(`value="${offer.id}"`));
    assert.ok(html.includes(`$${offer.price.toLocaleString('en-AU')}${managedPlans.includes(offer) ? '/month' : ''} ex GST`));
  }
  assert.match(html, /value="custom">Other \/ custom requirement/);
});

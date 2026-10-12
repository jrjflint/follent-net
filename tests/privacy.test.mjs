import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build, loadConfig, context, root } from '../scripts/build.mjs';
import { privacy, pageDefinitions } from '../src/pages/content.mjs';
import { privacyPolicy } from '../src/pages/privacy-policy.mjs';
import { escapeHTML } from '../src/lib/html.mjs';

test('normal numbered policy and preview share contact, retention and clause structure', async () => {
  const site = await loadConfig();
  site.privacy.contactEmail = 'privacy-test@example.com';
  site.privacy.retention = 'Synthetic retention <reviewed> & confirmed.';
  const clauses = [3, 3, 3, 3, 4, 3, 3, 4, 2].flatMap((count, i) => Array.from({ length: count }, (_, j) => `${i + 1}.${j + 1}`));
  for (const preview of [false, true]) {
    const ctx = context(site, { preview });
    const html = privacy(ctx);
    assert.equal(html, privacyPolicy(ctx));
    assert.deepEqual([...html.matchAll(/<p><strong>(\d\.\d)<\/strong>/g)].map(m => m[1]), clauses);
    assert.equal([...html.matchAll(/<h2 id="policy-\d"/g)].length, 9);
    assert.ok(html.includes(escapeHTML(site.privacy.retention)));
    assert.ok(html.includes('privacy-test@example.com'));
    assert.ok(!html.includes('privacy@follent.net'));
    assert.match(html, /operated by James Follent as a sole trader/);
    assert.equal(html.includes('data-analytics-settings'), ctx.analyticsEnabled);
    if (preview) assert.match(html, /Campaign attribution through Formtrack is disabled/);
  }
  const result = await build({ output: '.qa/privacy-normal-test' });
  const built = await readFile(path.join(result.out, 'privacy-policy/index.html'), 'utf8');
  assert.ok(built.includes(privacyPolicy(result.ctx)));
  assert.equal(pageDefinitions.find(p => p.slug === 'privacy-policy').render, privacy);
});

test('client policy never inherits reference operator or practices and fails closed until adapted', async () => {
  const site = await loadConfig('config/client.example.json');
  site.privacy.contactEmail = 'privacy@garden.example';
  site.legalName = 'Synthetic Garden Operator';
  const html = privacy(context(site));
  assert.match(html, /Synthetic Garden Operator/);
  assert.match(html, /privacy@garden\.example/);
  for (const claim of ['James Follent', 'privacy@follent.net', 'Twenty', 'Microsoft', 'multi-factor authentication']) assert.ok(!html.includes(claim));
  await mkdir(path.join(root, '.qa'), { recursive: true });
  site.privacy.approved = true;
  await writeFile(path.join(root, '.qa/privacy-client-invalid.json'), JSON.stringify(site));
  await assert.rejects(() => loadConfig('.qa/privacy-client-invalid.json'), /Replace and review clientPrivacy/);
  site.privacy.approved = false;
  site.privacy.policy = 'follent';
  await writeFile(path.join(root, '.qa/privacy-client-invalid.json'), JSON.stringify(site));
  await assert.rejects(() => loadConfig('.qa/privacy-client-invalid.json'), /when cloning/);
});

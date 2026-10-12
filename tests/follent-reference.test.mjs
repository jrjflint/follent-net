// Follent business-specific field IDs and commercial prices.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, context } from '../scripts/build.mjs';
import { document } from '../src/layouts/document.mjs';
import { pageDefinitions } from '../src/pages/content.mjs';
import { packages, managedPlans } from '../src/data/offers.mjs';

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

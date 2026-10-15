import test from 'node:test';
import assert from 'node:assert/strict';
import { contactDetails } from '../src/partials/components.mjs';
import { loadConfig, context } from '../scripts/build.mjs';

test('direct contact availability is independent of package and collection approval', async () => {
  const source = await loadConfig();
  for (const tier of ['essential', 'professional', 'growth']) {
    const site = structuredClone(source);
    site.package = tier;
    site.email = ''; site.phone = ''; site.bookingURL = ''; site.googleBusinessProfileURL = '';
    assert.doesNotMatch(contactDetails(site), /cannot.*receive|submission.*disabled/i);
    const ctx = context(site);
    const html = contactDetails(site, { enquiryHref: ctx.formEnabled ? '/contact/' : '' });
    assert.equal(html.includes('Use our enquiry form'), ctx.formEnabled);
    assert.doesNotMatch(contactDetails(site), /href="\/contact\//, 'No self-link without an explicit destination');
    site.form.provider = 'external'; site.form.externalURL = 'https://example.com/intake';
    assert.doesNotMatch(contactDetails(site), /Use our enquiry form/);
  }
  assert.match(contactDetails(source), /mailto:james@follent\.net/);
});

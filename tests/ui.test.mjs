import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, context, headers } from '../scripts/build.mjs';
import { home, contact, pricing } from '../src/pages/content.mjs';
import { document } from '../src/layouts/document.mjs';
import { packages, steps, faqs } from '../src/data/offers.mjs';
import { follentEnquiry } from '../src/data/enquiry.mjs';

test('compact Home keeps shared prices/page allowances and full Essential detail', async () => {
  const site = await loadConfig();
  const growth = home(context(site));
  const detail = pricing(context(site));
  for (const offer of packages) {
    assert.ok(growth.includes(offer.pageAllowance));
    assert.ok(growth.includes(offer.price.toLocaleString('en-AU')));
    assert.ok(growth.includes(`/pricing/#package-${offer.id}`));
    for (const feature of offer.features) assert.ok(detail.includes(feature));
  }
  assert.equal((growth.match(/<details>/g) || []).length, 3);
  site.package = 'essential';
  const essential = home(context(site));
  assert.equal((essential.match(/<details>/g) || []).length, faqs.length);
  for (const [, description] of steps) assert.ok(essential.includes(description));
  for (const offer of packages) for (const feature of offer.features) assert.ok(essential.includes(feature));
  assert.doesNotMatch(essential, /href="\/pricing\//);
});

test('form-first intake preserves business fields and isolates verification from preview output', async () => {
  const site = await loadConfig();
  const ctx = context(site);
  const html = contact(ctx);
  assert.ok(html.indexOf('id="enquiry-form"') < html.indexOf('<aside'));
  assert.deepEqual(follentEnquiry.fields.map(f => f.name), ['name','email','message','need','website','business_name','phone','package','timeline']);
  assert.match(html, /data-size="compact"/);
  assert.match(html, /mailto:james@follent\.net/);
  assert.match(html, /data-verification-status/);
  const page = { slug: 'contact', title: 'Contact', nav: 'Contact', description: 'Enquiry', enquiryForm: true, render: contact };
  const full = document(page, ctx);
  assert.ok(full.indexOf('class="analytics-notice"') < full.indexOf('<main'));
  assert.doesNotMatch(full, /<script src="https:\/\/challenges/);
  assert.match(headers(ctx, []), /frame-src https:\/\/challenges\.cloudflare\.com/);
  const preview = context(site, { preview: true });
  assert.doesNotMatch(document(page, preview), /data-sitekey|data-verification-status|class="analytics-notice"/);
  assert.doesNotMatch(headers(preview, []), /challenges\.cloudflare/);
});

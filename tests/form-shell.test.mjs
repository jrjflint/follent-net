import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, context } from '../scripts/build.mjs';
import { enquiryForm } from '../src/partials/enquiry-form.mjs';
import { follentEnquiry } from '../src/data/enquiry.mjs';
import { gardenFixture, gardenEnquiry } from './garden-fixture.mjs';

test('form shell preserves reference controls and accepts client-specific intake', async () => {
  const reference = await loadConfig();
  const html = enquiryForm(context(reference), follentEnquiry);
  for (const name of ['name', 'business_name', 'email', 'phone', 'website', 'need', 'package', 'timeline', 'message', 'consent', '_gotcha', '_redirect', '_error', '_append']) assert.ok(html.includes(`name="${name}"`));
  assert.match(html, /data-query-field="package"/);
  assert.match(html, /data-conditional-field="website"/);
  assert.match(html, /name="_append" value="false"/);
  const { site, pages } = await gardenFixture();
  const garden = enquiryForm(context(site, { pages }), gardenEnquiry);
  assert.match(garden, /data-query-field="service"/);
  assert.match(garden, /name="service"/);
  assert.match(garden, /<fieldset disabled>/);
  assert.doesNotMatch(garden, /name="package"|name="need"|name="website"|data-conditional-field|Essential|Professional|Lead Capture|\$2,190/);
});

test('intake cannot collide with controls or send free-text analytics selections', async () => {
  const site = await loadConfig();
  for (const [edit, error] of [
    [intake => { intake.fields[0].name = '_redirect'; }, /unique safe names/],
    [intake => { intake.fields[0].name = 'consent'; }, /unique safe names/],
    [intake => { intake.fields[1].name = 'name'; }, /unique safe names/],
    [intake => { intake.analyticsField = 'email'; }, /must name a select/],
    [intake => { intake.condition = { field: 'missing', controller: 'service', hideWhen: 'x' }; }, /reference intake fields/]
  ]) {
    const intake = structuredClone(gardenEnquiry);
    edit(intake);
    assert.throws(() => enquiryForm(context(site), intake), error);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, context, build } from '../scripts/build.mjs';
import { schemaFor } from '../src/layouts/document.mjs';
import { validateConfig } from '../src/lib/config.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('explicit schema selection preserves reference graph and safely describes client identity', async () => {
  const reference = await loadConfig();
  const legacy = structuredClone(reference);
  delete legacy.schemaType;
  const page = { slug: '', nav: 'Home' };
  assert.deepEqual(schemaFor(page, context(reference)), schemaFor(page, context(legacy)));
  const client = await loadConfig('config/client.example.json');
  const graph = schemaFor(page, context(client))['@graph'];
  assert.equal(graph[0]['@type'], 'Organization');
  assert.equal(graph[0].name, client.businessName);
  assert.equal(graph[0].url, client.domain);
  for (const key of ['address', 'aggregateRating', 'review', 'identifier']) assert.equal(key in graph[0], false);
  const result = await build({ configFile: 'config/client.example.json', output: '.qa/schema-client', preview: true });
  const html = await readFile(path.join(result.out, 'index.html'), 'utf8');
  const rendered = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(rendered['@graph'][0]['@type'], 'Organization');
  assert.equal(rendered['@graph'][0].url, client.domain);
});

test('invalid schema tokens fail configuration validation', async () => {
  const site = await loadConfig();
  for (const schemaType of ['', 'Local Business', 'https://schema.org/Organization', '<script>', ['Organization'], 42, 'organization']) {
    assert.throws(() => validateConfig({ ...site, schemaType }), /simple Schema.org type token/);
  }
  assert.equal(validateConfig({ ...site, schemaType: 'Organization' }).schemaType, 'Organization');
});

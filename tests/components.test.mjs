import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { packageCards, process as renderProcess, faq } from '../src/partials/follent-commercial.mjs';

test('generic layout and helpers render a different business without loading Follent data', async () => {
  await mkdir('.qa', { recursive: true });
  await writeFile('.qa/no-commercial-loader.mjs', `export async function resolve(specifier, context, nextResolve) {
    if (/(offers|projects)\\.mjs$/.test(specifier)) throw new Error('Generic rendering loaded Follent data');
    return nextResolve(specifier, context);
  }`);
  const moduleURL = filename => JSON.stringify(pathToFileURL(path.resolve(filename)).href);
  const code = `
    import assert from 'node:assert/strict';
    import { button, intro, contactDetails } from ${moduleURL('src/partials/components.mjs')};
    import { document } from ${moduleURL('src/layouts/document.mjs')};
    const site = JSON.parse(${JSON.stringify(await readFile('config/client.example.json', 'utf8'))});
    site.businessName = 'Synthetic Garden Care'; site.email = 'garden@example.com';
    const ctx = { site, isEssential: false, route: slug => '/' + slug + '/', primaryHref: '/contact/', analyticsEnabled: false, formEnabled: false, preview: true };
    const page = { slug: '', nav: 'Home', title: 'Garden care', description: 'Synthetic garden fixture', render: () => '<h1>Garden care</h1>' + intro('Services', 'Practical garden care') + button('/contact/', 'Ask about garden care') + contactDetails(site) };
    const html = document(page, ctx);
    assert.ok(html.includes('Synthetic Garden Care'));
    assert.ok(html.includes('garden@example.com'));
    for (const text of ['Follent.net', '$2,190', 'Managed Lead Capture']) assert.ok(!html.includes(text));
  `;
  const run = spawnSync(process.execPath, ['--experimental-loader', pathToFileURL(path.resolve('.qa/no-commercial-loader.mjs')).href, '--input-type=module', '--eval', code], { encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 0, run.stdout + run.stderr);
});

test('commercial sections use only their supplied catalogue and process data', () => {
  const ctx = { contactURL: id => `/contact/?package=${id}` };
  const offer = { id: 'synthetic', name: 'Synthetic plan', promise: 'Synthetic promise', description: 'Test only', price: 123, features: ['Synthetic feature'], note: 'Synthetic note', recommended: false };
  const html = packageCards(ctx, [offer]);
  assert.match(html, /Synthetic plan/);
  assert.match(html, /\$123/);
  assert.doesNotMatch(html, /\$2,190|Essential|Professional|Growth/);
  assert.match(renderProcess([['Synthetic step', 'Synthetic description']]), /Synthetic step/);
  assert.match(faq([['Synthetic question', 'Synthetic answer']]), /Synthetic answer/);
});

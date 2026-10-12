import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { build, context, loadConfig, root } from '../scripts/build.mjs';
import { document } from '../src/layouts/document.mjs';

const all = ['essential', 'professional', 'growth'];
const multi = ['professional', 'growth'];
function fixturePages() {
  const simple = (slug, packages, render, extra = {}) => ({ slug, packages, nav: slug || 'Home', title: `Synthetic ${slug || 'home'}`, description: `Synthetic ${slug || 'home'} description`, render, ...extra });
  return [
    simple('', all, () => '<h1>Garden care</h1><section id="care"><h2>Care</h2></section><section id="contact"><h2>Contact</h2></section>'),
    simple('services', multi, () => '<h1>Garden services</h1>', { essentialSection: 'care', navigation: { order: 10, packages: all } }),
    simple('contact', multi, () => '<h1>Garden enquiries</h1>', { essentialSection: 'contact', navigation: { order: 20, packages: all } }),
    simple('about', multi, () => '<h1>About the garden fixture</h1>', { navigation: { order: 30, packages: multi } }),
    simple('privacy-policy', all, () => '<h1>Synthetic privacy</h1>', { utility: true }),
    simple('404', all, () => '<h1>Not found</h1>', { utility: true, noindex: true })
  ];
}

test('manifest addition/removal updates navigation, output and Essential routes without engine edits', async () => {
  const site = await loadConfig('config/client.example.json');
  const pages = fixturePages().filter(page => page.slug !== 'about');
  pages.push({ slug: 'garden-advice', packages: multi, nav: 'Advice', title: 'Garden advice', description: 'Synthetic advice fixture', render: () => '<h1>Garden advice</h1>', navigation: { order: 30, packages: multi } });
  for (const packageName of all) {
    const ctx = context({ ...site, package: packageName }, { pages });
    assert.ok(!ctx.navigation.some(item => item.slug === 'about'));
    assert.equal(ctx.route('services'), packageName === 'essential' ? '/#care' : '/services/');
    assert.equal(ctx.route(''), '/');
    const result = await build({ configFile: 'config/client.example.json', output: `.qa/manifest-${packageName}`, packageOverride: packageName, pages, preview: true });
    const home = await readFile(path.join(result.out, 'index.html'), 'utf8');
    assert.doesNotMatch(home, /href="\/about\/"/);
    if (packageName === 'essential') {
      assert.match(home, /href="\/#care"/);
      assert.doesNotMatch(home, /href="\/garden-advice\/"/);
    } else assert.match(home, /href="\/garden-advice\/"/);
    const check = spawnSync(process.execPath, ['scripts/check.mjs', '--dir', `.qa/manifest-${packageName}`], { cwd: root, encoding: 'utf8', windowsHide: true });
    assert.equal(check.status, 0, check.stdout + check.stderr);
  }
});

test('invalid manifests and missing targets fail before replacing previous output', async () => {
  const output = '.qa/manifest-invalid';
  for (const [edit, pattern, packageOverride] of [
    [pages => { pages[1].slug = '../escape'; }, /safe, lowercase/, 'growth'],
    [pages => { pages[1].slug = ''; }, /Duplicate page slug/, 'growth'],
    [pages => { pages[1].render = undefined; }, /render function/, 'growth'],
    [pages => { pages[1].packages = ['unknown']; }, /supported packages/, 'growth'],
    [pages => { delete pages[1].essentialSection; }, /navigation has no target/, 'essential'],
    [pages => { pages[1].essentialSection = 'missing'; }, /Missing Essential section/, 'essential'],
    [pages => { pages.splice(pages.findIndex(p => p.slug === 'privacy-policy'), 1); }, /privacy-policy utility/, 'growth'],
    [pages => { pages[0].render = ctx => ctx.route('missing-page'); }, /Unknown page destination/, 'growth']
  ]) {
    const pages = fixturePages();
    edit(pages);
    await mkdir(output, { recursive: true });
    await writeFile(`${output}/keep.txt`, 'previous output');
    await assert.rejects(() => build({ configFile: 'config/client.example.json', output, pages, packageOverride }), pattern);
    assert.equal(await readFile(`${output}/keep.txt`, 'utf8'), 'previous output');
  }
});

test('enquiry script placement follows page metadata rather than contact slug', async () => {
  const site = await loadConfig();
  const page = { ...fixturePages()[2], slug: 'request-care', enquiryForm: true };
  const pages = fixturePages().filter(p => p.slug !== 'contact');
  pages.push(page);
  // Contact CTA is explicitly replaced with the renamed destination in this client fixture.
  site.primaryCTA.href = '/request-care/';
  const html = document(page, context(site, { pages }));
  assert.match(html, /src="\/assets\/js\/form.js"/);
  assert.match(html, /src="https:\/\/unpkg.com\/@formspark\/formtrack"/);
});

test('removed CTA pages and missing CTA fragments fail before output replacement', async () => {
  const site = await loadConfig('config/client.example.json');
  for (const [href, pattern] of [['/missing/', /no page destination/], ['/#missing', /no section destination/]]) {
    site.primaryCTA.href = href;
    await mkdir('.qa/manifest-cta', { recursive: true });
    await writeFile('.qa/manifest-cta/keep.txt', 'previous output');
    await writeFile('.qa/manifest-cta-config.json', JSON.stringify(site));
    await assert.rejects(() => build({ configFile: '.qa/manifest-cta-config.json', pages: fixturePages(), output: '.qa/manifest-cta' }), pattern);
    assert.equal(await readFile('.qa/manifest-cta/keep.txt', 'utf8'), 'previous output');
  }
});

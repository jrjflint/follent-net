import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { root, loadConfig, context } from './build.mjs';
const args = process.argv.slice(2);
const requestedDirectory = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'dist';
const directory = path.resolve(root, requestedDirectory);
if (!(directory === path.join(root, 'dist') || directory.startsWith(path.join(root, '.qa') + path.sep))) throw new Error('Check only generated output');
let failures = 0;
const assert = (condition, message) => { if (!condition) { console.error(`FAIL: ${message}`); failures++; } };
async function walk(dir) { const entries = await readdir(dir, { withFileTypes: true }); return (await Promise.all(entries.map(x => x.isDirectory() ? walk(path.join(dir, x.name)) : path.join(dir, x.name)))).flat(); }
const files = await walk(directory);
const titles = new Set();
const descriptions = new Set();
const documents = new Map();
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  documents.set(file, html);
  assert((html.match(/<h1\b/g) || []).length === 1, `${file}: one h1`);
  assert(html.includes('lang="en-AU"'), `${file}: Australian language`);
  assert(html.includes('href="#main"'), `${file}: skip link`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(title && !titles.has(title), `${file}: unique title`); titles.add(title);
  assert(desc && !descriptions.has(desc), `${file}: unique description`); descriptions.add(desc);
  assert(/rel="canonical" href="https:\/\//.test(html), `${file}: canonical`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { const s = JSON.parse(match[1]); assert(s['@context'] === 'https://schema.org', `${file}: schema context`); } catch { assert(false, `${file}: invalid JSON-LD`); }
  }
  assert(!/<img\b(?![^>]*\balt=)/.test(html), `${file}: images need alt`);
  assert(!/woocommerce|wp-content|shopping-cart|FORMSPARK_FORM_ID/i.test(html), `${file}: no obsolete platform or live placeholder endpoint`);
}
for (const [file, html] of documents) {
  for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    const parsed = new URL(match[1].replace(/&amp;/g, '&'), 'https://test.local');
    let target = path.join(directory, parsed.pathname);
    if (parsed.pathname.endsWith('/')) target = path.join(target, 'index.html');
    try { await access(target); } catch { assert(false, `${file}: broken local link ${match[1]}`); continue; }
    if (parsed.hash && documents.has(target)) {
      const id = decodeURIComponent(parsed.hash.slice(1));
      assert(documents.get(target).includes(`id="${id}"`), `${file}: missing anchor ${match[1]}`);
    }
  }
}
for (const required of ['robots.txt', 'sitemap.xml', '_headers', '_redirects']) assert(files.some(f => path.basename(f) === required), `missing ${required}`);
const s = await loadConfig();
const ctx = context(s);
if (process.argv.includes('--launch')) {
  assert(s.launch.migrationReviewed, 'Migration URL map must be reviewed');
  assert(s.launch.businessDetailsReviewed, 'Business details must be reviewed');
  assert(Boolean(s.email || s.phone || s.bookingURL), 'Supply at least one live contact option');
  assert(s.privacy.approved && Boolean(s.privacy.retention) && Boolean(s.privacy.contactEmail || s.email), 'Privacy notice needs review, retention and contact details');
  if (s.package === 'growth') assert(ctx.formEnabled || (s.form.provider === 'external' && s.form.externalURL), 'Growth needs a configured form');
  const home = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert(!home.includes('noindex, nofollow'), 'Do not launch a preview build');
}
console.log(`${documents.size} HTML pages checked; ${failures} failure(s).${process.argv.includes('--launch') ? '' : ' Launch setup is checked separately with npm run check:launch.'}`);
process.exitCode = failures ? 1 : 0;

import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { root, loadConfig, context, configPath } from './build.mjs';
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
let info;
let infoError;
try { info = JSON.parse(await readFile(path.join(directory, 'build-info.json'), 'utf8')); }
catch (error) { info = {}; if (error.code !== 'ENOENT') infoError = 'Invalid build-info.json; rebuild before launch checks'; }
if (!info || typeof info !== 'object' || Array.isArray(info)) { info = {}; infoError = 'Invalid build-info.json; rebuild before launch checks'; }
const configArgument = args.includes('--config') ? args[args.indexOf('--config') + 1] : undefined;
const explicitConfig = configArgument && !configArgument.startsWith('--') ? configArgument : undefined;
let provenanceValid = true;
if (process.argv.includes('--launch') && infoError) { assert(false, infoError); provenanceValid = false; }
if (args.includes('--config') && !explicitConfig) { assert(false, '--config requires a path'); provenanceValid = false; }
if (explicitConfig && info.configFile) {
  try {
    const normalized = filename => process.platform === 'win32' ? configPath(filename).toLowerCase() : configPath(filename);
    if (normalized(explicitConfig) !== normalized(info.configFile)) { assert(false, '--config disagrees with build-info configFile'); provenanceValid = false; }
  } catch (error) { assert(false, error.message); provenanceValid = false; }
}
if (process.argv.includes('--launch') && provenanceValid) {
  const filename = explicitConfig || info.configFile;
  if (!filename) { assert(false, 'Older output has no config provenance; supply --config explicitly for launch checks'); provenanceValid = false; }
  let s;
  if (provenanceValid) {
    try {
      if (info.configFile) {
        const digest = createHash('sha256').update(await readFile(configPath(filename))).digest('hex');
        if (digest !== info.configHash) throw new Error('Configuration changed since build; rebuild before launch checks');
      }
      s = await loadConfig(filename);
      if (info.package !== undefined && !['essential', 'professional', 'growth'].includes(info.package)) throw new Error('Invalid package in build-info');
    } catch (error) { assert(false, error.message); provenanceValid = false; }
  }
  if (provenanceValid) {
  const ctx = context({ ...s, package: info.package || s.package }, { preview: info.preview === true });
  assert(s.launch.migrationReviewed, 'Migration URL map must be reviewed');
  assert(s.launch.businessDetailsReviewed, 'Business details must be reviewed');
  assert(Boolean(s.email || s.phone || s.bookingURL), 'Supply at least one live contact option');
  assert(s.privacy.approved && Boolean(s.privacy.retention) && Boolean(s.privacy.contactEmail || s.email), 'Privacy notice needs review, retention and contact details');
  if (ctx.site.package === 'growth') assert(ctx.formEnabled || (s.form.provider === 'external' && s.form.externalURL), 'Growth needs a configured form');
  const home = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert(!home.includes('noindex, nofollow'), 'Do not launch a preview build');
  }
}
console.log(`${documents.size} HTML pages checked; ${failures} failure(s).${process.argv.includes('--launch') ? '' : ' Launch setup is checked separately with npm run check:launch.'}`);
process.exitCode = failures ? 1 : 0;

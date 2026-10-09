// Local review only. The normal build never imports this draft.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { build, headers } from '../../scripts/build.mjs';
import { document } from '../../src/layouts/document.mjs';

const { out, ctx } = await build({ output: '.qa/privacy-review', preview: true });
const policy = await readFile(new URL('./policy.html', import.meta.url), 'utf8');
const page = {
  slug: 'privacy-policy', nav: 'Privacy', title: 'Privacy Policy — unpublished review',
  description: 'How Follent.net handles personal information, privacy requests and complaints.',
  render: () => policy
};
const info = JSON.parse(await readFile(path.join(out, 'build-info.json'), 'utf8'));
const hashes = new Set();
// The source page and privacy links use the preserved /privacy-policy/ URL.
for (const slug of info.pages) {
  const filename = path.join(out, slug === '404' ? '404.html' : `${slug}/index.html`);
  const html = slug === page.slug
    ? document(page, ctx)
    : await readFile(filename, 'utf8');
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, html);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  }
}
await writeFile(path.join(out, '_headers'), headers(ctx, hashes));
// No indexable review URLs; robots and X-Robots-Tag also prohibit indexing.
await writeFile(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
await writeFile(path.join(out, 'build-info.json'), JSON.stringify({ ...info, unpublishedPrivacyDraft: true }, null, 2));
console.log('Unpublished draft: .qa/privacy-review/privacy-policy/index.html');
console.log('Review locally: node scripts/serve.mjs --dir .qa/privacy-review --port 4173');

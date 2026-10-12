// Build the normal page renderer with local review safeguards; no page replacement.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from '../../scripts/build.mjs';
const { out } = await build({ output: '.qa/privacy-review', preview: true });
const info = JSON.parse(await readFile(path.join(out, 'build-info.json'), 'utf8'));
await writeFile(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
await writeFile(path.join(out, 'build-info.json'), JSON.stringify({ ...info, unpublishedPrivacyDraft: true }, null, 2));
console.log('Local policy review: .qa/privacy-review/privacy-policy/index.html');
console.log('Review: node scripts/serve.mjs --dir .qa/privacy-review --port 4173');

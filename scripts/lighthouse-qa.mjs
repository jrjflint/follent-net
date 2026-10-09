// Optional Lighthouse CLI installed under .qa/tools, not a site dependency.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
const run = promisify(execFile);
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' };
const allPages = ['home', 'services', 'pricing', 'how-it-works', 'about', 'contact'];
const selected = process.argv.slice(2).length ? process.argv.slice(2) : allPages;
if (selected.some(slug => !allPages.includes(slug))) throw new Error('Unknown page selection');
let results = [];
if (selected.length !== allPages.length) {
  try { results = JSON.parse(await readFile(path.join(root, '.qa/lighthouse-summary.json'), 'utf8')).filter(r => !selected.includes(r.slug)); } catch { /* First partial run. */ }
}
for (const slug of selected) {
  const url = base + (slug === 'home' ? '/' : `/${slug}/`);
  const output = path.join(root, `.qa/lighthouse-${slug}.json`);
  await run(process.execPath, ['.qa/tools/node_modules/lighthouse/cli/index.js', url, '--chrome-flags=--headless', '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${output}`, '--quiet'], { cwd: root, env, windowsHide: true, timeout: 120000 });
  const report = JSON.parse(await readFile(output, 'utf8'));
  const scores = Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
  const result = { slug, scores, lcp: report.audits['largest-contentful-paint'].displayValue, cls: report.audits['cumulative-layout-shift'].displayValue, version: report.lighthouseVersion };
  results.push(result);
  console.log(`${slug}: ${JSON.stringify(scores)}`);
}
await writeFile(path.join(root, '.qa/lighthouse-summary.json'), JSON.stringify(results, null, 2));
process.exitCode = results.some(r => Object.values(r.scores).some(s => s < 95)) ? 1 : 0;

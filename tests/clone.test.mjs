import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { gardenFixture } from './garden-fixture.mjs';
import { build, root } from '../scripts/build.mjs';

test('different-business fixture preserves package gates without inherited business facts', async () => {
  const { site, pages } = await gardenFixture();
  await mkdir('.qa', { recursive: true });
  await writeFile('.qa/garden-test-config.json', JSON.stringify(site));
  for (const packageName of ['essential', 'professional', 'growth']) {
    const result = await build({ configFile: '.qa/garden-test-config.json', pages, packageOverride: packageName, output: `.qa/garden-${packageName}` });
    assert.equal(result.pages, pages.filter(page => page.packages.includes(packageName)).length);
    assert.equal(result.ctx.formEnabled, false);
    assert.equal(result.ctx.analyticsEnabled, false);
    const home = await readFile(path.join(result.out, 'index.html'), 'utf8');
    const privacy = await readFile(path.join(result.out, 'privacy-policy/index.html'), 'utf8');
    assert.match(home, /Synthetic Garden Care/);
    assert.match(home, /https:\/\/garden\.example\//);
    assert.match(home, /"@type":"Organization"/);
    assert.match(privacy, /privacy@garden\.example/);
    for (const value of ['Follent.net', 'James Follent', '$2,190', 'Managed Lead Capture', 'privacy@follent.net', 'Twenty', 'multi-factor authentication', 'G-K54S78JQ7L', 'aHeuOMHHg']) assert.ok(!(home + privacy).includes(value), `Inherited business fact: ${value}`);
    const check = spawnSync(process.execPath, ['scripts/check.mjs', '--dir', `.qa/garden-${packageName}`], { cwd: root, encoding: 'utf8', windowsHide: true });
    assert.equal(check.status, 0, check.stdout + check.stderr);
  }
});

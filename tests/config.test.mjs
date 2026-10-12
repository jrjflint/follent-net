import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { validateConfig } from '../src/lib/config.mjs';
import { build, loadConfig, root } from '../scripts/build.mjs';

test('invalid configuration cannot enable string approvals or replace previous output', async () => {
  const original = await loadConfig();
  for (const [edit, error] of [
    [s => { s.form = null; }, /form must be an object/],
    [s => { s.privacy.approved = 'false'; }, /privacy.approved must be a boolean/],
    [s => { s.launch.migrationReviewed = 'false'; }, /launch.migrationReviewed must be a boolean/],
    [s => { s.privacy.contactEmail = 'not-an-email'; }, /privacy.contactEmail must be a valid email/],
    [s => { s.socialURLs = null; }, /socialURLs must be an array/],
    [s => { s.analytics.measurementId = 123; }, /analytics.measurementId must be a string/],
    [s => { s.primaryCTA.href = ''; }, /primaryCTA.href must be a non-empty string/],
    [s => { s.bookingURL = 'https://'; }, /bookingURL must use an allowed URL/],
    [s => { s.redirects = [{ from: '/old/', to: '/new/', status: 301, reviewed: 'true' }]; }, /reviewed must be a boolean/],
    [s => { s.redirects = [{ from: '/old/', to: '/old/', status: 301, reviewed: true }]; }, /invalid redirect destination/]
  ]) {
    const fixture = structuredClone(original);
    edit(fixture);
    assert.throws(() => validateConfig(fixture), error);
    await mkdir('.qa/config-validation-output', { recursive: true });
    await writeFile('.qa/config-validation-output/keep.txt', 'previous output');
    await writeFile('.qa/config-invalid.json', JSON.stringify(fixture));
    await assert.rejects(() => build({ configFile: '.qa/config-invalid.json', output: '.qa/config-validation-output' }), error);
    assert.equal(await readFile('.qa/config-validation-output/keep.txt', 'utf8'), 'previous output');
  }
  await assert.rejects(() => loadConfig('../outside.json'), /inside the repository/);
});

test('launch checks bind to build config, reject mismatch/stale input and support explicit legacy input', async () => {
  const config = await loadConfig();
  config.email = 'synthetic@example.com';
  config.launch = { migrationReviewed: true, businessDetailsReviewed: true };
  await mkdir('.qa', { recursive: true });
  await writeFile('.qa/launch-config.json', JSON.stringify(config));
  const output = '.qa/launch-provenance';
  const result = await build({ configFile: '.qa/launch-config.json', output, packageOverride: 'professional' });
  const info = JSON.parse(await readFile(path.join(result.out, 'build-info.json'), 'utf8'));
  assert.equal(info.configFile, '.qa/launch-config.json');
  assert.match(info.configHash, /^[a-f0-9]{64}$/);
  const check = (...args) => spawnSync(process.execPath, ['scripts/check.mjs', '--dir', output, ...args], { cwd: root, encoding: 'utf8', windowsHide: true });
  let run = check('--launch');
  assert.equal(run.status, 0, run.stdout + run.stderr);
  run = check('--launch', '--config', 'config/site.json');
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /disagrees/);
  config.launch.businessDetailsReviewed = false;
  await writeFile('.qa/launch-config.json', JSON.stringify(config));
  run = check('--launch');
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /changed since build/);
  delete info.configFile;
  delete info.configHash;
  await writeFile(path.join(result.out, 'build-info.json'), JSON.stringify(info));
  assert.equal(check().status, 0, 'Legacy structural checking remains supported');
  assert.match(check('--launch').stderr, /supply --config explicitly/);
  run = check('--launch', '--config', '.qa/launch-config.json');
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /Business details must be reviewed/);
  config.launch.businessDetailsReviewed = true;
  await writeFile('.qa/launch-config.json', JSON.stringify(config));
  run = check('--launch', '--config', '.qa/launch-config.json');
  assert.equal(run.status, 0, run.stdout + run.stderr);
});

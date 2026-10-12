import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { checkDocs } from '../scripts/check-docs.mjs';

test('documentation checks relative links, headings, references and commands without requiring ignored evidence', async () => {
  const root = path.resolve('.qa/docs-positive');
  await mkdir(path.join(root, 'docs'), { recursive: true });
  await mkdir(path.join(root, '.qa'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ scripts: { build: 'echo build', 'check:docs': 'echo check' } }));
  await writeFile(path.join(root, 'docs', 'A guide.md'), '# Guide\n## Repeat\n## Repeat\n## Café — review\n<a id="explicit"></a>\n```md\n## Fake\n```');
  await writeFile(path.join(root, 'README.md'), '# Start\n[guide](<docs/A guide.md#repeat-1>)\n[unicode](docs/A%20guide.md#caf%C3%A9--review)\n[anchor][details]\n[details]: <docs/A guide.md#explicit> "Guide"\n[self](#start)\n[artifact](.qa/not-retained.png)\n[external](https://example.com/missing)\n```md\n[example](missing-example.md)\n```\n```sh\nnpm run build\nnpm run check:docs\n```');
  await writeFile(path.join(root, '.qa', 'ignored.md'), '[broken](missing.md)\nnpm run missing');
  const result = await checkDocs(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.documents, 2);
  assert.equal(result.commands, 2);
  assert.equal(result.ignoredEvidence, 1);
  const run = spawnSync(process.execPath, ['scripts/check-docs.mjs', '--root', root], { encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 0, run.stdout + run.stderr);
});

test('documentation checker fails missing paths/fragments/scripts and undefined references', async () => {
  const root = path.resolve('.qa/docs-negative');
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, 'package.json'), '{"scripts":{}}');
  await writeFile(path.join(root, 'README.md'), '# Valid\n[missing](missing.md)\n[fragment](#absent)\n[reference][absent]\n[outside](../outside.md)\n```sh\nnpm run nonexistent\n```');
  const result = await checkDocs(root);
  assert.equal(result.errors.length, 5);
  for (const reason of ['missing target', 'missing Markdown fragment', 'nonexistent npm script', 'undefined reference', 'outside repository']) assert.ok(result.errors.some(error => error.includes(reason)), reason);
  const run = spawnSync(process.execPath, ['scripts/check-docs.mjs', '--root', root], { encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 1);
});

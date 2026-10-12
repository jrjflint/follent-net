import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ignored = new Set(['dist', 'node_modules', '.qa']);
const slash = value => value.split(path.sep).join('/');
function withoutFences(text) {
  let fence;
  return text.split('\n').map(line => {
    const match = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (match && (!fence || (match[1][0] === fence[0] && match[1].length >= fence.length))) { fence = fence ? undefined : match[1]; return ''; }
    return fence ? '' : line;
  }).join('\n');
}
function anchors(text) {
  const result = new Set(), counts = new Map();
  const prose = withoutFences(text);
  for (const match of prose.matchAll(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const slug = match[1].replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/\s/g, '-');
    const number = counts.get(slug) || 0;
    let anchor = number ? `${slug}-${number}` : slug;
    while (result.has(anchor)) { counts.set(slug, (counts.get(slug) || number) + 1); anchor = `${slug}-${counts.get(slug)}`; }
    counts.set(slug, (counts.get(slug) || number) + 1);
    result.add(anchor);
  }
  for (const match of prose.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) result.add(match[1]);
  return result;
}
function destination(raw) {
  const match = /^(?:<([^>]+)>|(\S+?))(?:\s+["'][\s\S]*["'])?$/.exec(raw.trim());
  return match ? match[1] || match[2] : raw.trim();
}
async function documents(root, directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ignored.has(entry.name) || entry.isSymbolicLink()) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await documents(root, filename));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(filename);
  }
  return files.sort();
}

export async function checkDocs(root = process.cwd()) {
  root = path.resolve(root);
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const result = { documents: 0, links: 0, commands: 0, ignoredEvidence: 0, errors: [] };
  const texts = new Map();
  const read = async filename => {
    if (!texts.has(filename)) texts.set(filename, await readFile(filename, 'utf8'));
    return texts.get(filename);
  };
  for (const filename of await documents(root)) {
    result.documents++;
    const text = (await read(filename)).replace(/<!--[\s\S]*?-->/g, '');
    const prose = withoutFences(text);
    const label = slash(path.relative(root, filename));
    const references = new Map();
    const targets = [];
    for (const match of prose.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(.+)$/gm)) {
      const href = destination(match[2]);
      references.set(match[1].trim().toLowerCase(), href); targets.push(href);
    }
    for (const match of prose.matchAll(/\[[^\]\n]*\]\((<[^>]+>|[^)\n]+)\)/g)) targets.push(destination(match[1]));
    for (const match of prose.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
      const key = (match[2] || match[1]).trim().toLowerCase();
      if (!references.has(key)) result.errors.push(`${label}: undefined reference [${key}]`);
    }
    for (const href of targets) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue;
      result.links++;
      try {
        const [rawTarget, rawFragment] = href.split('#');
        const target = decodeURIComponent(rawTarget.split('?')[0]);
        const resolved = target ? path.resolve(path.dirname(filename), target) : filename;
        const relative = slash(path.relative(root, resolved));
        if (relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) throw new Error('target is outside repository');
        if (relative.split('/').some(segment => ignored.has(segment))) { result.ignoredEvidence++; continue; }
        const info = await stat(resolved);
        if (rawFragment && info.isFile() && resolved.endsWith('.md') && !anchors(await read(resolved)).has(decodeURIComponent(rawFragment))) throw new Error('missing Markdown fragment');
      } catch (error) { result.errors.push(`${label}: ${href} (${error.code === 'ENOENT' ? 'missing target' : error.message})`); }
    }
    // Include commands in code fences: these are the instructions readers run.
    for (const match of text.matchAll(/\bnpm\s+run\s+([\w:-]+)/g)) {
      result.commands++;
      if (!Object.hasOwn(pkg.scripts || {}, match[1])) result.errors.push(`${label}: nonexistent npm script ${match[1]}`);
    }
  }
  return result;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.length && !(args.length === 2 && args[0] === '--root')) throw new Error('Usage: node scripts/check-docs.mjs [--root directory]');
  const result = await checkDocs(args[1]);
  console.log(`${result.documents} documents; ${result.links} local links; ${result.commands} npm commands; ${result.ignoredEvidence} ignored artifact links; ${result.errors.length} failure(s).`);
  for (const error of result.errors) console.error(error);
  process.exitCode = result.errors.length ? 1 : 0;
}

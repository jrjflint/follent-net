import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';
const args = process.argv.slice(2);
const arg = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const directory = path.resolve(root, arg('--dir', 'dist'));
if (!(directory === path.join(root, 'dist') || directory.startsWith(path.join(root, '.qa') + path.sep))) throw new Error('Serve only generated output');
const port = Number(arg('--port', '4173'));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const headerText = await readFile(path.join(directory, '_headers'), 'utf8');
const globalHeaders = {};
for (const line of headerText.split('\n').slice(1)) {
  if (line && !line.startsWith(' ')) break;
  const match = line.match(/^  ([^:]+): (.*)$/);
  if (match) globalHeaders[match[1]] = match[2];
}
// Cloudflare terminates HTTPS. Do not force an HTTP localhost preview to HTTPS.
if (globalHeaders['Content-Security-Policy']) globalHeaders['Content-Security-Policy'] = globalHeaders['Content-Security-Policy'].replace('; upgrade-insecure-requests', '');
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    let filename = path.resolve(directory, '.' + pathname);
    if (!filename.startsWith(directory + path.sep) && filename !== directory) { response.writeHead(403); response.end(); return; }
    let code = 200;
    try { if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html'); }
    catch { filename = path.join(directory, '404.html'); code = 404; }
    const content = await readFile(filename);
    response.writeHead(code, { ...globalHeaders, 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch { response.writeHead(500); response.end('Preview server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));

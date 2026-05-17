import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || '127.0.0.1';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

function resolvePath(url) {
  const cleanUrl = decodeURIComponent(url.split('?')[0]);
  const requested = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const candidate = normalize(join(root, requested));
  return candidate.startsWith(root) ? candidate : join(root, 'index.html');
}

createServer((req, res) => {
  const filePath = resolvePath(req.url || '/');
  const finalPath = existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(root, 'index.html');
  res.setHeader('Content-Type', mime[extname(finalPath)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  createReadStream(finalPath).pipe(res);
}).listen(port, host, () => {
  console.log(`Kiosk prototype running at http://localhost:${port}`);
});

// 編集用ローカルサーバー（127.0.0.1 限定）。http://localhost:8765/ を開くと編集モードが使える。
// 編集UIの「保存」で data.json を更新し、同時に data.enc を再生成する。公開は git push で行う。
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { encryptData } from './encrypt.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), PORT = +process.env.PORT || 8765;
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.enc': 'application/json', '.js': 'text/javascript', '.css': 'text/css' };
const ALLOWED = new Set(['/index.html', '/data.json', '/data.enc']);
const okOrigin = req => { const o = req.headers.origin; return !o || o === `http://localhost:${PORT}` || o === `http://127.0.0.1:${PORT}`; };

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://x').pathname === '/' ? '/index.html' : new URL(req.url, 'http://x').pathname;
    if (req.method === 'POST' && path === '/api/save') {
      if (!okOrigin(req) || req.headers['x-wg-admin'] !== '1') { res.writeHead(403); return res.end('forbidden'); }
      let body = ''; for await (const c of req) { body += c; if (body.length > 5e6) throw new Error('too large'); }
      const data = JSON.parse(body); if (!Array.isArray(data.nodes) || !Array.isArray(data.edges) || !Array.isArray(data.rings)) throw new Error('invalid data');
      const text = JSON.stringify(data, null, 2) + '\n'; await writeFile(join(ROOT, 'data.json'), text); const url = await encryptData(text);
      res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, url }));
    }
    if (req.method !== 'GET' || !ALLOWED.has(path)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(await readFile(join(ROOT, path)));
  } catch (e) { res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }); res.end(String(e.message || e)); }
}).listen(PORT, '127.0.0.1', () => console.log(`編集サーバー起動: http://localhost:${PORT}/`));

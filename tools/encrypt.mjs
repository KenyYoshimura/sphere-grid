// data.json（平文・手元のみ）を AES-GCM で暗号化して data.enc（公開用）を作る。
// 鍵は .sphere-key（gitignore 済み）。閲覧URLは  <公開URL>/#k=<鍵>  の形で、鍵は # 以降なのでサーバーには送られない。
//   node tools/encrypt.mjs            暗号化して閲覧URLを表示
//   node tools/encrypt.mjs --rotate   鍵を作り直す（旧URLは無効になる）
import { webcrypto, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY_FILE = join(ROOT, '.sphere-key'), DATA = join(ROOT, 'data.json'), OUT = join(ROOT, 'data.enc');
export const VIEW_BASE = 'https://kenyyoshimura.github.io/sphere-grid/';
const b64 = buf => Buffer.from(buf).toString('base64');
const b64u = buf => b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function loadKey(rotate = false) {
  if (rotate || !existsSync(KEY_FILE)) writeFileSync(KEY_FILE, b64u(randomBytes(32)) + '\n', { mode: 0o600 });
  return readFileSync(KEY_FILE, 'utf8').trim();
}

export async function encryptData(jsonText, rotate = false) {
  const keyStr = loadKey(rotate);
  const key = await webcrypto.subtle.importKey('raw', Buffer.from(keyStr.replace(/-/g, '+').replace(/_/g, '/'), 'base64'), 'AES-GCM', false, ['encrypt']);
  const iv = randomBytes(12);
  const ct = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(JSON.parse(jsonText))));
  writeFileSync(OUT, JSON.stringify({ v: 1, iv: b64(iv), ct: b64(new Uint8Array(ct)) }));
  return `${VIEW_BASE}#k=${keyStr}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const url = await encryptData(readFileSync(DATA, 'utf8'), process.argv.includes('--rotate'));
  console.log('data.enc を更新しました。\n\nNotion に貼る閲覧URL（社外に出さないこと）:\n' + url);
}

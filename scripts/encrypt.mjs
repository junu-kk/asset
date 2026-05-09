import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { webcrypto } from 'crypto';

const PBKDF2_ITERATIONS = 200000;
const SALT_LEN = 16;
const IV_LEN = 12;

function toBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}

async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const baseKey = await webcrypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );
}

async function encrypt(plaintext, password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_LEN));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const ct = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  );
  return {
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(ct)),
  };
}

async function main() {
  const password = process.env.ASSET_KEY;
  if (!password) {
    console.log('[encrypt] ASSET_KEY 환경변수 없음 — 암호화 skip');
    return;
  }
  const monthsPath = resolve('src/data/months.json');
  if (!existsSync(monthsPath)) {
    console.log('[encrypt] src/data/months.json 없음 — 암호화 skip');
    return;
  }
  const plaintext = readFileSync(monthsPath, 'utf-8');
  // 검증: 파싱되는지
  JSON.parse(plaintext);
  const payload = await encrypt(plaintext, password);
  const outPath = resolve('dist/encrypted.json');
  writeFileSync(outPath, JSON.stringify(payload));
  console.log(`[encrypt] dist/encrypted.json 생성됨 (${plaintext.length} bytes 평문)`);
}

main().catch((err) => {
  console.error('[encrypt] 실패:', err);
  process.exit(1);
});

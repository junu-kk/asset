import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './crypto';

describe('crypto (AES-GCM + PBKDF2)', () => {
  it('encrypt → decrypt 라운드트립', async () => {
    const text = 'hello world 안녕하세요';
    const password = 'secret123';
    const encrypted = await encrypt(text, password);
    const decrypted = await decrypt(encrypted, password);
    expect(decrypted).toBe(text);
  });

  it('잘못된 비밀번호 → null', async () => {
    const encrypted = await encrypt('data', 'right-password');
    const decrypted = await decrypt(encrypted, 'wrong-password');
    expect(decrypted).toBeNull();
  });

  it('payload 구조 (v1, salt/iv/ct base64)', async () => {
    const encrypted = await encrypt('x', 'pw');
    expect(encrypted.v).toBe(1);
    expect(typeof encrypted.salt).toBe('string');
    expect(typeof encrypted.iv).toBe('string');
    expect(typeof encrypted.ct).toBe('string');
    expect(encrypted.salt.length).toBeGreaterThan(0);
    expect(encrypted.iv.length).toBeGreaterThan(0);
  });

  it('같은 평문/비밀번호도 매번 다른 ciphertext (random salt/iv)', async () => {
    const a = await encrypt('same', 'pw');
    const b = await encrypt('same', 'pw');
    expect(a.ct).not.toBe(b.ct);
  });
}, { timeout: 30000 });

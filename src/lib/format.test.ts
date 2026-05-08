import { describe, it, expect } from 'vitest';
import { formatManwon, formatSigned, formatRatio } from './format';

describe('formatManwon', () => {
  it('천 단위 콤마', () => {
    expect(formatManwon(40558)).toBe('40,558');
    expect(formatManwon(0)).toBe('0');
    expect(formatManwon(999)).toBe('999');
    expect(formatManwon(1000)).toBe('1,000');
  });
});

describe('formatSigned', () => {
  it('양수는 +, 음수는 -', () => {
    expect(formatSigned(8410)).toBe('+8,410');
    expect(formatSigned(-1234)).toBe('-1,234');
    expect(formatSigned(0)).toBe('+0');
  });
});

describe('formatRatio', () => {
  it('합 100으로 정규화', () => {
    expect(formatRatio(24, 76)).toBe('24:76');
    expect(formatRatio(8841, 27970)).toBe('24:76');
  });

  it('합이 0이면 0:0', () => {
    expect(formatRatio(0, 0)).toBe('0:0');
  });
});

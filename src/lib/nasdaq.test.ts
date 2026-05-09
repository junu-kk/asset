import { describe, it, expect } from 'vitest';
import { computeNasdaq } from './nasdaq';

describe('computeNasdaq', () => {
  it('공제 미체크: 보유 - 수익×0.22', () => {
    expect(computeNasdaq({ 보유: 10000, 수익: 1000, 공제: false })).toBe(9780);
  });

  it('공제 체크: 보유 - 수익×0.22 + 55', () => {
    expect(computeNasdaq({ 보유: 10000, 수익: 1000, 공제: true })).toBe(9835);
  });

  it('수익 0 → 보유 그대로 (공제 미체크)', () => {
    expect(computeNasdaq({ 보유: 10000, 수익: 0, 공제: false })).toBe(10000);
  });

  it('수익 0 → 보유 + 55 (공제 체크)', () => {
    expect(computeNasdaq({ 보유: 10000, 수익: 0, 공제: true })).toBe(10055);
  });

  it('소수점은 반올림', () => {
    expect(computeNasdaq({ 보유: 10000, 수익: 301, 공제: false })).toBe(9934);
  });
});

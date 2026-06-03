import { describe, it, expect } from 'vitest';
import { computeNasdaq } from './nasdaq';

describe('computeNasdaq', () => {
  it('실현수익 0 → 세금 없음, 보유 그대로', () => {
    expect(computeNasdaq({ 보유: 10000, 실현수익: 0 })).toBe(10000);
  });

  it('실현수익 250 이하 → 전액 비과세, 보유 그대로', () => {
    expect(computeNasdaq({ 보유: 10000, 실현수익: 250 })).toBe(10000);
  });

  it('실현수익 250 초과 → 초과분만 22% 과세', () => {
    // (1000 - 250) × 0.22 = 165
    expect(computeNasdaq({ 보유: 10000, 실현수익: 1000 })).toBe(9835);
  });

  it('미실현 수익은 차감하지 않는다 (시가평가)', () => {
    // 보유에 큰 평가이익이 있어도 실현 전이면 세금 0
    expect(computeNasdaq({ 보유: 50000, 실현수익: 0 })).toBe(50000);
  });

  it('소수점은 반올림', () => {
    // (551 - 250) × 0.22 = 66.22 → round(9933.78)
    expect(computeNasdaq({ 보유: 10000, 실현수익: 551 })).toBe(9934);
  });
});

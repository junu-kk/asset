import { describe, it, expect } from 'vitest';
import { parseMonths } from './schema';

describe('parseMonths', () => {
  it('유효한 데이터를 파싱한다', () => {
    const raw = [
      {
        month: '2025-01',
        income: [{ name: '월급', amount: 604 }],
        expense: [{ name: '소비', amount: 122 }],
        assets: {
          cash: [{ name: '현금', amount: 2698 }],
          investment: [{ name: '나스닥', amount: 20601 }],
        },
        notes: '메모',
      },
    ];
    const result = parseMonths(raw);
    expect(result).toHaveLength(1);
    expect(result[0].month).toBe('2025-01');
  });

  it('month 형식이 틀리면 throw', () => {
    const raw = [
      {
        month: '25-01',
        income: [],
        expense: [],
        assets: { cash: [], investment: [] },
        notes: '',
      },
    ];
    expect(() => parseMonths(raw)).toThrow();
  });

  it('amount가 숫자가 아니면 throw', () => {
    const raw = [
      {
        month: '2025-01',
        income: [{ name: '월급', amount: '600' }],
        expense: [],
        assets: { cash: [], investment: [] },
        notes: '',
      },
    ];
    expect(() => parseMonths(raw)).toThrow();
  });

  it('정렬: 월 오름차순으로 반환', () => {
    const raw = [
      { month: '2025-03', income: [], expense: [], assets: { cash: [], investment: [] }, notes: '' },
      { month: '2025-01', income: [], expense: [], assets: { cash: [], investment: [] }, notes: '' },
      { month: '2025-02', income: [], expense: [], assets: { cash: [], investment: [] }, notes: '' },
    ];
    const result = parseMonths(raw);
    expect(result.map((r) => r.month)).toEqual(['2025-01', '2025-02', '2025-03']);
  });
});

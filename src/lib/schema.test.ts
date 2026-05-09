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

describe('parseMonths _meta 호환', () => {
  const base = {
    month: '2026-01',
    income: [],
    expense: [],
    assets: { cash: [], investment: [] },
    notes: '',
  };

  it('_meta 없는 기존 데이터도 통과', () => {
    const parsed = parseMonths([base]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]._meta).toBeUndefined();
  });

  it('_meta.나스닥 필드 보존', () => {
    const raw = [{
      ...base,
      assets: { cash: [], investment: [{ name: '나스닥', amount: 9835 }] },
      _meta: { 나스닥: { 보유: 10000, 수익: 1000, 공제: true } },
    }];
    const parsed = parseMonths(raw);
    expect(parsed[0]._meta?.나스닥).toEqual({ 보유: 10000, 수익: 1000, 공제: true });
  });

  it('잘못된 _meta는 거부', () => {
    const raw = [{ ...base, _meta: { 나스닥: { 보유: 'not number', 수익: 1000, 공제: true } } }];
    expect(() => parseMonths(raw)).toThrow();
  });
});

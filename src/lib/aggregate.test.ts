import { describe, it, expect } from 'vitest';
import {
  sumItems,
  monthSummary,
  buildSeries,
  monthOverMonth,
  ytdNet,
} from './aggregate';
import type { MonthRecord } from '../types';

const m = (
  month: string,
  cash: number[],
  inv: number[],
  income: number[] = [],
  expense: number[] = [],
): MonthRecord => ({
  month,
  income: income.map((amount, i) => ({ name: `i${i}`, amount })),
  expense: expense.map((amount, i) => ({ name: `e${i}`, amount })),
  assets: {
    cash: cash.map((amount, i) => ({ name: `c${i}`, amount })),
    investment: inv.map((amount, i) => ({ name: `v${i}`, amount })),
  },
  notes: '',
});

describe('sumItems', () => {
  it('금액 합', () => {
    expect(sumItems([{ name: 'a', amount: 10 }, { name: 'b', amount: 20 }])).toBe(30);
    expect(sumItems([])).toBe(0);
  });
});

describe('monthSummary', () => {
  it('현금/투자/총합 + 수입/지출 합', () => {
    const r = m('2025-04', [3330, 2103, 4318], [26795, 1797, 1978, 161, 76], [476, 30], [124, 5]);
    const s = monthSummary(r);
    expect(s.cashTotal).toBe(9751);
    expect(s.investmentTotal).toBe(30807);
    expect(s.assetTotal).toBe(40558);
    expect(s.incomeTotal).toBe(506);
    expect(s.expenseTotal).toBe(129);
  });
});

describe('buildSeries', () => {
  it('월별 시계열', () => {
    const records = [
      m('2025-01', [100], [200], [10], [5]),
      m('2025-02', [150], [250], [20], [8]),
    ];
    const series = buildSeries(records);
    expect(series).toEqual([
      { month: '2025-01', cash: 100, investment: 200, total: 300, income: 10, expense: 5 },
      { month: '2025-02', cash: 150, investment: 250, total: 400, income: 20, expense: 8 },
    ]);
  });
});

describe('monthOverMonth', () => {
  it('마지막 두 달의 총 자산 차이', () => {
    const records = [
      m('2025-01', [100], [200]),
      m('2025-02', [150], [250]),
    ];
    expect(monthOverMonth(records)).toBe(100);
  });

  it('1개월이면 null', () => {
    expect(monthOverMonth([m('2025-01', [100], [200])])).toBeNull();
  });

  it('빈 배열이면 null', () => {
    expect(monthOverMonth([])).toBeNull();
  });
});

describe('ytdNet', () => {
  it('가장 최근 월의 연도와 같은 해의 수입-지출 누계', () => {
    const records = [
      m('2024-12', [0], [0], [100], [50]),
      m('2025-01', [0], [0], [200], [100]),
      m('2025-02', [0], [0], [300], [50]),
    ];
    expect(ytdNet(records)).toBe(200 - 100 + 300 - 50);
  });

  it('빈 배열이면 0', () => {
    expect(ytdNet([])).toBe(0);
  });
});

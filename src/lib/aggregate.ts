import type { MonthRecord, AssetItem, FlowItem } from '../types';

export function sumItems(items: (AssetItem | FlowItem)[]): number {
  return items.reduce((acc, x) => acc + x.amount, 0);
}

export type MonthSummary = {
  month: string;
  cashTotal: number;
  investmentTotal: number;
  assetTotal: number;
  incomeTotal: number;
  expenseTotal: number;
};

export function monthSummary(record: MonthRecord): MonthSummary {
  const cashTotal = sumItems(record.assets.cash);
  const investmentTotal = sumItems(record.assets.investment);
  return {
    month: record.month,
    cashTotal,
    investmentTotal,
    assetTotal: cashTotal + investmentTotal,
    incomeTotal: sumItems(record.income),
    expenseTotal: sumItems(record.expense),
  };
}

export type SeriesPoint = {
  month: string;
  cash: number;
  investment: number;
  total: number;
  income: number;
  expense: number;
};

export function buildSeries(records: MonthRecord[]): SeriesPoint[] {
  return records.map((r) => {
    const s = monthSummary(r);
    return {
      month: s.month,
      cash: s.cashTotal,
      investment: s.investmentTotal,
      total: s.assetTotal,
      income: s.incomeTotal,
      expense: s.expenseTotal,
    };
  });
}

export function monthOverMonth(records: MonthRecord[]): number | null {
  if (records.length < 2) return null;
  const last = monthSummary(records[records.length - 1]);
  const prev = monthSummary(records[records.length - 2]);
  return last.assetTotal - prev.assetTotal;
}

export function ytdNet(records: MonthRecord[]): number {
  if (records.length === 0) return 0;
  const lastYear = records[records.length - 1].month.slice(0, 4);
  return records
    .filter((r) => r.month.startsWith(lastYear))
    .reduce((acc, r) => {
      const s = monthSummary(r);
      return acc + s.incomeTotal - s.expenseTotal;
    }, 0);
}

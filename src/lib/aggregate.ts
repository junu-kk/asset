import type { MonthRecord, AssetItem, FlowItem } from '../types';

export function sumItems(items: (AssetItem | FlowItem)[]): number {
  return items.reduce((acc, x) => acc + x.amount, 0);
}

// 달러로 표시되는 자산 (환율 변동에 노출된 항목)
export const USD_ASSET_NAMES = ['달러', '나스닥', '채권'];

// 2025-03까지 '증권'은 나스닥 계좌였다
const LEGACY_USD_NAME = '증권';
const LEGACY_USD_UNTIL = '2025-03';

export function isUsdAsset(name: string, month: string): boolean {
  if (USD_ASSET_NAMES.includes(name)) return true;
  return name === LEGACY_USD_NAME && month <= LEGACY_USD_UNTIL;
}

export function allAssets(record: MonthRecord): AssetItem[] {
  return [...record.assets.cash, ...record.assets.investment];
}

export type MonthSummary = {
  month: string;
  cashTotal: number;
  investmentTotal: number;
  assetTotal: number;
  krwTotal: number;
  usdTotal: number;
  incomeTotal: number;
  expenseTotal: number;
};

export function monthSummary(record: MonthRecord): MonthSummary {
  const cashTotal = sumItems(record.assets.cash);
  const investmentTotal = sumItems(record.assets.investment);
  const items = allAssets(record);
  const usdTotal = sumItems(items.filter((it) => isUsdAsset(it.name, record.month)));
  const krwTotal = sumItems(items.filter((it) => !isUsdAsset(it.name, record.month)));
  return {
    month: record.month,
    cashTotal,
    investmentTotal,
    assetTotal: cashTotal + investmentTotal,
    krwTotal,
    usdTotal,
    incomeTotal: sumItems(record.income),
    expenseTotal: sumItems(record.expense),
  };
}

export type SeriesPoint = {
  month: string;
  cash: number;
  investment: number;
  krw: number;
  usd: number;
  total: number;
  income: number;
  expense: number;
  savings: number;
};

export function buildSeries(records: MonthRecord[]): SeriesPoint[] {
  return records.map((r) => {
    const s = monthSummary(r);
    return {
      month: s.month,
      cash: s.cashTotal,
      investment: s.investmentTotal,
      krw: s.krwTotal,
      usd: s.usdTotal,
      total: s.assetTotal,
      income: s.incomeTotal,
      expense: s.expenseTotal,
      savings: s.incomeTotal - s.expenseTotal,
    };
  });
}

export function calcCap(values: number[], multiplier = 2): number | null {
  if (values.length === 0) return null;
  const abs = values.map((v) => Math.abs(v)).sort((a, b) => a - b);
  const mid = Math.floor(abs.length / 2);
  const median = abs.length % 2 === 0 ? (abs[mid - 1] + abs[mid]) / 2 : abs[mid];
  if (median === 0) return null;
  return Math.ceil((median * multiplier) / 100) * 100;
}

export function totalSavings(records: MonthRecord[]): number {
  return records.reduce((acc, r) => {
    const s = monthSummary(r);
    return acc + s.incomeTotal - s.expenseTotal;
  }, 0);
}

export function assetGrowth(records: MonthRecord[]): number {
  if (records.length < 2) return 0;
  const first = monthSummary(records[0]);
  const last = monthSummary(records[records.length - 1]);
  return last.assetTotal - first.assetTotal;
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

export type Period = 'all' | 'thisYear' | 'last12';

export function filterByPeriod(records: MonthRecord[], period: Period): MonthRecord[] {
  if (period === 'all' || records.length === 0) return records;
  if (period === 'last12') return records.slice(-12);
  const lastYear = records[records.length - 1].month.slice(0, 4);
  return records.filter((r) => r.month.startsWith(lastYear));
}

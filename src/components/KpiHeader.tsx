import type { MonthRecord } from '../types';
import {
  monthSummary,
  monthOverMonth,
  totalSavings,
  filterByPeriod,
  type Period,
} from '../lib/aggregate';
import { formatManwon, formatSigned, formatRatio } from '../lib/format';
import styles from './KpiHeader.module.css';

type Props = { records: MonthRecord[]; period: Period };

const SAVINGS_LABEL: Record<Period, string> = {
  all: '총 저축액',
  thisYear: '올해 저축액',
  last12: '최근 12개월 저축액',
};

export default function KpiHeader({ records, period }: Props) {
  if (records.length === 0) {
    return <p className={styles.empty}>아직 기록이 없습니다.</p>;
  }
  const last = monthSummary(records[records.length - 1]);
  const mom = monthOverMonth(records);
  const savings = totalSavings(filterByPeriod(records, period));

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.label}>총 자산 ({last.month})</div>
        <div className={styles.value}>{formatManwon(last.assetTotal)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>전월 대비</div>
        <div
          className={`${styles.value} ${
            mom === null ? '' : mom >= 0 ? styles.positive : styles.negative
          }`}
        >
          {mom === null ? '—' : formatSigned(mom)}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>현금 : 투자</div>
        <div className={styles.value}>{formatRatio(last.cashTotal, last.investmentTotal)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>{SAVINGS_LABEL[period]}</div>
        <div
          className={`${styles.value} ${savings >= 0 ? styles.positive : styles.negative}`}
        >
          {formatSigned(savings)}
        </div>
      </div>
    </div>
  );
}

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { MonthRecord } from '../types';
import { buildSeries, allAssets, isUsdAsset } from '../lib/aggregate';
import { formatManwon } from '../lib/format';
import styles from './CurrencyTimelineChart.module.css';

type Props = { records: MonthRecord[] };

function makeTooltip(records: MonthRecord[]) {
  const map = new Map(records.map((r) => [r.month, r]));
  return function CustomTooltip({ active, label }: { active?: boolean; label?: string }) {
    if (!active || !label) return null;
    const r = map.get(label);
    if (!r) return null;
    const items = allAssets(r);
    const krw = items.filter((it) => !isUsdAsset(it.name, r.month));
    const usd = items.filter((it) => isUsdAsset(it.name, r.month));
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipMonth}>{label}</div>
        <div className={styles.tooltipGroup}>
          <div className={styles.tooltipGroupTitle}>원화</div>
          {krw.map((it, i) => (
            <div key={`k${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
        <div className={styles.tooltipGroup}>
          <div className={styles.tooltipGroupTitle}>달러성</div>
          {usd.map((it, i) => (
            <div key={`u${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
      </div>
    );
  };
}

function collectNames(records: MonthRecord[]) {
  const krw = new Set<string>();
  const usd = new Set<string>();
  for (const r of records) {
    for (const it of allAssets(r)) {
      (isUsdAsset(it.name, r.month) ? usd : krw).add(it.name);
    }
  }
  return { krw: [...krw], usd: [...usd] };
}

export default function CurrencyTimelineChart({ records }: Props) {
  const data = buildSeries(records);
  const names = collectNames(records);
  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>통화 추이 (원화 : 달러성)</h2>
      <div className={styles.caption}>
        <span className={styles.captionItem}>
          <i className={styles.swatch} style={{ background: '#3b82f6' }} />
          원화
          <span className={styles.captionNames}>{names.krw.join(' · ')}</span>
        </span>
        <span className={styles.captionItem}>
          <i className={styles.swatch} style={{ background: '#10b981' }} />
          달러성
          <span className={styles.captionNames}>{names.usd.join(' · ')}</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => formatManwon(Number(v))} />
          <Tooltip content={<TooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="total" name="총 자산" stroke="#9ca3af" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="krw" name="원화" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="usd" name="달러성" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

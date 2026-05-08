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
import { buildSeries } from '../lib/aggregate';
import { formatManwon } from '../lib/format';
import styles from './AssetTimelineChart.module.css';

type Props = { records: MonthRecord[] };

function makeTooltip(records: MonthRecord[]) {
  const map = new Map(records.map((r) => [r.month, r]));
  return function CustomTooltip({ active, label }: { active?: boolean; label?: string }) {
    if (!active || !label) return null;
    const r = map.get(label);
    if (!r) return null;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipMonth}>{label}</div>
        <div className={styles.tooltipGroup}>
          <div className={styles.tooltipGroupTitle}>현금성</div>
          {r.assets.cash.map((it, i) => (
            <div key={`c${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
        <div className={styles.tooltipGroup}>
          <div className={styles.tooltipGroupTitle}>투자성</div>
          {r.assets.investment.map((it, i) => (
            <div key={`v${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
      </div>
    );
  };
}

export default function AssetTimelineChart({ records }: Props) {
  const data = buildSeries(records);
  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>자산 추이</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => formatManwon(Number(v))} />
          <Tooltip content={<TooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="total" name="총 자산" stroke="#9ca3af" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="cash" name="현금성" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="investment" name="투자성" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

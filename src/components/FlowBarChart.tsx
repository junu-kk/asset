import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { MonthRecord } from '../types';
import { buildSeries } from '../lib/aggregate';
import { formatManwon } from '../lib/format';
import styles from './FlowBarChart.module.css';

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
          <div className={styles.tooltipGroupTitle}>수입</div>
          {r.income.map((it, i) => (
            <div key={`i${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
        <div className={styles.tooltipGroup}>
          <div className={styles.tooltipGroupTitle}>지출</div>
          {r.expense.map((it, i) => (
            <div key={`e${i}`}>{it.name} {formatManwon(it.amount)}</div>
          ))}
        </div>
      </div>
    );
  };
}

export default function FlowBarChart({ records }: Props) {
  const data = buildSeries(records);
  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>월별 수입 / 지출</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => formatManwon(Number(v))} />
          <Tooltip content={<TooltipContent />} />
          <Legend />
          <Bar dataKey="income" name="수입" fill="#3b82f6" />
          <Bar dataKey="expense" name="지출" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

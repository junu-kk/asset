import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { MonthRecord } from '../types';
import { buildSeries } from '../lib/aggregate';
import { formatManwon, formatSigned } from '../lib/format';
import styles from './SavingsChart.module.css';

type Props = { records: MonthRecord[] };

const POSITIVE = '#16a34a';
const NEGATIVE = '#dc2626';

function makeTooltip(records: MonthRecord[]) {
  const map = new Map(records.map((r) => [r.month, r]));
  return function CustomTooltip({ active, label }: { active?: boolean; label?: string }) {
    if (!active || !label) return null;
    const r = map.get(label);
    if (!r) return null;
    const incomeTotal = r.income.reduce((a, b) => a + b.amount, 0);
    const expenseTotal = r.expense.reduce((a, b) => a + b.amount, 0);
    const net = incomeTotal - expenseTotal;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipMonth}>{label}</div>
        <div className={styles.row}>
          <span>수입</span>
          <span>{formatManwon(incomeTotal)}</span>
        </div>
        <div className={styles.row}>
          <span>지출</span>
          <span>{formatManwon(expenseTotal)}</span>
        </div>
        <div className={`${styles.row} ${styles.netRow}`}>
          <span>저축</span>
          <span style={{ color: net >= 0 ? POSITIVE : NEGATIVE }}>{formatSigned(net)}</span>
        </div>
      </div>
    );
  };
}

export default function SavingsChart({ records }: Props) {
  const data = buildSeries(records);
  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>월별 저축 (수입 − 지출)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => formatManwon(Number(v))} />
          <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(127,127,127,0.08)' }} />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Bar dataKey="savings" name="저축">
            {data.map((d, i) => (
              <Cell key={i} fill={d.savings >= 0 ? POSITIVE : NEGATIVE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

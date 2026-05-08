import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { useState } from 'react';
import type { MonthRecord } from '../types';
import { buildSeries, calcCap } from '../lib/aggregate';
import { formatManwon } from '../lib/format';
import styles from './SavingsChart.module.css';

type Props = { records: MonthRecord[] };

const SAVINGS_COLOR = '#16a34a';

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
          <span style={{ color: SAVINGS_COLOR }}>{formatManwon(net)}</span>
        </div>
      </div>
    );
  };
}

const overFormatter = (v: number | string | undefined | null) =>
  typeof v === 'number' ? `↑ ${formatManwon(v)}` : '';

export default function SavingsChart({ records }: Props) {
  const [capOutliers, setCapOutliers] = useState(true);
  const series = buildSeries(records);
  const cap = capOutliers ? calcCap(series.map((d) => d.savings)) : null;

  const data = series.map((d) => ({
    ...d,
    cappedSavings: cap !== null && d.savings > cap ? cap : d.savings,
    overValue: cap !== null && d.savings > cap ? d.savings : null,
  }));

  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>월별 저축 (수입 − 지출)</h2>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={capOutliers}
            onChange={(e) => setCapOutliers(e.target.checked)}
          />
          이상치 가리기
        </label>
      </header>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(v) => formatManwon(Number(v))}
            domain={cap !== null ? [0, cap] : [0, 'auto']}
            allowDataOverflow={cap !== null}
          />
          <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(127,127,127,0.08)' }} />
          <Bar dataKey="cappedSavings" name="저축" fill={SAVINGS_COLOR}>
            <LabelList
              dataKey="overValue"
              position="top"
              formatter={overFormatter}
              className={styles.overLabel}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from 'recharts';
import { useState } from 'react';
import type { MonthRecord } from '../types';
import { buildSeries, calcCap } from '../lib/aggregate';
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

const overFormatter = (v: number | string | undefined | null) =>
  typeof v === 'number' ? `↑ ${formatManwon(v)}` : '';

export default function FlowBarChart({ records }: Props) {
  const [capOutliers, setCapOutliers] = useState(true);
  const series = buildSeries(records);
  const cap = capOutliers
    ? calcCap(series.flatMap((d) => [d.income, d.expense]))
    : null;

  const data = series.map((d) => ({
    ...d,
    incomeCapped: cap !== null && d.income > cap ? cap : d.income,
    expenseCapped: cap !== null && d.expense > cap ? cap : d.expense,
    incomeOver: cap !== null && d.income > cap ? d.income : null,
    expenseOver: cap !== null && d.expense > cap ? d.expense : null,
  }));

  const TooltipContent = makeTooltip(records);
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>월별 수입 / 지출</h2>
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
            domain={cap !== null ? [0, cap] : undefined}
            allowDataOverflow={cap !== null}
          />
          <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(127,127,127,0.08)' }} />
          <Legend />
          <Bar dataKey="incomeCapped" name="수입" fill="#3b82f6">
            <LabelList
              dataKey="incomeOver"
              position="top"
              formatter={overFormatter}
              className={styles.overLabel}
            />
          </Bar>
          <Bar dataKey="expenseCapped" name="지출" fill="#f97316">
            <LabelList
              dataKey="expenseOver"
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

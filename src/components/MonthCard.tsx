import ReactMarkdown from 'react-markdown';
import type { MonthRecord } from '../types';
import { monthSummary } from '../lib/aggregate';
import { formatManwon, formatRatio } from '../lib/format';
import FlowTable from './FlowTable';
import styles from './MonthCard.module.css';

type Props = { record: MonthRecord };

export default function MonthCard({ record }: Props) {
  const s = monthSummary(record);
  const ratio = formatRatio(s.cashTotal, s.investmentTotal);
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <strong>{record.month}</strong>
        <span> · 수입 {formatManwon(s.incomeTotal)}</span>
        <span> · 지출 {formatManwon(s.expenseTotal)}</span>
        <span> · 누적 {formatManwon(s.assetTotal)} ({ratio})</span>
        {record.reportedAt && <span className={styles.reportedAt}>({record.reportedAt})</span>}
      </header>
      <FlowTable
        income={record.income}
        expense={record.expense}
        cash={record.assets.cash}
        investment={record.assets.investment}
        incomeTotal={s.incomeTotal}
        expenseTotal={s.expenseTotal}
        cashTotal={s.cashTotal}
        investmentTotal={s.investmentTotal}
        ratio={ratio}
      />
      {record.notes && (
        <div className={styles.notes}>
          <ReactMarkdown>{record.notes}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}

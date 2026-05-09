import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { MonthRecord } from '../types';
import { monthSummary } from '../lib/aggregate';
import { formatManwon, formatRatio, formatSigned } from '../lib/format';
import FlowTable from './FlowTable';
import styles from './MonthCard.module.css';

type Props = { record: MonthRecord };

export default function MonthCard({ record }: Props) {
  const s = monthSummary(record);
  const ratio = formatRatio(s.cashTotal, s.investmentTotal);
  const savings = s.incomeTotal - s.expenseTotal;
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.headLeft}>
          <h2 className={styles.month}>{record.month}</h2>
          {record.reportedAt && <span className={styles.reportedAt}>{record.reportedAt} 작성</span>}
          <Link to={`/edit/${record.month}`} className={styles.editBtn}>수정</Link>
        </div>
        <div className={styles.headRight}>
          <div className={styles.metric}>
            <span className={`${styles.metricLabel} ${styles.income}`}>수입</span>
            <span className={styles.metricValue}>{formatManwon(s.incomeTotal)}</span>
          </div>
          <div className={styles.metric}>
            <span className={`${styles.metricLabel} ${styles.expense}`}>지출</span>
            <span className={styles.metricValue}>{formatManwon(s.expenseTotal)}</span>
          </div>
          <div className={styles.metric}>
            <span className={`${styles.metricLabel} ${styles.savings}`}>저축</span>
            <span
              className={`${styles.metricValue} ${
                savings >= 0 ? styles.savingsPositive : styles.savingsNegative
              }`}
            >
              {formatSigned(savings)}
            </span>
          </div>
          <div className={styles.metric}>
            <span className={`${styles.metricLabel} ${styles.asset}`}>누적</span>
            <span className={`${styles.metricValue} ${styles.assetValue}`}>
              {formatManwon(s.assetTotal)}
            </span>
            <span className={styles.ratio}>{ratio}</span>
          </div>
        </div>
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

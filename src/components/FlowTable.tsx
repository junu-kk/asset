import type { MonthRecord } from '../types';
import { formatManwon } from '../lib/format';
import styles from './FlowTable.module.css';

type Props = {
  income: MonthRecord['income'];
  expense: MonthRecord['expense'];
  cash: MonthRecord['assets']['cash'];
  investment: MonthRecord['assets']['investment'];
  incomeTotal: number;
  expenseTotal: number;
  cashTotal: number;
  investmentTotal: number;
  ratio: string;
};

type ItemRowProps = { name: string; amount: number };
function ItemRow({ name, amount }: ItemRowProps) {
  return (
    <li className={styles.item}>
      <span className={styles.itemName}>{name}</span>
      <span className={styles.itemAmount}>{formatManwon(amount)}</span>
    </li>
  );
}

export default function FlowTable({
  income,
  expense,
  cash,
  investment,
  incomeTotal,
  expenseTotal,
  cashTotal,
  investmentTotal,
  ratio,
}: Props) {
  return (
    <div className={styles.grid}>
      <section className={`${styles.col} ${styles.colIncome}`}>
        <header className={styles.colHeader}>
          <span className={styles.colTitle}>수입</span>
          <span className={styles.colTotal}>{formatManwon(incomeTotal)}</span>
        </header>
        <ul className={styles.list}>
          {income.map((it, i) => (
            <ItemRow key={i} name={it.name} amount={it.amount} />
          ))}
        </ul>
      </section>

      <section className={`${styles.col} ${styles.colExpense}`}>
        <header className={styles.colHeader}>
          <span className={styles.colTitle}>지출</span>
          <span className={styles.colTotal}>{formatManwon(expenseTotal)}</span>
        </header>
        <ul className={styles.list}>
          {expense.map((it, i) => (
            <ItemRow key={i} name={it.name} amount={it.amount} />
          ))}
        </ul>
      </section>

      <section className={`${styles.col} ${styles.colAsset}`}>
        <header className={styles.colHeader}>
          <span className={styles.colTitle}>누적</span>
          <span className={styles.colTotal}>
            {formatManwon(cashTotal + investmentTotal)}
            <span className={styles.colRatio}>{ratio}</span>
          </span>
        </header>
        <div className={styles.subgroup}>
          <div className={styles.subgroupTitle}>
            현금성 <span className={styles.subgroupTotal}>{formatManwon(cashTotal)}</span>
          </div>
          <ul className={styles.list}>
            {cash.map((it, i) => (
              <ItemRow key={`c${i}`} name={it.name} amount={it.amount} />
            ))}
          </ul>
        </div>
        <div className={styles.subgroup}>
          <div className={styles.subgroupTitle}>
            투자성 <span className={styles.subgroupTotal}>{formatManwon(investmentTotal)}</span>
          </div>
          <ul className={styles.list}>
            {investment.map((it, i) => (
              <ItemRow key={`v${i}`} name={it.name} amount={it.amount} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

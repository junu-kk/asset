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
    <table className={styles.table}>
      <thead>
        <tr>
          <th>수입 {formatManwon(incomeTotal)}</th>
          <th>지출 {formatManwon(expenseTotal)}</th>
          <th>누적 {formatManwon(cashTotal + investmentTotal)} ({ratio})</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <ul>
              {income.map((it, i) => (
                <li key={i}>{it.name} {formatManwon(it.amount)}</li>
              ))}
            </ul>
          </td>
          <td>
            <ul>
              {expense.map((it, i) => (
                <li key={i}>{it.name} {formatManwon(it.amount)}</li>
              ))}
            </ul>
          </td>
          <td>
            <ul>
              {cash.map((it, i) => (
                <li key={`c${i}`}>{it.name} {formatManwon(it.amount)}</li>
              ))}
            </ul>
            <div className={styles.divider} />
            <ul>
              {investment.map((it, i) => (
                <li key={`v${i}`}>{it.name} {formatManwon(it.amount)}</li>
              ))}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

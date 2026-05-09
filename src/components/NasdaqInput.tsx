import { parseExpression } from '../lib/expression';
import { computeNasdaq } from '../lib/nasdaq';
import AmountInput from './AmountInput';
import styles from './NasdaqInput.module.css';

export type NasdaqState = {
  보유: string;
  수익: string;
  공제: boolean;
};

type Props = {
  value: NasdaqState;
  onChange: (value: NasdaqState) => void;
};

export function evalNasdaq(state: NasdaqState): { valid: boolean; amount: number } {
  const 보유 = parseExpression(state.보유);
  const 수익 = parseExpression(state.수익);
  if (!보유.valid || !수익.valid) return { valid: false, amount: 0 };
  return {
    valid: true,
    amount: computeNasdaq({ 보유: 보유.value, 수익: 수익.value, 공제: state.공제 }),
  };
}

export default function NasdaqInput({ value, onChange }: Props) {
  const result = evalNasdaq(value);
  return (
    <div className={styles.root}>
      <span className={styles.field}>
        <span className={styles.subLabel}>보유총액</span>
        <AmountInput value={value.보유} onChange={(v) => onChange({ ...value, 보유: v })} />
      </span>
      <span className={styles.field}>
        <span className={styles.subLabel}>수익</span>
        <AmountInput value={value.수익} onChange={(v) => onChange({ ...value, 수익: v })} />
      </span>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={value.공제}
          onChange={(e) => onChange({ ...value, 공제: e.target.checked })}
        />
        250만원 공제
      </label>
      <span className={styles.result}>
        결과: {result.valid ? result.amount.toLocaleString('en-US') : '-'}
      </span>
    </div>
  );
}

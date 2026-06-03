import { parseExpression } from '../lib/expression';
import { computeNasdaq } from '../lib/nasdaq';
import AmountInput from './AmountInput';
import styles from './NasdaqInput.module.css';

export type NasdaqState = {
  보유: string;
  실현수익: string;
};

type Props = {
  value: NasdaqState;
  onChange: (value: NasdaqState) => void;
};

// 실현수익은 비워두면 0(올해 매도 없음)으로 본다
function evalRealized(s: string): number | null {
  if (s.trim() === '') return 0;
  const r = parseExpression(s);
  return r.valid ? r.value : null;
}

export function evalNasdaq(state: NasdaqState): { valid: boolean; amount: number } {
  const 보유 = parseExpression(state.보유);
  const 실현수익 = evalRealized(state.실현수익);
  if (!보유.valid || 실현수익 === null) return { valid: false, amount: 0 };
  return {
    valid: true,
    amount: computeNasdaq({ 보유: 보유.value, 실현수익 }),
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
        <span className={styles.subLabel}>올해 실현수익</span>
        <AmountInput value={value.실현수익} onChange={(v) => onChange({ ...value, 실현수익: v })} />
      </span>
      <span className={styles.result}>
        결과: {result.valid ? result.amount.toLocaleString('en-US') : '-'}
      </span>
    </div>
  );
}

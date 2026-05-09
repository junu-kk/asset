import { parseExpression } from '../lib/expression';
import styles from './AmountInput.module.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AmountInput({ value, onChange, placeholder }: Props) {
  const result = parseExpression(value);
  const showPreview = value.trim().length > 0;
  return (
    <span className={styles.root}>
      <input
        type="text"
        className={`${styles.input} ${showPreview && !result.valid ? styles.invalid : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className={styles.preview}>
        {!showPreview ? '' : result.valid ? `= ${result.value.toLocaleString('en-US')}` : '잘못된 식'}
      </span>
    </span>
  );
}

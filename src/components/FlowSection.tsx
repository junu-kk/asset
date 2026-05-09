import AmountInput from './AmountInput';
import styles from './FlowSection.module.css';

export type FlowRow = {
  name: string;
  amount: string;
  fixed: boolean;
};

type Props = {
  title: string;
  rows: FlowRow[];
  onChange: (rows: FlowRow[]) => void;
};

export default function FlowSection({ title, rows, onChange }: Props) {
  const updateRow = (i: number, patch: Partial<FlowRow>) => {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const removeRow = (i: number) => {
    onChange(rows.filter((_, idx) => idx !== i));
  };
  const addRow = () => {
    onChange([...rows, { name: '', amount: '', fixed: false }]);
  };
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      {rows.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.fixed ? (
            <span className={styles.fixedLabel}>{row.name}</span>
          ) : (
            <input
              type="text"
              className={styles.nameInput}
              value={row.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
              placeholder="항목명"
            />
          )}
          <AmountInput
            value={row.amount}
            onChange={(v) => updateRow(i, { amount: v })}
          />
          {!row.fixed && (
            <button type="button" className={styles.remove} onClick={() => removeRow(i)}>
              ×
            </button>
          )}
        </div>
      ))}
      <button type="button" className={styles.add} onClick={addRow}>
        + 항목 추가
      </button>
    </section>
  );
}

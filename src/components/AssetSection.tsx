import AmountInput from './AmountInput';
import NasdaqInput, { type NasdaqState } from './NasdaqInput';
import styles from './AssetSection.module.css';

export type AssetBucket = 'cash' | 'investment';
export type AssetRow = {
  name: string;
  amount: string;
  fixed: boolean;
  bucket: AssetBucket;
};

type Props = {
  rows: AssetRow[];
  onChange: (rows: AssetRow[]) => void;
  나스닥: NasdaqState;
  onNasdaqChange: (state: NasdaqState) => void;
};

export default function AssetSection({ rows, onChange, 나스닥, onNasdaqChange }: Props) {
  const updateRow = (i: number, patch: Partial<AssetRow>) => {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const removeRow = (i: number) => {
    onChange(rows.filter((_, idx) => idx !== i));
  };
  const addRow = (bucket: AssetBucket) => {
    onChange([...rows, { name: '', amount: '', fixed: false, bucket }]);
  };

  const renderRow = (row: AssetRow, i: number) => {
    if (row.fixed && row.name === '나스닥') {
      return (
        <div className={styles.row} key={i}>
          <span className={styles.fixedLabel}>나스닥</span>
          <NasdaqInput value={나스닥} onChange={onNasdaqChange} />
        </div>
      );
    }
    return (
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
        <AmountInput value={row.amount} onChange={(v) => updateRow(i, { amount: v })} />
        {!row.fixed && (
          <button type="button" className={styles.remove} onClick={() => removeRow(i)}>
            ×
          </button>
        )}
      </div>
    );
  };

  const indexed = rows.map((r, i) => ({ row: r, i }));
  const cashRows = indexed.filter((x) => x.row.bucket === 'cash');
  const invRows = indexed.filter((x) => x.row.bucket === 'investment');

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>누적</h3>
      <div className={styles.bucket}>
        <h4 className={styles.bucketTitle}>cash</h4>
        {cashRows.map(({ row, i }) => renderRow(row, i))}
        <button type="button" className={styles.add} onClick={() => addRow('cash')}>
          + 항목 추가
        </button>
      </div>
      <div className={styles.bucket}>
        <h4 className={styles.bucketTitle}>investment</h4>
        {invRows.map(({ row, i }) => renderRow(row, i))}
        <button type="button" className={styles.add} onClick={() => addRow('investment')}>
          + 항목 추가
        </button>
      </div>
    </section>
  );
}

import { useState } from 'react';
import styles from './UnlockModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
};

export default function UnlockModal({ open, onClose, onSubmit }: Props) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const ok = await onSubmit(pw);
    if (ok) {
      setPw('');
      onClose();
    } else {
      setError('비밀번호가 틀립니다');
    }
    setBusy(false);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={styles.title}>잠금 해제</h3>
        <p className={styles.desc}>비밀번호를 입력하면 실제 자산 데이터를 표시합니다.</p>
        <input
          type="password"
          autoFocus
          className={styles.input}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          disabled={busy}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={busy}>
            취소
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={busy || pw.length === 0}>
            {busy ? '복호화 중…' : '해제'}
          </button>
        </div>
      </form>
    </div>
  );
}

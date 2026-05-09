import { useState } from 'react';
import { useData } from '../data/DataContext';
import UnlockModal from './UnlockModal';
import styles from './SampleBanner.module.css';

export default function SampleBanner() {
  const { locked, unlock } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  if (!locked) return null;
  return (
    <>
      <div className={styles.banner}>
        <span className={styles.icon}>🎭</span>
        <div className={styles.text}>
          <strong>샘플 데이터입니다.</strong> 실제 자산이 아닙니다. 본인이라면 잠금을 해제하세요.
        </div>
        <button type="button" className={styles.btn} onClick={() => setModalOpen(true)}>
          🔒 잠금 해제
        </button>
      </div>
      <UnlockModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={unlock} />
    </>
  );
}

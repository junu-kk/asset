import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../data/DataContext';
import UnlockModal from './UnlockModal';
import styles from './Sidebar.module.css';

const isDev = import.meta.env.DEV;

export default function Sidebar() {
  const { locked, unlock, lock } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>Asset</div>
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        대시보드
      </NavLink>
      <NavLink
        to="/monthly"
        className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
      >
        월별 기록
      </NavLink>
      {isDev && (
        <NavLink
          to="/edit"
          end
          className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
        >
          + 새 기록
        </NavLink>
      )}
      {!isDev && (
        <div className={styles.lockArea}>
          {locked ? (
            <>
              <div className={styles.lockBadge}>샘플 데이터</div>
              <button type="button" className={styles.lockBtn} onClick={() => setModalOpen(true)}>
                🔒 잠금 해제
              </button>
            </>
          ) : (
            <button type="button" className={styles.lockBtn} onClick={lock}>
              🔓 잠그기
            </button>
          )}
        </div>
      )}
      <UnlockModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={unlock} />
    </nav>
  );
}

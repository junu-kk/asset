import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar() {
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
    </nav>
  );
}

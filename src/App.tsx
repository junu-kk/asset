import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MonthlyPage from './pages/MonthlyPage';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
        </Routes>
      </main>
    </div>
  );
}

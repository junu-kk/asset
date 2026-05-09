import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SampleBanner from './components/SampleBanner';
import DashboardPage from './pages/DashboardPage';
import MonthlyPage from './pages/MonthlyPage';
import EditPage from './pages/EditPage';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <SampleBanner />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
          {import.meta.env.DEV && <Route path="/edit" element={<EditPage />} />}
          {import.meta.env.DEV && <Route path="/edit/:month" element={<EditPage />} />}
        </Routes>
      </main>
    </div>
  );
}

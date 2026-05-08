import { useEffect, useState } from 'react';
import { months } from '../data/loader';
import KpiHeader from '../components/KpiHeader';
import AssetTimelineChart from '../components/AssetTimelineChart';
import FlowBarChart from '../components/FlowBarChart';
import SavingsChart from '../components/SavingsChart';
import { filterByPeriod, type Period } from '../lib/aggregate';
import styles from './DashboardPage.module.css';

const STORAGE_KEY = 'dashboard.period';
const VALID_PERIODS: Period[] = ['all', 'thisYear', 'last12'];

function loadPeriod(): Period {
  const v = localStorage.getItem(STORAGE_KEY);
  return v !== null && (VALID_PERIODS as string[]).includes(v) ? (v as Period) : 'all';
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>(loadPeriod);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, period);
  }, [period]);

  const filtered = filterByPeriod(months, period);

  return (
    <>
      <div className={styles.header}>
        <h1>대시보드</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className={styles.periodSelect}
        >
          <option value="all">전체</option>
          <option value="thisYear">올해</option>
          <option value="last12">최근 12개월</option>
        </select>
      </div>
      <KpiHeader records={months} period={period} />
      <AssetTimelineChart records={filtered} />
      <FlowBarChart records={filtered} />
      <SavingsChart records={filtered} />
    </>
  );
}

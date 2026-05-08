import { months } from '../data/loader';
import KpiHeader from '../components/KpiHeader';

export default function DashboardPage() {
  return (
    <>
      <h1>대시보드</h1>
      <KpiHeader records={months} />
    </>
  );
}

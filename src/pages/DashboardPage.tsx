import { months } from '../data/loader';
import KpiHeader from '../components/KpiHeader';
import AssetTimelineChart from '../components/AssetTimelineChart';

export default function DashboardPage() {
  return (
    <>
      <h1>대시보드</h1>
      <KpiHeader records={months} />
      <AssetTimelineChart records={months} />
    </>
  );
}

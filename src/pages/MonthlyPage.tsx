import { months } from '../data/loader';
import MonthCard from '../components/MonthCard';

export default function MonthlyPage() {
  if (months.length === 0) {
    return (
      <>
        <h1>월별 기록</h1>
        <p>아직 기록이 없습니다.</p>
      </>
    );
  }
  const reversed = [...months].reverse();
  return (
    <>
      <h1>월별 기록</h1>
      {reversed.map((r) => (
        <MonthCard key={r.month} record={r} />
      ))}
    </>
  );
}

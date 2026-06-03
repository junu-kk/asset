export type NasdaqInput = {
  보유: number; // 보유총액 (시가, 만원)
  실현수익: number; // 올해 매도로 실현한 수익 (만원)
};

const ANNUAL_EXEMPTION = 250; // 연간 비과세 한도 (만원)
const TAX_RATE = 0.22;

// 시가평가 관점: 미실현분은 차감하지 않고, 올해 실현한 수익 중 250만원 초과분의 세금만 뺀다
export function computeNasdaq({ 보유, 실현수익 }: NasdaqInput): number {
  const 과세실현 = Math.max(0, 실현수익 - ANNUAL_EXEMPTION);
  const tax = 과세실현 * TAX_RATE;
  return Math.round(보유 - tax);
}

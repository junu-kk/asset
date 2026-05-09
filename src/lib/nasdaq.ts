export type NasdaqInput = {
  보유: number;
  수익: number;
  공제: boolean;
};

export function computeNasdaq({ 보유, 수익, 공제 }: NasdaqInput): number {
  const tax = 수익 * 0.22;
  const deduction = 공제 ? 55 : 0;
  return Math.round(보유 - tax + deduction);
}

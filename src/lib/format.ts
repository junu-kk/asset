export function formatManwon(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatSigned(value: number): string {
  const sign = value < 0 ? '-' : '+';
  return sign + Math.abs(value).toLocaleString('en-US');
}

export function formatRatio(a: number, b: number): string {
  const total = a + b;
  if (total === 0) return '0:0';
  const aPct = Math.round((a / total) * 100);
  return `${aPct}:${100 - aPct}`;
}

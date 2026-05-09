export type ExpressionResult = { valid: true; value: number } | { valid: false };

const EXPRESSION_PATTERN = /^\s*\d+(\.\d+)?(\s*\+\s*\d+(\.\d+)?)*\s*$/;

export function parseExpression(input: string): ExpressionResult {
  const trimmed = input.trim();
  if (trimmed === '') return { valid: false };
  if (!EXPRESSION_PATTERN.test(trimmed)) return { valid: false };
  const value = trimmed
    .split('+')
    .map((s) => Number(s.trim()))
    .reduce((a, b) => a + b, 0);
  return { valid: true, value };
}

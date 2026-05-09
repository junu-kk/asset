import { describe, it, expect } from 'vitest';
import { parseExpression } from './expression';

describe('parseExpression', () => {
  it('단일 숫자', () => {
    expect(parseExpression('100')).toEqual({ valid: true, value: 100 });
  });

  it('덧셈식', () => {
    expect(parseExpression('100+200+300')).toEqual({ valid: true, value: 600 });
  });

  it('공백 허용', () => {
    expect(parseExpression('  100 + 200  ')).toEqual({ valid: true, value: 300 });
  });

  it('소수점 허용', () => {
    expect(parseExpression('1.5+2.5')).toEqual({ valid: true, value: 4 });
  });

  it('빈 문자열 → invalid', () => {
    expect(parseExpression('')).toEqual({ valid: false });
    expect(parseExpression('   ')).toEqual({ valid: false });
  });

  it('음수 → invalid', () => {
    expect(parseExpression('-100')).toEqual({ valid: false });
    expect(parseExpression('100+-50')).toEqual({ valid: false });
  });

  it('빼기/곱하기 연산자 → invalid', () => {
    expect(parseExpression('100-50')).toEqual({ valid: false });
    expect(parseExpression('100*2')).toEqual({ valid: false });
  });

  it('잘못된 형식 → invalid', () => {
    expect(parseExpression('abc')).toEqual({ valid: false });
    expect(parseExpression('100++200')).toEqual({ valid: false });
    expect(parseExpression('100+')).toEqual({ valid: false });
    expect(parseExpression('+100')).toEqual({ valid: false });
  });
});

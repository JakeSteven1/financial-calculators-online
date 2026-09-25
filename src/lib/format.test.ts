import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber, formatPercent, parseNumber } from './format';

describe('parseNumber', () => {
  it('strips currency symbols, commas and percent signs', () => {
    expect(parseNumber('$1,250.50')).toBe(1250.5);
    expect(parseNumber('7%')).toBe(7);
    expect(parseNumber(' -3 ')).toBe(-3);
  });
  it('returns NaN for empty or invalid input', () => {
    expect(parseNumber('')).toBeNaN();
    expect(parseNumber('abc')).toBeNaN();
    expect(parseNumber('-')).toBeNaN();
  });
});

describe('formatters', () => {
  it('formats currency', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(1234.5, { whole: true })).toBe('$1,235');
    expect(formatCurrency(NaN)).toBe('—');
  });
  it('formats numbers and percents', () => {
    expect(formatNumber(1234.5678)).toBe('1,234.57');
    expect(formatPercent(7.5)).toBe('7.50%');
  });
});

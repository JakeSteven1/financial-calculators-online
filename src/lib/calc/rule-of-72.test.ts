import { describe, expect, it } from 'vitest';
import { exactRateToDouble, exactYearsToDouble, rateToDoubleRule72, yearsToDoubleRule72 } from './rule-of-72';

describe('rule of 72', () => {
  it('estimates doubling time and rate', () => {
    expect(yearsToDoubleRule72(8)).toBe(9);
    expect(rateToDoubleRule72(6)).toBe(12);
    expect(yearsToDoubleRule72(0)).toBeNaN();
  });
  it('compares with the exact values', () => {
    expect(exactYearsToDouble(8)).toBeCloseTo(9.0065, 4);
    expect(exactRateToDouble(6)).toBeCloseTo(12.2462, 4);
  });
});

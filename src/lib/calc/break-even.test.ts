import { describe, expect, it } from 'vitest';
import { breakEven } from './break-even';

describe('breakEven', () => {
  it('computes units and revenue', () => {
    const r = breakEven({ fixedCosts: 10000, pricePerUnit: 50, variableCostPerUnit: 30 })!;
    expect(r.units).toBe(500);
    expect(r.unitsWhole).toBe(500);
    expect(r.revenue).toBe(25000);
    expect(r.contributionMarginRatio).toBe(40);
  });
  it('includes a profit goal and rounds units up', () => {
    const r = breakEven({ fixedCosts: 10000, pricePerUnit: 50, variableCostPerUnit: 20, targetProfit: 5000 })!;
    expect(r.units).toBe(500);
    const odd = breakEven({ fixedCosts: 1000, pricePerUnit: 7, variableCostPerUnit: 4 })!;
    expect(odd.unitsWhole).toBe(334);
  });
  it('returns null when price does not exceed variable cost', () => {
    expect(breakEven({ fixedCosts: 100, pricePerUnit: 10, variableCostPerUnit: 10 })).toBeNull();
  });
});

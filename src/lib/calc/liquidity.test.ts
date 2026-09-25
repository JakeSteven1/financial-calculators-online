import { describe, expect, it } from 'vitest';
import { cashRatio, currentRatio, liquidityRatios, quickRatio, quickRatioFromComponents, rateRatio } from './liquidity';

describe('liquidity ratios', () => {
  it('current ratio', () => {
    expect(currentRatio(300000, 150000)).toBe(2);
    expect(currentRatio(1, 0)).toBeNaN();
  });
  it('quick ratio excludes inventory and prepaid expenses', () => {
    expect(quickRatio(300000, 100000, 150000)).toBeCloseTo(1.3333, 4);
    expect(quickRatio(300000, 100000, 150000, 20000)).toBeCloseTo(1.2, 10);
    expect(quickRatioFromComponents(50000, 25000, 75000, 100000)).toBe(1.5);
  });
  it('cash ratio', () => {
    expect(cashRatio(40000, 10000, 100000)).toBe(0.5);
  });
  it('bundles all ratios and working capital', () => {
    const r = liquidityRatios({ currentAssets: 300000, currentLiabilities: 150000, inventory: 100000, cash: 50000, marketableSecurities: 25000 });
    expect(r).toEqual({ current: 2, quick: 200000 / 150000, cash: 0.5, workingCapital: 150000 });
  });
  it('rates ratios against rules of thumb', () => {
    expect(rateRatio('current', 0.9)).toBe('weak');
    expect(rateRatio('current', 1.2)).toBe('adequate');
    expect(rateRatio('quick', 1.1)).toBe('strong');
    expect(rateRatio('cash', NaN)).toBeNull();
  });
});

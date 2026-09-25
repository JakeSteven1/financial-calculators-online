import { describe, expect, it } from 'vitest';
import { homeSellingPrice } from './home-sale';

describe('homeSellingPrice', () => {
  it('grosses up for commission', () => {
    const r = homeSellingPrice({ purchasePrice: 300000, improvements: 20000, desiredProfit: 50000, closingCosts: 6000, commissionPct: 6, mortgagePayoff: 200000 })!;
    expect(r.sellingPrice).toBeCloseTo(376000 / 0.94, 6);
    expect(r.commission).toBeCloseTo(r.sellingPrice * 0.06, 6);
    // Net after all costs equals invested + profit
    expect(r.sellingPrice - r.commission - 6000).toBeCloseTo(370000, 6);
    expect(r.cashAtClosing).toBeCloseTo(170000, 6);
  });
  it('rejects 100% commission', () => {
    expect(homeSellingPrice({ purchasePrice: 1, improvements: 0, desiredProfit: 0, closingCosts: 0, commissionPct: 100, mortgagePayoff: 0 })).toBeNull();
  });
});

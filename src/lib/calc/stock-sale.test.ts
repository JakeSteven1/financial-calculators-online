import { describe, expect, it } from 'vitest';
import { stockSale } from './stock-sale';

describe('stockSale', () => {
  it('computes proceeds, gain, and tax', () => {
    const r = stockSale({ shares: 100, buyPrice: 50, sellPrice: 75, fees: 10, taxRatePct: 15 });
    expect(r.proceeds).toBe(7500);
    expect(r.costBasis).toBe(5010);
    expect(r.gain).toBe(2490);
    expect(r.tax).toBeCloseTo(373.5, 10);
    expect(r.returnPct).toBeCloseTo(49.7006, 4);
  });
  it('does not tax a loss', () => {
    const r = stockSale({ shares: 10, buyPrice: 100, sellPrice: 80, fees: 0, taxRatePct: 15 });
    expect(r.gain).toBe(-200);
    expect(r.tax).toBe(0);
  });
});

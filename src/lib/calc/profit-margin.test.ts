import { describe, expect, it } from 'vitest';
import { profitMargin } from './profit-margin';

const base = { pricePerUnit: 100, materialCost: 30, laborCost: 15, overheadCost: 10, otherDirectCost: 5, units: 1000, operatingExpenses: 20000, taxRatePct: 25 };

describe('profitMargin', () => {
  it('computes gross, operating, and net margins', () => {
    const r = profitMargin(base);
    expect(r.costPerUnit).toBe(60);
    expect(r.grossMarginPct).toBe(40);
    expect(r.markupPct).toBeCloseTo(66.667, 3);
    expect(r.revenue).toBe(100000);
    expect(r.operatingProfit).toBe(20000);
    expect(r.operatingMarginPct).toBe(20);
    expect(r.netProfit).toBe(15000);
    expect(r.netMarginPct).toBe(15);
  });
  it('does not apply tax to a loss', () => {
    const r = profitMargin({ ...base, operatingExpenses: 50000 });
    expect(r.netProfit).toBe(-10000);
  });
  it('returns NaN margins for zero price or units', () => {
    expect(profitMargin({ ...base, pricePerUnit: 0 }).grossMarginPct).toBeNaN();
    expect(profitMargin({ ...base, units: 0 }).netMarginPct).toBeNaN();
  });
});

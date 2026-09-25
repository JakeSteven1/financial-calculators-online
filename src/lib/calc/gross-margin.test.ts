import { describe, expect, it } from 'vitest';
import { grossMargin, priceForMargin } from './gross-margin';

describe('grossMargin', () => {
  it('computes profit, margin, and markup', () => {
    const r = grossMargin(500000, 300000);
    expect(r.grossProfit).toBe(200000);
    expect(r.marginPct).toBe(40);
    expect(r.markupPct).toBeCloseTo(66.6667, 4);
  });
  it('handles zero revenue or cost', () => {
    expect(grossMargin(0, 10).marginPct).toBeNaN();
    expect(grossMargin(10, 0).markupPct).toBeNaN();
  });
});

describe('priceForMargin', () => {
  it('finds the price for a target margin', () => {
    expect(priceForMargin(60, 40)).toBeCloseTo(100, 10);
    expect(priceForMargin(60, 100)).toBeNaN();
  });
});

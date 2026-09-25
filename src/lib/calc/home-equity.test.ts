import { describe, expect, it } from 'vitest';
import { homeEquity } from './home-equity';

describe('homeEquity', () => {
  it('computes equity, LTV, and borrowing power', () => {
    expect(homeEquity(400000, 250000, 0, 85)).toEqual({ equity: 150000, equityPct: 37.5, ltv: 62.5, cltv: 62.5, borrowable: 90000 });
  });
  it('includes other liens and floors borrowable at zero', () => {
    const r = homeEquity(300000, 250000, 20000, 80)!;
    expect(r.cltv).toBe(90);
    expect(r.borrowable).toBe(0);
  });
  it('requires a home value', () => {
    expect(homeEquity(0, 0, 0, 80)).toBeNull();
  });
});

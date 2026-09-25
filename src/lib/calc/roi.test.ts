import { describe, expect, it } from 'vitest';
import { returnOnInvestment } from './roi';

describe('returnOnInvestment', () => {
  it('computes ROI and annualized ROI', () => {
    const r = returnOnInvestment(10000, 15000, 3)!;
    expect(r.gain).toBe(5000);
    expect(r.roiPct).toBe(50);
    expect(r.annualizedPct).toBeCloseTo(14.4714, 4);
  });
  it('handles losses and missing years', () => {
    const r = returnOnInvestment(1000, 800)!;
    expect(r.roiPct).toBe(-20);
    expect(r.annualizedPct).toBeNaN();
    expect(returnOnInvestment(0, 100)).toBeNull();
  });
});

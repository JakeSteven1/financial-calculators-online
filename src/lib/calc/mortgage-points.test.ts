import { describe, expect, it } from 'vitest';
import { mortgagePoints } from './mortgage-points';
import { monthlyPayment } from './loan';

describe('mortgagePoints', () => {
  it('computes cost, savings, and break-even', () => {
    const r = mortgagePoints({ loanAmount: 300000, baseRatePct: 7, points: 2, reducedRatePct: 6.5, years: 30, holdYears: 10 })!;
    expect(r.pointsCost).toBe(6000);
    const savings = monthlyPayment(300000, 7, 360) - monthlyPayment(300000, 6.5, 360);
    expect(r.monthlySavings).toBeCloseTo(savings, 10);
    expect(r.breakEvenMonths).toBeCloseTo(6000 / savings, 10);
    expect(r.netSavings).toBeCloseTo(savings * 120 - 6000, 8);
  });
  it('caps the holding period at the loan term', () => {
    const r = mortgagePoints({ loanAmount: 100000, baseRatePct: 7, points: 1, reducedRatePct: 6.75, years: 15, holdYears: 40 })!;
    expect(r.netSavings).toBeCloseTo(r.monthlySavings * 180 - 1000, 8);
  });
});

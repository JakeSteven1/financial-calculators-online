import { describe, expect, it } from 'vitest';
import { compareRefinance } from './refinance';
import { monthlyPayment } from './loan';

describe('compareRefinance', () => {
  const base = { balance: 250000, currentRatePct: 7.5, remainingYears: 25, newRatePct: 6, newYears: 25, closingCosts: 5000 };
  it('compares payments and break-even', () => {
    const r = compareRefinance(base)!;
    expect(r.currentPayment).toBeCloseTo(monthlyPayment(250000, 7.5, 300), 10);
    expect(r.newPayment).toBeCloseTo(monthlyPayment(250000, 6, 300), 10);
    expect(r.breakEvenMonths).toBeCloseTo(5000 / r.monthlySavings, 10);
    expect(r.lifetimeSavings).toBeCloseTo(r.monthlySavings * 300 - 5000, 6);
  });
  it('rolls closing costs into the loan', () => {
    const r = compareRefinance({ ...base, rollInCosts: true })!;
    expect(r.newLoanAmount).toBe(255000);
    expect(r.newTotalCost).toBeCloseTo(r.newPayment * 300, 6);
  });
  it('never breaks even when the payment rises', () => {
    expect(compareRefinance({ ...base, newRatePct: 8 })!.breakEvenMonths).toBe(Infinity);
  });
});

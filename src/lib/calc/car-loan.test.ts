import { describe, expect, it } from 'vitest';
import { carLoan } from './car-loan';
import { monthlyPayment } from './loan';

const base = { price: 35000, downPayment: 5000, tradeInValue: 8000, tradeInOwed: 0, salesTaxPct: 6, fees: 500, ratePct: 7, months: 60 };

describe('carLoan', () => {
  it('taxes price minus trade-in and finances the rest', () => {
    const r = carLoan(base)!;
    expect(r.salesTax).toBe(1620);
    expect(r.loanAmount).toBe(35000 + 1620 + 500 - 5000 - 8000);
    expect(r.monthlyPayment).toBeCloseTo(monthlyPayment(24120, 7, 60), 10);
  });
  it('rolls negative equity into the loan', () => {
    const r = carLoan({ ...base, tradeInValue: 8000, tradeInOwed: 10000 })!;
    expect(r.loanAmount).toBe(35000 + 1620 + 500 - 5000 + 2000);
  });
  it('handles a fully paid purchase', () => {
    const r = carLoan({ ...base, downPayment: 40000 })!;
    expect(r.loanAmount).toBe(0);
    expect(r.monthlyPayment).toBe(0);
  });
});

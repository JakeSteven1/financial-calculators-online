import { describe, expect, it } from 'vitest';
import { mortgagePayment } from './mortgage';

describe('mortgagePayment', () => {
  it('computes P&I and escrow items', () => {
    const r = mortgagePayment({ homePrice: 400000, downPayment: 80000, ratePct: 6.5, years: 30, propertyTaxYearly: 4800, insuranceYearly: 1800, hoaMonthly: 50 })!;
    expect(r.loanAmount).toBe(320000);
    expect(r.principalAndInterest).toBeCloseTo(2022.62, 2);
    expect(r.propertyTax).toBe(400);
    expect(r.insurance).toBe(150);
    expect(r.pmi).toBe(0);
    expect(r.totalMonthly).toBeCloseTo(2022.62 + 400 + 150 + 50, 2);
  });
  it('adds PMI below 20% down', () => {
    const r = mortgagePayment({ homePrice: 300000, downPayment: 30000, ratePct: 7, years: 30, pmiRatePct: 0.6 })!;
    expect(r.downPaymentPct).toBe(10);
    expect(r.pmi).toBeCloseTo((270000 * 0.006) / 12, 10);
  });
  it('rejects invalid input', () => {
    expect(mortgagePayment({ homePrice: 100, downPayment: 200, ratePct: 5, years: 30 })).toBeNull();
  });
});

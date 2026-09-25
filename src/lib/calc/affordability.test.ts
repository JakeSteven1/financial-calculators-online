import { describe, expect, it } from 'vitest';
import { homeAffordability } from './affordability';

const base = { annualIncome: 120000, monthlyDebts: 500, downPayment: 60000, ratePct: 6.5, years: 30, propertyTaxPct: 1.1, insuranceYearly: 1800, hoaMonthly: 0, frontEndPct: 28, backEndPct: 36 };

describe('homeAffordability', () => {
  it('spends exactly the housing budget', () => {
    const r = homeAffordability(base)!;
    // front: 2800, back: 3600 - 500 = 3100 -> front-end limits
    expect(r.limitedBy).toBe('front-end');
    expect(r.monthlyHousing).toBeCloseTo(2800, 6);
    expect(r.loanAmount).toBeCloseTo(r.maxHomePrice - 60000, 6);
  });
  it('uses the back-end limit when debts are high', () => {
    const r = homeAffordability({ ...base, monthlyDebts: 1500 })!;
    expect(r.limitedBy).toBe('back-end');
    expect(r.monthlyHousing).toBeCloseTo(3600 - 1500, 6);
  });
  it('returns null when fixed costs exceed the budget', () => {
    expect(homeAffordability({ ...base, monthlyDebts: 4000 })).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { rentVsBuy, type RentVsBuyInput } from './rent-vs-buy';

const base: RentVsBuyInput = {
  years: 10, monthlyRent: 2000, rentIncreasePct: 3, rentersInsuranceYearly: 200,
  homePrice: 400000, downPaymentPct: 20, mortgageRatePct: 6.5, loanYears: 30,
  propertyTaxPct: 1.1, homeInsuranceYearly: 1800, maintenancePct: 1, appreciationPct: 3,
  buyingCostsPct: 3, sellingCostsPct: 6, investmentReturnPct: 5,
};

describe('rentVsBuy', () => {
  it('sums rent with annual increases', () => {
    const r = rentVsBuy({ ...base, years: 2 });
    expect(r.totalRentCost).toBeCloseTo(2000 * 12 + 200 + 2060 * 12 + 200, 6);
  });

  it('with no costs, no appreciation, and cash purchase, buying costs nothing', () => {
    const r = rentVsBuy({ ...base, downPaymentPct: 100, propertyTaxPct: 0, homeInsuranceYearly: 0, maintenancePct: 0, appreciationPct: 0, buyingCostsPct: 0, sellingCostsPct: 0, investmentReturnPct: 0 });
    expect(r.totalBuyCost).toBeCloseTo(0, 6);
    expect(r.equityAtEnd).toBeCloseTo(400000, 6);
  });

  it('produces a yearly timeline and a break-even year', () => {
    const r = rentVsBuy(base);
    expect(r.timeline).toHaveLength(10);
    expect(r.timeline[0]!.buyCumulative).toBeGreaterThan(r.timeline[0]!.rentCumulative);
    if (r.breakEvenYear !== null) {
      const t = r.timeline[r.breakEvenYear - 1]!;
      expect(t.buyCumulative).toBeLessThan(t.rentCumulative);
    }
  });

  it('counts the opportunity cost of upfront cash', () => {
    const r = rentVsBuy({ ...base, years: 1 });
    expect(r.opportunityCost).toBeCloseTo((80000 + 12000) * 0.05, 6);
  });
});

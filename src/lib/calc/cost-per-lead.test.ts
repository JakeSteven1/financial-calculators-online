import { describe, expect, it } from 'vitest';
import { adFunnel, costPerLead } from './cost-per-lead';

describe('costPerLead', () => {
  it('divides spend by leads', () => {
    expect(costPerLead(5000, 200)).toBe(25);
    expect(costPerLead(5000, 0)).toBeNaN();
  });
});

describe('adFunnel', () => {
  it('works through the funnel', () => {
    const r = adFunnel({ costPerClick: 2, clickToLeadPct: 10, leadToCustomerPct: 20, customerValue: 500 });
    expect(r.costPerLead).toBeCloseTo(20, 10);
    expect(r.costPerCustomer).toBeCloseTo(100, 10);
    expect(r.valuePerClick).toBeCloseTo(10, 10);
    expect(r.breakEvenCpc).toBeCloseTo(10, 10);
    expect(r.roiPct).toBeCloseTo(400, 10);
  });
});

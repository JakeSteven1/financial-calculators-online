import { describe, expect, it } from 'vitest';
import { customerAcquisitionCost } from './cac';

describe('customerAcquisitionCost', () => {
  it('divides total spend by new customers', () => {
    const r = customerAcquisitionCost({ marketingSpend: 20000, salesSpend: 15000, otherCosts: 5000, newCustomers: 200 })!;
    expect(r.totalSpend).toBe(40000);
    expect(r.cac).toBe(200);
    expect(r.paybackMonths).toBeNaN();
  });
  it('computes payback and LTV:CAC', () => {
    const r = customerAcquisitionCost({ marketingSpend: 20000, salesSpend: 0, otherCosts: 0, newCustomers: 100, monthlyRevenuePerCustomer: 50, grossMarginPct: 80, lifetimeValue: 1200 })!;
    expect(r.paybackMonths).toBe(5);
    expect(r.ltvToCac).toBe(6);
  });
  it('requires customers', () => {
    expect(customerAcquisitionCost({ marketingSpend: 1, salesSpend: 0, otherCosts: 0, newCustomers: 0 })).toBeNull();
  });
});

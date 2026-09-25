import { describe, expect, it } from 'vitest';
import { customerLifetimeValue } from './clv';

const base = { avgPurchaseValue: 50, purchasesPerYear: 4, grossMargin: 100 };

describe('customerLifetimeValue', () => {
  it('lifespan mode: value × frequency × years', () => {
    const res = customerLifetimeValue({ ...base, mode: 'lifespan', lifespanYears: 3 })!;
    expect(res.annualValue).toBe(200);
    expect(res.clv).toBe(600);
  });

  it('applies gross margin', () => {
    expect(customerLifetimeValue({ ...base, grossMargin: 30, mode: 'lifespan', lifespanYears: 3 })!.clv).toBeCloseTo(180, 10);
  });

  it('retention mode: V / (1 − r)', () => {
    const res = customerLifetimeValue({ ...base, mode: 'retention', retentionRate: 75 })!;
    expect(res.expectedLifespanYears).toBe(4);
    expect(res.clv).toBeCloseTo(800, 10);
  });

  it('discounts retention cash flows', () => {
    // V(1+d)/(1+d−r) = 200 × 1.1 / 0.4 = 550
    expect(customerLifetimeValue({ ...base, mode: 'retention', retentionRate: 70, discountRate: 10 })!.clv).toBeCloseTo(550, 10);
  });

  it('discounts a fixed lifespan as an annuity due', () => {
    // 200 + 200/1.1 + 200/1.21
    const expected = 200 + 200 / 1.1 + 200 / 1.21;
    expect(customerLifetimeValue({ ...base, mode: 'lifespan', lifespanYears: 3, discountRate: 10 })!.clv).toBeCloseTo(expected, 8);
  });

  it('compares with acquisition cost', () => {
    const res = customerLifetimeValue({ ...base, mode: 'lifespan', lifespanYears: 3, acquisitionCost: 150 })!;
    expect(res.netClv).toBe(450);
    expect(res.clvToCac).toBe(4);
    expect(customerLifetimeValue({ ...base, mode: 'lifespan', lifespanYears: 3 })!.clvToCac).toBeNaN();
  });

  it('rejects 100% retention', () => {
    expect(customerLifetimeValue({ ...base, mode: 'retention', retentionRate: 100 })).toBeNull();
  });
});

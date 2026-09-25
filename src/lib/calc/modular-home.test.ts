import { describe, expect, it } from 'vitest';
import { modularHomeCost } from './modular-home';
import { monthlyPayment } from './loan';

describe('modularHomeCost', () => {
  const costs = { land: 50000, landPrep: 10000, transport: 8000, permits: 2000, water: 5000, septic: 10000, electrical: 5000, foundation: 20000, modules: 150000, setup: 30000, driveway: 10000 };
  it('totals costs by group', () => {
    const r = modularHomeCost(costs, 1800, { downPayment: 60000, ratePct: 7, years: 30 });
    expect(r.total).toBe(300000);
    expect(r.byGroup).toEqual({ site: 70000, utilities: 20000, structure: 200000, extras: 10000 });
    expect(r.costPerSqFtExLand).toBeCloseTo(250000 / 1800, 10);
    expect(r.siteToStructurePct).toBe(25);
  });
  it('finances the total less the down payment', () => {
    const r = modularHomeCost(costs, 1800, { downPayment: 60000, ratePct: 7, years: 30 });
    expect(r.loanAmount).toBe(240000);
    expect(r.monthlyPayment).toBeCloseTo(monthlyPayment(240000, 7, 360), 10);
  });
  it('handles an all-cash purchase', () => {
    const r = modularHomeCost(costs, 0, { downPayment: 500000, ratePct: 7, years: 30 });
    expect(r.loanAmount).toBe(0);
    expect(r.monthlyPayment).toBe(0);
    expect(r.cashNeeded).toBe(300000);
    expect(r.costPerSqFtExLand).toBeNaN();
  });
});

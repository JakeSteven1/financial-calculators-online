import { describe, expect, it } from 'vitest';
import { budget503020 } from './budget';

describe('budget503020', () => {
  it('splits monthly take-home pay', () => {
    const r = budget503020({ income: 5000, period: 'monthly', preTax: false, taxPct: 0, needsPct: 50, wantsPct: 30, savingsPct: 20 });
    expect(r.needs.monthly).toBe(2500);
    expect(r.wants.monthly).toBe(1500);
    expect(r.savings.monthly).toBe(1000);
    expect(r.savings.annual).toBe(12000);
    expect(r.totalPct).toBe(100);
  });
  it('removes taxes from pre-tax annual income', () => {
    const r = budget503020({ income: 80000, period: 'annual', preTax: true, taxPct: 25, needsPct: 50, wantsPct: 30, savingsPct: 20 });
    expect(r.monthlyTakeHome).toBe(5000);
    expect(r.needs.annual).toBe(30000);
  });
});

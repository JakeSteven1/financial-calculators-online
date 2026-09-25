import { describe, expect, it } from 'vitest';
import { lifeInsuranceNeed, suggestedYears } from './life-insurance';

describe('lifeInsuranceNeed', () => {
  it('adds needs and subtracts resources', () => {
    const r = lifeInsuranceNeed({ annualIncome: 80000, yearsToReplace: 10, debts: 20000, mortgageBalance: 250000, dependents: 2, educationPerDependent: 50000, finalExpenses: 15000, existingCoverage: 100000, savings: 50000 });
    expect(r.totalNeeds).toBe(800000 + 20000 + 250000 + 100000 + 15000);
    expect(r.recommended).toBe(1185000 - 150000);
  });
  it('never recommends negative coverage', () => {
    expect(lifeInsuranceNeed({ annualIncome: 0, yearsToReplace: 0, debts: 0, mortgageBalance: 0, dependents: 0, educationPerDependent: 0, finalExpenses: 0, existingCoverage: 10, savings: 0 }).recommended).toBe(0);
  });
  it('suggests replacement years by age', () => {
    expect(suggestedYears(30)).toBe(20);
    expect(suggestedYears(55)).toBe(10);
    expect(suggestedYears(70)).toBe(5);
  });
});

import { describe, expect, it } from 'vitest';
import { drawdown, projectSavings, realReturnPct, safeWithdrawal } from './retirement';

describe('projectSavings', () => {
  it('matches the future value of an ordinary annuity', () => {
    const rows = projectSavings({ currentAge: 30, retirementAge: 65, currentSavings: 20000, annualContribution: 6000, returnPct: 7 });
    expect(rows).toHaveLength(35);
    const g = 1.07 ** 35;
    const expected = 20000 * g + 6000 * ((g - 1) / 0.07);
    expect(rows.at(-1)!.balance).toBeCloseTo(expected, 4);
    expect(rows.at(-1)!.totalContributions).toBe(20000 + 6000 * 35);
  });
  it('grows contributions each year', () => {
    const rows = projectSavings({ currentAge: 60, retirementAge: 62, currentSavings: 0, annualContribution: 1000, contributionGrowthPct: 10, returnPct: 0 });
    expect(rows.at(-1)!.balance).toBeCloseTo(2100, 10);
  });
});

describe('realReturnPct', () => {
  it('uses the Fisher relation', () => {
    expect(realReturnPct(7, 3)).toBeCloseTo(3.8835, 4);
  });
});

describe('drawdown', () => {
  it('lasts when growth covers withdrawals', () => {
    const r = drawdown({ startAge: 65, endAge: 95, startBalance: 1_000_000, annualSpending: 40000, otherIncome: 0, taxPct: 0, returnPct: 4 });
    expect(r.depletedAge).toBeNull();
    expect(r.endingBalance).toBeGreaterThan(0);
  });
  it('runs out with zero return after balance ÷ withdrawal years', () => {
    const r = drawdown({ startAge: 65, endAge: 100, startBalance: 500000, annualSpending: 70000, otherIncome: 20000, taxPct: 0, returnPct: 0 });
    expect(r.annualWithdrawal).toBe(50000);
    expect(r.depletedAge).toBe(75);
  });
  it('grosses withdrawals up for tax', () => {
    expect(drawdown({ startAge: 65, endAge: 66, startBalance: 1e6, annualSpending: 40000, otherIncome: 0, taxPct: 20, returnPct: 0 }).annualWithdrawal).toBe(50000);
  });
  it('safe withdrawal', () => {
    expect(safeWithdrawal(1_000_000)).toBe(40000);
  });
});

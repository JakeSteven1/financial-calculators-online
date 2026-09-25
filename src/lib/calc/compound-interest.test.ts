import { describe, expect, it } from 'vitest';
import { compoundInterest, futureValue } from './compound-interest';

describe('futureValue', () => {
  it('matches A = P(1 + r/n)^(nt)', () => {
    expect(futureValue(1000, 5, 10, 1)).toBeCloseTo(1628.89, 2);
    expect(futureValue(1000, 5, 10, 12)).toBeCloseTo(1647.01, 2);
  });
  it('returns the principal at 0%', () => {
    expect(futureValue(1000, 0, 10, 12)).toBe(1000);
  });
});

describe('compoundInterest', () => {
  it('matches the closed form with no contributions', () => {
    for (const n of [1, 4, 12, 365]) {
      const res = compoundInterest({ principal: 5000, annualRate: 7, years: 15, compoundsPerYear: n });
      expect(res.finalBalance).toBeCloseTo(futureValue(5000, 7, 15, n), 6);
    }
  });

  it('adds end-of-month contributions (future value of an annuity)', () => {
    // Monthly compounding: FV = P(1+i)^N + C((1+i)^N - 1)/i
    const i = 0.06 / 12;
    const N = 120;
    const expected = 10000 * (1 + i) ** N + 200 * (((1 + i) ** N - 1) / i);
    const res = compoundInterest({ principal: 10000, annualRate: 6, years: 10, compoundsPerYear: 12, monthlyContribution: 200 });
    expect(res.finalBalance).toBeCloseTo(expected, 6);
    expect(res.totalContributions).toBe(10000 + 200 * 120);
    expect(res.totalInterest).toBeCloseTo(expected - 34000, 6);
  });

  it('produces one schedule row per year, including a partial final year', () => {
    const res = compoundInterest({ principal: 1000, annualRate: 5, years: 2.5, compoundsPerYear: 1 });
    expect(res.schedule.map((y) => y.year)).toEqual([1, 2, 3]);
    expect(res.schedule[1]!.balance).toBeCloseTo(1102.5, 6);
  });
});

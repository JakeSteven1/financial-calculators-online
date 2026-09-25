import { describe, expect, it } from 'vitest';
import { amortize, monthlyPayment, monthsToPayoff, remainingBalance, summarizeByYear } from './loan';

describe('monthlyPayment', () => {
  it('matches standard values', () => {
    expect(monthlyPayment(200000, 6, 360)).toBeCloseTo(1199.1, 2);
    expect(monthlyPayment(25000, 7, 60)).toBeCloseTo(495.03, 2);
    expect(monthlyPayment(1200, 0, 12)).toBe(100);
  });
});

describe('amortize', () => {
  it('pays the loan to zero and totals interest', () => {
    const res = amortize(200000, 6, 360);
    expect(res.rows).toHaveLength(360);
    expect(res.rows.at(-1)!.balance).toBeCloseTo(0, 6);
    expect(res.totalInterest).toBeCloseTo(1199.1 * 360 - 200000, -1);
    expect(res.totalPaid - res.totalInterest).toBeCloseTo(200000, 6);
  });
  it('first payment splits into interest and principal', () => {
    const first = amortize(200000, 6, 360).rows[0]!;
    expect(first.interest).toBeCloseTo(1000, 6);
    expect(first.principal).toBeCloseTo(199.1, 2);
  });
  it('extra payments shorten the loan and cut interest', () => {
    const base = amortize(200000, 6, 360);
    const extra = amortize(200000, 6, 360, 200);
    expect(extra.payoffMonths).toBeLessThan(300);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest - 50000);
  });
  it('summarizes by year', () => {
    const years = summarizeByYear(amortize(10000, 5, 24).rows);
    expect(years).toHaveLength(2);
    expect(years[1]!.endBalance).toBeCloseTo(0, 6);
    expect(years[0]!.principal + years[1]!.principal).toBeCloseTo(10000, 6);
  });
});

describe('monthsToPayoff and remainingBalance', () => {
  it('inverts monthlyPayment', () => {
    expect(monthsToPayoff(200000, 6, monthlyPayment(200000, 6, 360))).toBeCloseTo(360, 6);
    expect(monthsToPayoff(100000, 6, 400)).toBe(Infinity);
  });
  it('remaining balance matches the schedule', () => {
    const rows = amortize(200000, 6, 360).rows;
    expect(remainingBalance(200000, 6, 360, 60)).toBeCloseTo(rows[59]!.balance, 6);
  });
});

import { describe, expect, it } from 'vitest';
import { simpleInterest, termInYears } from './simple-interest';

describe('simpleInterest', () => {
  it('computes interest plus principal', () => {
    expect(simpleInterest(10000, 5, 3)).toEqual({ interest: 1500, total: 11500 });
  });
  it('handles zero rate', () => {
    expect(simpleInterest(500, 0, 10).total).toBe(500);
  });
  it('converts term units', () => {
    expect(termInYears(18, 'months')).toBe(1.5);
    expect(termInYears(73, 'days')).toBeCloseTo(0.2, 10);
    expect(simpleInterest(1000, 12, termInYears(6, 'months')).interest).toBeCloseTo(60, 10);
  });
});

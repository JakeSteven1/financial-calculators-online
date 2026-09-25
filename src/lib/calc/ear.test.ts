import { describe, expect, it } from 'vitest';
import { effectiveAnnualRate, nominalFromEffective } from './ear';

describe('effectiveAnnualRate', () => {
  it('matches known values', () => {
    expect(effectiveAnnualRate(12, 12)).toBeCloseTo(12.6825, 4);
    expect(effectiveAnnualRate(10, 1)).toBeCloseTo(10, 10);
    expect(effectiveAnnualRate(10, Infinity)).toBeCloseTo(10.5171, 4);
  });
  it('inverts', () => {
    for (const n of [1, 4, 12, 365, Infinity]) expect(nominalFromEffective(effectiveAnnualRate(7.5, n), n)).toBeCloseTo(7.5, 10);
  });
});

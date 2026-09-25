import { describe, expect, it } from 'vitest';
import { fv, nper, pmt, pv, rate, solveTvm } from './tvm';

// Reference values from Excel/Google Sheets FV, PV, PMT, NPER, RATE.
describe('tvm', () => {
  it('fv', () => {
    expect(fv({ rate: 0.05, periods: 10, pmt: -100, pv: -1000, timing: 'end' })).toBeCloseTo(2886.68, 2);
    expect(fv({ rate: 0.05, periods: 10, pmt: -100, pv: -1000, timing: 'begin' })).toBeCloseTo(2949.57, 2);
    expect(fv({ rate: 0, periods: 10, pmt: -100, pv: -1000, timing: 'end' })).toBe(2000);
  });

  it('pv', () => {
    expect(pv({ rate: 0.08 / 12, periods: 240, pmt: 500, fv: 0, timing: 'end' })).toBeCloseTo(-59777.15, 2);
  });

  it('pmt', () => {
    // 30-year $200k mortgage at 6%
    expect(pmt({ rate: 0.005, periods: 360, pv: 200000, fv: 0, timing: 'end' })).toBeCloseTo(-1199.1, 2);
    expect(pmt({ rate: 0, periods: 10, pv: 1000, fv: 0, timing: 'end' })).toBe(-100);
  });

  it('nper', () => {
    expect(nper({ rate: 0.01, pmt: -100, pv: 1000, fv: 0, timing: 'end' })).toBeCloseTo(10.5886, 4);
    expect(nper({ rate: 0.05, pmt: 0, pv: -1000, fv: 2000, timing: 'end' })).toBeCloseTo(14.2067, 4);
  });

  it('rate', () => {
    expect(rate({ periods: 360, pmt: -1199.1, pv: 200000, fv: 0, timing: 'end' })).toBeCloseTo(0.005, 6);
    expect(rate({ periods: 10, pmt: 0, pv: -1000, fv: 2000, timing: 'end' })).toBeCloseTo(0.071773, 6);
  });

  it('round-trips through solveTvm', () => {
    const base = { rate: 0.004, periods: 60, pmt: -250, pv: -5000, fv: 0, timing: 'end' as const };
    const future = solveTvm('fv', base);
    expect(solveTvm('pv', { ...base, fv: future })).toBeCloseTo(-5000, 6);
    expect(solveTvm('pmt', { ...base, fv: future })).toBeCloseTo(-250, 6);
    expect(solveTvm('periods', { ...base, fv: future })).toBeCloseTo(60, 6);
    expect(solveTvm('rate', { ...base, fv: future })).toBeCloseTo(0.004, 8);
  });
});

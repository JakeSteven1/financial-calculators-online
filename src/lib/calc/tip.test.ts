import { describe, expect, it } from 'vitest';
import { calculateTip } from './tip';

describe('calculateTip', () => {
  it('computes tip and split', () => {
    expect(calculateTip(100, 20, 4)).toEqual({ tip: 20, total: 120, perPerson: 30, tipPerPerson: 5 });
  });
  it('tips on the pre-tax amount', () => {
    expect(calculateTip(108, 20, 1, 8)!.tip).toBe(20);
  });
  it('rounds each share up', () => {
    const r = calculateTip(87.5, 18, 3, 0, true)!;
    expect(r.perPerson).toBe(35);
    expect(r.total).toBe(105);
    expect(r.tip).toBeCloseTo(17.5, 10);
  });
  it('rejects bad input', () => {
    expect(calculateTip(0, 20)).toBeNull();
    expect(calculateTip(50, 20, 0)).toBeNull();
  });
});

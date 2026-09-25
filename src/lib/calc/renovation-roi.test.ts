import { describe, expect, it } from 'vitest';
import { renovationRoi } from './renovation-roi';

describe('renovationRoi', () => {
  it('computes ROI and cost recovered', () => {
    expect(renovationRoi(30000, 21000)).toEqual({ netGain: -9000, roiPct: -30, costRecoveredPct: 70 });
    expect(renovationRoi(10000, 15000)!.roiPct).toBe(50);
  });
  it('requires a positive cost', () => {
    expect(renovationRoi(0, 100)).toBeNull();
  });
});

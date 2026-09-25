import { describe, expect, it } from 'vitest';
import { marginOfError, sampleSize } from './sample-size';

describe('sampleSize', () => {
  it('matches the classic 385 for 95% ± 5%', () => {
    expect(sampleSize('95', 5)).toBe(385);
  });
  it('applies the finite population correction', () => {
    expect(sampleSize('95', 5, 1000)).toBe(278);
    expect(sampleSize('99', 3, 10000)).toBe(1557);
  });
  it('uses the expected proportion', () => {
    expect(sampleSize('95', 5, undefined, 20)).toBe(246);
  });
  it('rejects bad input', () => {
    expect(sampleSize('95', 0)).toBeNaN();
    expect(sampleSize('97', 5)).toBeNaN();
  });
});

describe('marginOfError', () => {
  it('inverts the sample size formula', () => {
    expect(marginOfError('95', 385)).toBeCloseTo(4.99, 2);
    expect(marginOfError('95', 278, 1000)).toBeCloseTo(4.99, 1);
  });
});

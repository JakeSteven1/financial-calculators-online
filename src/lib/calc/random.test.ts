import { describe, expect, it } from 'vitest';
import { cryptoRng, randomInt, sampleWithoutReplacement, weightedSampleWithoutReplacement } from './random';

/** Deterministic RNG cycling through the given values. */
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length]!;
};

describe('cryptoRng', () => {
  it('stays within [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = cryptoRng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('randomInt', () => {
  it('maps the RNG onto an inclusive range', () => {
    expect(randomInt(1, 10, () => 0)).toBe(1);
    expect(randomInt(1, 10, () => 0.9999)).toBe(10);
  });
});

describe('sampleWithoutReplacement', () => {
  it('returns distinct items', () => {
    const picked = sampleWithoutReplacement([1, 2, 3, 4, 5], 5);
    expect(new Set(picked).size).toBe(5);
  });
  it('caps count at the pool size', () => {
    expect(sampleWithoutReplacement(['a', 'b'], 10)).toHaveLength(2);
  });
  it('is deterministic with a fixed RNG', () => {
    expect(sampleWithoutReplacement(['a', 'b', 'c'], 2, seq(0.99, 0))).toEqual(['c', 'b']);
  });
});

describe('weightedSampleWithoutReplacement', () => {
  it('respects weights', () => {
    const weights = new Map([['a', 1], ['b', 3]]);
    // total 4: 0.2*4=0.8 -> a; 0.5*4=2 -> b
    expect(weightedSampleWithoutReplacement(weights, 1, () => 0.2)).toEqual(['a']);
    expect(weightedSampleWithoutReplacement(weights, 1, () => 0.5)).toEqual(['b']);
  });
  it('never repeats a winner', () => {
    const weights = new Map([['a', 100], ['b', 1], ['c', 1]]);
    const winners = weightedSampleWithoutReplacement(weights, 3);
    expect(new Set(winners).size).toBe(3);
  });
});

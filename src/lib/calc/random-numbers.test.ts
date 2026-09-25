import { describe, expect, it } from 'vitest';
import { generateRandomNumbers } from './random-numbers';

describe('generateRandomNumbers', () => {
  it('stays within the inclusive range', () => {
    const res = generateRandomNumbers({ min: 1, max: 6, count: 500, allowRepeats: true });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(Math.min(...res.numbers)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...res.numbers)).toBeLessThanOrEqual(6);
    }
  });

  it('produces unique numbers when repeats are off', () => {
    const res = generateRandomNumbers({ min: 1, max: 10, count: 10, allowRepeats: false, sort: true });
    expect(res).toEqual({ ok: true, numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
  });

  it('handles swapped bounds and huge ranges', () => {
    const res = generateRandomNumbers({ min: 1e12, max: 1, count: 3, allowRepeats: false });
    expect(res.ok && new Set(res.numbers).size).toBe(3);
  });

  it('rejects impossible requests', () => {
    expect(generateRandomNumbers({ min: 1, max: 3, count: 5, allowRepeats: false }).ok).toBe(false);
    expect(generateRandomNumbers({ min: 1.2, max: 1.8, count: 1, allowRepeats: true }).ok).toBe(false);
    expect(generateRandomNumbers({ min: 1, max: 3, count: 0, allowRepeats: true }).ok).toBe(false);
  });
});

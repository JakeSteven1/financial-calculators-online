import { describe, expect, it } from 'vitest';
import { DRAFT_VALUE_CHART, evaluateTrade, overallPick, pickValue } from './draft-trade';

describe('draft value chart', () => {
  it('covers 224 picks and is non-increasing', () => {
    expect(DRAFT_VALUE_CHART).toHaveLength(224);
    for (let i = 1; i < DRAFT_VALUE_CHART.length; i++) {
      expect(DRAFT_VALUE_CHART[i]!).toBeLessThanOrEqual(DRAFT_VALUE_CHART[i - 1]!);
    }
  });
  it('matches the original first-round values', () => {
    expect(DRAFT_VALUE_CHART.slice(0, 10)).toEqual([3000, 2600, 2200, 1800, 1700, 1600, 1500, 1400, 1350, 1300]);
  });
});

describe('pickValue', () => {
  it('converts round and pick to an overall pick', () => {
    expect(overallPick({ round: 2, pick: 3 }, 10)).toBe(13);
    expect(pickValue({ round: 2, pick: 3 }, 10)).toBe(1150);
    expect(pickValue({ round: 1, pick: 1 }, 12)).toBe(3000);
  });
  it('returns 0 for invalid or out-of-chart picks', () => {
    expect(pickValue({ round: 1, pick: 11 }, 10)).toBe(0);
    expect(pickValue({ round: 30, pick: 1 }, 10)).toBe(0);
  });
});

describe('evaluateTrade', () => {
  it('flags the side receiving more value', () => {
    const res = evaluateTrade([{ round: 1, pick: 1 }], [{ round: 1, pick: 5 }, { round: 1, pick: 10 }], 10);
    expect(res.valueA).toBe(3000);
    expect(res.valueB).toBe(3000);
    expect(res.verdict).toBe('fair');
  });
  it('reports the difference', () => {
    const res = evaluateTrade([{ round: 1, pick: 2 }], [{ round: 2, pick: 1 }], 10);
    expect(res.difference).toBe(2600 - 1250);
    expect(res.verdict).toBe('A');
  });
});

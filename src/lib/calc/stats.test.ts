import { describe, expect, it } from 'vitest';
import { mean, median, mode, parseDataset, quartiles, standardDeviation, sum, variance } from './stats';

describe('parseDataset', () => {
  it('splits on common separators and reports junk', () => {
    expect(parseDataset('1, 2;3\n4\t5  -6.5 x')).toEqual({ values: [1, 2, 3, 4, 5, -6.5], invalid: ['x'] });
  });
});

describe('central tendency', () => {
  it('sum and mean', () => {
    expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6, 15);
    expect(mean([2, 4, 4, 4, 5, 5, 7, 9])).toBe(5);
    expect(mean([])).toBeNaN();
  });
  it('median for odd and even counts', () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
  it('mode, including ties and no mode', () => {
    expect(mode([1, 2, 2, 3])).toEqual({ modes: [2], frequency: 2 });
    expect(mode([1, 1, 2, 2, 3])).toEqual({ modes: [1, 2], frequency: 2 });
    expect(mode([1, 2, 3]).modes).toEqual([]);
  });
});

describe('spread', () => {
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  it('population and sample standard deviation', () => {
    expect(standardDeviation(data, 'population')).toBe(2);
    expect(variance(data, 'sample')).toBeCloseTo(32 / 7, 12);
    expect(standardDeviation([5], 'sample')).toBeNaN();
  });
});

describe('quartiles', () => {
  it('exclusive method (median of halves)', () => {
    const q = quartiles([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49])!;
    expect([q.q1, q.q2, q.q3]).toEqual([15, 40, 43]);
    const even = quartiles([1, 2, 3, 4, 5, 6, 7, 8])!;
    expect([even.q1, even.q2, even.q3]).toEqual([2.5, 4.5, 6.5]);
  });
  it('inclusive method matches Excel QUARTILE.INC', () => {
    const q = quartiles([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49], 'inclusive')!;
    expect([q.q1, q.q2, q.q3]).toEqual([25.5, 40, 42.5]);
  });
  it('flags outliers with Tukey fences', () => {
    const q = quartiles([1, 2, 3, 4, 5, 6, 7, 100])!;
    expect(q.outliers).toEqual([100]);
  });
  it('handles empty data', () => {
    expect(quartiles([])).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { classifyWealth, expectedNetWorth, lifetimeWealthRatio } from './wealth-ratio';

describe('wealth ratio', () => {
  it('computes lifetime wealth ratio', () => {
    expect(lifetimeWealthRatio(500000, 200000, 1500000)).toBe(20);
    expect(lifetimeWealthRatio(1, 0, 0)).toBeNaN();
  });
  it('computes expected net worth and class', () => {
    expect(expectedNetWorth(40, 100000)).toBe(400000);
    expect(classifyWealth(800000, 400000)).toBe('PAW');
    expect(classifyWealth(400000, 400000)).toBe('AAW');
    expect(classifyWealth(200000, 400000)).toBe('UAW');
  });
});

import { describe, expect, it } from 'vitest';
import { marginToMarkup, markupToMargin, solveSales } from './sales';

const figures = (known: Parameters<typeof solveSales>[0]) => {
  const res = solveSales(known);
  if (!res.ok) throw new Error(res.error);
  return res.figures;
};

describe('solveSales', () => {
  const expected = { cost: 60, revenue: 100, profit: 40, margin: 40, markup: 66.6667 };
  const pairs: Parameters<typeof solveSales>[0][] = [
    { cost: 60, revenue: 100 },
    { cost: 60, profit: 40 },
    { cost: 60, margin: 40 },
    { cost: 60, markup: 200 / 3 },
    { revenue: 100, profit: 40 },
    { revenue: 100, margin: 40 },
    { revenue: 100, markup: 200 / 3 },
    { profit: 40, margin: 40 },
    { profit: 40, markup: 200 / 3 },
  ];
  it.each(pairs)('solves from %o', (known) => {
    const f = figures(known);
    expect(f.cost).toBeCloseTo(expected.cost, 6);
    expect(f.revenue).toBeCloseTo(expected.revenue, 6);
    expect(f.profit).toBeCloseTo(expected.profit, 6);
    expect(f.margin).toBeCloseTo(expected.margin, 6);
    expect(f.markup).toBeCloseTo(expected.markup, 3);
  });

  it('uses the first two fields in order', () => {
    const res = solveSales({ cost: 60, revenue: 100, margin: 10 });
    expect(res.ok && res.usedFields).toEqual(['cost', 'revenue']);
  });

  it('rejects margin + markup and a 100% margin', () => {
    expect(solveSales({ margin: 40, markup: 50 }).ok).toBe(false);
    expect(solveSales({ cost: 10, margin: 100 }).ok).toBe(false);
    expect(solveSales({ cost: 10 }).ok).toBe(false);
  });
});

describe('margin/markup conversion', () => {
  it('round-trips', () => {
    expect(marginToMarkup(40)).toBeCloseTo(66.6667, 3);
    expect(markupToMargin(50)).toBeCloseTo(33.3333, 3);
    expect(markupToMargin(marginToMarkup(25))).toBeCloseTo(25, 10);
  });
});

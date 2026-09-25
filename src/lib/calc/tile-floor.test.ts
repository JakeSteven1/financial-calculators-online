import { describe, expect, it } from 'vitest';
import { TILE_EXTRAS, tileFloorCost } from './tile-floor';

describe('tileFloorCost', () => {
  it('adds waste to material only', () => {
    const r = tileFloorCost({ areaSqFt: 100, materialPricePerSqFt: 7, wastePct: 10, laborPerSqFt: 5 })!;
    expect(r.materialSqFt).toBeCloseTo(110, 10);
    expect(r.total).toBeCloseTo(770 + 500, 10);
  });
  it('adds optional extras', () => {
    const r = tileFloorCost({ areaSqFt: 200, materialPricePerSqFt: 2, wastePct: 0, supplies: true, equipment: true, removal: true, disposal: true })!;
    expect(r.total).toBeCloseTo(400 + 200 * TILE_EXTRAS.suppliesPerSqFt + 79 + 652 + 200 * TILE_EXTRAS.disposalPerSqFt, 10);
    expect(r.perSqFt).toBeCloseTo(r.total / 200, 10);
  });
  it('requires an area', () => {
    expect(tileFloorCost({ areaSqFt: 0, materialPricePerSqFt: 2, wastePct: 0 })).toBeNull();
  });
});

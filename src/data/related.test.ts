import { describe, expect, it } from 'vitest';
import { CALCULATORS } from './calculators';
import { RELATED, getRelated } from './related';

describe('related calculators', () => {
  it('gives every calculator 3 to 5 distinct, valid related links', () => {
    const slugs = new Set(CALCULATORS.map((c) => c.slug));
    expect(Object.keys(RELATED).sort()).toEqual([...slugs].sort());
    for (const [slug, related] of Object.entries(RELATED)) {
      expect(related.length, slug).toBeGreaterThanOrEqual(3);
      expect(related.length, slug).toBeLessThanOrEqual(5);
      expect(new Set(related).size, slug).toBe(related.length);
      expect(related, slug).not.toContain(slug);
      for (const r of related) expect(slugs.has(r), `${slug} -> ${r}`).toBe(true);
    }
  });

  it('links to every calculator from at least one other calculator', () => {
    const targets = new Set(Object.values(RELATED).flat());
    expect(CALCULATORS.filter((c) => !targets.has(c.slug)).map((c) => c.slug)).toEqual([]);
  });

  it('lists same-hub calculators first', () => {
    const hubs = getRelated('car-loan-calculator').map((c) => c.hub);
    const firstOther = hubs.findIndex((h) => h !== 'financial-calculators-online');
    expect(firstOther).toBeGreaterThan(0);
    expect(hubs.slice(firstOther).every((h) => h !== 'financial-calculators-online')).toBe(true);
  });
});

import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CALCULATORS, HUBS, hubForPath } from './calculators';

const PAGES_DIR = new URL('../pages/', import.meta.url);
const calculatorPages = readdirSync(PAGES_DIR)
  .filter((f) => f.endsWith('.astro') && readFileSync(new URL(f, PAGES_DIR), 'utf8').includes('<CalculatorLayout'))
  .map((f) => f.replace(/\.astro$/, ''));

describe('calculator registry', () => {
  it('main nav is the five hubs in order', () => {
    expect(HUBS.map((h) => [h.navLabel, `/${h.slug}/`])).toEqual([
      ['Financial', '/financial-calculators-online/'],
      ['Business', '/free-business-calculators/'],
      ['Statistics', '/free-online-statistics-calculators/'],
      ['Home', '/home-calculators-online/'],
      ['Personal Finance', '/personal-financial-calculators/'],
    ]);
  });

  it('registers each calculator once, in a known hub', () => {
    const slugs = CALCULATORS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of CALCULATORS) expect(HUBS.map((h) => h.slug)).toContain(c.hub);
  });

  it('matches the calculator pages one to one', () => {
    expect([...calculatorPages].sort()).toEqual(CALCULATORS.map((c) => c.slug).sort());
  });

  it('resolves the active hub for hub and calculator paths', () => {
    expect(hubForPath('/home-calculators-online/')).toBe('home-calculators-online');
    expect(hubForPath('/mean-online-calculator/')).toBe('free-online-statistics-calculators');
    expect(hubForPath('/')).toBeUndefined();
    expect(hubForPath('/privacy-policy-2/')).toBeUndefined();
  });
});

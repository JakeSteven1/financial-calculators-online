import { describe, expect, it } from 'vitest';
import { clampCount, cleanEntries, drawWinners, maskEntry, toCsv } from './giveaway';

const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length]!;
};

describe('cleanEntries', () => {
  it('splits lines and commas, trims, drops blanks, and dedupes case-insensitively', () => {
    const res = cleanEntries(' a@x.com \n\nB@x.com, a@x.com;A@X.COM\r\n\tc@x.com\n', { emailsOnly: true });
    expect(res.entries).toEqual(['a@x.com', 'B@x.com', 'c@x.com']);
    expect(res.counts).toEqual([3, 1, 1]);
    expect(res.found).toBe(5);
    expect(res.duplicates).toBe(2);
    expect(res.invalid).toBe(0);
  });
  it('drops invalid emails only when asked', () => {
    const text = 'Name,Email\nJane,jane@x.com\n@sam_ig';
    const strict = cleanEntries(text, { emailsOnly: true });
    expect(strict.entries).toEqual(['jane@x.com']);
    expect(strict.invalid).toBe(4);
    expect(strict.invalidSamples).toEqual(['Name', 'Email', 'Jane', '@sam_ig']);
    const loose = cleanEntries(text, { emailsOnly: false });
    expect(loose.entries).toEqual(['Name', 'Email', 'Jane', 'jane@x.com', '@sam_ig']);
    expect(loose.invalid).toBe(0);
  });
  it('strips CSV quotes', () => {
    expect(cleanEntries('"a@x.com","b@x.com"', { emailsOnly: true }).entries).toEqual(['a@x.com', 'b@x.com']);
  });
  it('handles empty input', () => {
    expect(cleanEntries(' \n , \n', { emailsOnly: false })).toMatchObject({ found: 0, entries: [], duplicates: 0 });
  });
  it('stays fast with 100,000 entries', () => {
    const text = Array.from({ length: 100_000 }, (_, i) => `user${i % 60_000}@example.com`).join('\n');
    const start = performance.now();
    const res = cleanEntries(text, { emailsOnly: true });
    expect(performance.now() - start).toBeLessThan(1000);
    expect(res.entries).toHaveLength(60_000);
    expect(res.duplicates).toBe(40_000);
  });
});

describe('drawWinners', () => {
  const entries = ['a', 'b', 'c', 'd', 'e'];
  it('returns distinct winners and alternates', () => {
    const res = drawWinners(entries, 2, 3);
    expect(res.winners).toHaveLength(2);
    expect(res.alternates).toHaveLength(3);
    expect(new Set([...res.winners, ...res.alternates]).size).toBe(5);
  });
  it('runs out of alternates before winners when the list is short', () => {
    const res = drawWinners(['a', 'b', 'c'], 2, 5);
    expect(res.winners).toHaveLength(2);
    expect(res.alternates).toHaveLength(1);
  });
  it('is deterministic with a fixed RNG', () => {
    expect(drawWinners(entries, 1, 1, undefined, seq(0.99, 0))).toEqual({ winners: ['e'], alternates: ['b'] });
  });
  it('uses weights when given', () => {
    // weights 1 and 3: 0.5 * 4 = 2 falls in b's range
    expect(drawWinners(['a', 'b'], 1, 0, [1, 3], () => 0.5).winners).toEqual(['b']);
    const res = drawWinners(['a', 'b', 'c'], 3, 0, [100, 1, 1]);
    expect(new Set(res.winners).size).toBe(3);
  });
  it('draws uniformly', () => {
    const tally = new Map<string, number>();
    for (let i = 0; i < 20_000; i++) {
      const [w] = drawWinners(entries, 1, 0).winners;
      tally.set(w!, (tally.get(w!) ?? 0) + 1);
    }
    for (const e of entries) expect(tally.get(e)! / 20_000).toBeCloseTo(0.2, 1);
  });
});

describe('clampCount', () => {
  it('clamps to the range and floors decimals', () => {
    expect(clampCount('3.7', 1, 50)).toBe(3);
    expect(clampCount('500', 1, 50)).toBe(50);
    expect(clampCount('-2', 0, 50)).toBe(0);
    expect(clampCount('abc', 1, 50)).toBe(1);
  });
});

describe('maskEntry', () => {
  it('masks emails, handles, and names', () => {
    expect(maskEntry('jane.doe@gmail.com')).toBe('j***@gmail.com');
    expect(maskEntry('@janedoe')).toBe('@j***');
    expect(maskEntry('Jane Doe')).toBe('J***');
    expect(maskEntry('x')).toBe('x');
  });
});

describe('toCsv', () => {
  it('quotes fields that need it and neutralizes formulas', () => {
    expect(toCsv([['Position', 'Entry'], [1, 'a,b'], [2, 'say "hi"'], [3, '=SUM(A1)'], [4, '@handle']])).toBe(
      'Position,Entry\r\n1,"a,b"\r\n2,"say ""hi"""\r\n3,\'=SUM(A1)\r\n4,\'@handle\r\n',
    );
  });
});

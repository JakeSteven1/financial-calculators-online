import { describe, expect, it } from 'vitest';
import { analyzeEmailList, isValidEmail } from './email-list';

describe('isValidEmail', () => {
  it('accepts normal addresses and rejects junk', () => {
    expect(isValidEmail('jane.doe+promo@example.co.uk')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
  });
});

describe('analyzeEmailList', () => {
  it('counts totals, duplicates, and invalid entries', () => {
    const res = analyzeEmailList('a@x.com\nB@x.com, a@x.com; A@X.COM\nbad\n\n c@x.com ');
    expect(res.total).toBe(6);
    expect(res.unique).toEqual(['a@x.com', 'b@x.com', 'c@x.com']);
    expect(res.duplicates).toBe(2);
    expect(res.invalid).toEqual(['bad']);
    expect(res.counts.get('a@x.com')).toBe(3);
  });
  it('handles empty input', () => {
    expect(analyzeEmailList('   ').total).toBe(0);
  });
});
